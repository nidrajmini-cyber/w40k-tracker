const SUPABASE_URL = "https://khmbmhmkmwjaljvicrsz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobWJtaG1rbXdqYWxqdmljcnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzkwOTIsImV4cCI6MjA5NDE1NTA5Mn0.tfoNvKj4FYMq0yWpcNFUjNWpdLybZCzTGk1xdKEEZqc";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ error: "gameId required" });
    }

    console.log("🧠 Coach API: Analyzing game", gameId);

    // 1. Récupérer la bataille actuelle
    const battleRes = await fetch(
      `${SUPABASE_URL}/rest/v1/w40k_batailles?id=eq.${gameId}`,
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    const battles = await battleRes.json();
    if (!battles || battles.length === 0) {
      return res.status(404).json({ error: "Battle not found" });
    }
    const bataille = battles[0];
    console.log("✓ Battle found:", bataille.adversaire_faction);

    // 2. Récupérer les 10 dernières parties
    const historyRes = await fetch(
      `${SUPABASE_URL}/rest/v1/w40k_batailles?order=date.desc&limit=10`,
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    const history = await historyRes.json();
    console.log("✓ History fetched:", history?.length || 0, "battles");

    // 3. Construire le résumé de l'historique
    const historySummary =
      history && history.length > 0
        ? history
            .map((b, i) => {
              const result = b.resultat === "Victoire" ? "✓" : "✗";
              return `${i + 1}. ${result} ${b.adversaire_faction} (${b.score_moi}-${b.score_adversaire}) - ${b.scenario || "N/A"}`;
            })
            .join("\n")
        : "Pas d'historique disponible";

    // 4. Construire le prompt
    const prompt = `Tu es un coach expert de Warhammer 40K V11. Tu analyses les parties de manière tactique, précise et utile. Réponds TOUJOURS en français.

Voici la partie à analyser :
- Armée du joueur : ${bataille.liste_id || "Non spécifiée"}
- Adversaire : ${bataille.adversaire_faction || "Inconnu"}
- Détachement adverse : ${bataille.adversaire_detachement || "N/A"}
- Mission : ${bataille.scenario || "N/A"}
- Score : ${bataille.score_moi} - ${bataille.score_adversaire}
- Résultat : ${bataille.resultat}
- Date : ${bataille.date}
- Tour final : ${bataille.tour_fin || "N/A"}

Rapport détaillé :
${bataille.notes || "Pas de notes détaillées"}

Historique des 10 dernières parties :
${historySummary}

Donne-moi une analyse en 4 sections (utilise les tirets -- pour séparer) :

**1. Le tournant de la partie**
Identifie le moment précis où la partie a basculé. Sois chirurgical.

**2. Le pattern détecté**
En comparant avec l'historique, repère UNE faiblesse récurrente.

**3. Le conseil actionnable**
Donne UN conseil très concret pour la prochaine partie.

**4. La question de coach**
Pose UNE question qui force le joueur à réfléchir.

---`;

    // 5. Appeler Claude via API HTTP
    console.log("🔵 Calling Anthropic API...");
    
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const claudeData = await claudeRes.json();

    if (!claudeRes.ok) {
      console.error("Claude API error:", claudeData);
      return res.status(500).json({ error: "Claude API failed", details: claudeData });
    }

    const analysis = claudeData.content[0]?.text || "";
    console.log("✓ Claude response received");

    // 6. Sauvegarder dans Supabase
    console.log("💾 Saving analysis to Supabase...");
    
    // Construire la requête avec WHERE clause
    const updateRes = await fetch(
      `${SUPABASE_URL}/rest/v1/w40k_batailles?id=eq.${gameId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": SUPABASE_KEY,  // Utiliser x-api-key au lieu de Authorization
        },
        body: JSON.stringify({ 
          coachanalysis: analysis 
        }),
      }
    );

    const updateText = await updateRes.text();
    console.log("Supabase update response:", updateRes.status, updateText);

    if (!updateRes.ok) {
      console.error("Supabase update error:", updateText);
      // Continue anyway - l'analyse a été créée, même si la sauvegarde en DB a échoué
      console.warn("⚠️ Analysis not saved to DB but returning it anyway");
    } else {
      console.log("✓ Analysis saved to Supabase");
    }

    return res.status(200).json({ analysis });
  } catch (error) {
    console.error("❌ Coach API error:", error);
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
};
