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

    // 1. Récupérer la bataille actuelle (GET simple)
    const battleRes = await fetch(
      `${SUPABASE_URL}/rest/v1/w40k_batailles?id=eq.${gameId}&select=*`,
      {
        method: "GET",
        headers: {
          "apikey": SUPABASE_KEY,
        },
      }
    );

    const battles = await battleRes.json();
    if (!battles || !Array.isArray(battles) || battles.length === 0) {
      console.error("Battle fetch failed:", battles);
      return res.status(404).json({ error: "Battle not found", data: battles });
    }
    const bataille = battles[0];
    console.log("✓ Battle found:", bataille.adversaire_faction);

    // 2. Récupérer les 10 dernières parties (GET simple)
    const historyRes = await fetch(
      `${SUPABASE_URL}/rest/v1/w40k_batailles?order=date.desc&limit=10&select=*`,
      {
        method: "GET",
        headers: {
          "apikey": SUPABASE_KEY,
        },
      }
    );

    const history = await historyRes.json();
    console.log("✓ History fetched:", history?.length || 0, "battles");

    // 3. Construire le résumé de l'historique
    const historySummary =
      history && Array.isArray(history) && history.length > 0
        ? history
            .map((b, i) => {
              const result = b.resultat === "Victoire" ? "✓" : "✗";
              return `${i + 1}. ${result} ${b.adversaire_faction} (${b.score_moi}-${b.score_adversaire})`;
            })
            .join("\n")
        : "Pas d'historique disponible";

    // 4. Construire le prompt
    const prompt = `Tu es un coach expert de Warhammer 40K V11. Tu analyses les parties de manière tactique et précise. Réponds TOUJOURS en français.

Bataille à analyser :
- Adversaire : ${bataille.adversaire_faction || "Inconnu"}
- Mission : ${bataille.scenario || "N/A"}
- Score : ${bataille.score_moi} - ${bataille.score_adversaire}
- Résultat : ${bataille.resultat}

Rapport :
${bataille.notes || "Pas de notes"}

Historique récent :
${historySummary}

Donne une analyse rapide en 4 points (sépare par --) :
1. Le tournant de la partie
2. Une faiblesse détectée
3. Un conseil concret
4. Une question pour progresser`;

    // 5. Appeler Claude
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
    console.log("✓ Claude analysis generated");

    // 6. Retourner l'analyse (pas de sauvegarde en DB pour éviter les erreurs ByteString)
    console.log("✓ Returning analysis to frontend");
    return res.status(200).json({ 
      analysis,
      message: "Analysis generated successfully (not persisted to DB yet)"
    });
    
  } catch (error) {
    console.error("❌ Coach API error:", error);
    return res.status(500).json({ error: error.message });
  }
};
