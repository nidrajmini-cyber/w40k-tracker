import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const supabase = createClient(
  "https://khmbmhmkmwjaljvicrsz.supabase.co",
  process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobWJtaG1rbXdqYWxqdmljcnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzkwOTIsImV4cCI6MjA5NDE1NTA5Mn0.tfoNvKj4FYMq0yWpcNFUjNWpdLybZCzTGk1xdKEEZqc"
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ error: "gameId required" });
    }

    // 1. Récupérer la bataille actuelle
    const { data: bataille, error: battleErr } = await supabase
      .from("w40k_batailles")
      .select("*")
      .eq("id", gameId)
      .single();

    if (battleErr || !bataille) {
      return res.status(404).json({ error: "Battle not found" });
    }

    // 2. Récupérer les 10 dernières parties du joueur avec la même armée
    const { data: history, error: historyErr } = await supabase
      .from("w40k_batailles")
      .select("*")
      .order("date", { ascending: false })
      .limit(10);

    if (historyErr) {
      console.error("History fetch error:", historyErr);
    }

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
    const prompt = `Tu es un coach expert de Warhammer 40K V11. Tu analyses les parties de manière tactique, précise et utile. Tu parles comme un coach vétéran qui veut vraiment faire progresser son élève. Réponds TOUJOURS en français.

Voici la partie à analyser :
- Armée du joueur : ${bataille.liste_id || "Non spécifiée"}
- Adversaire : ${bataille.adversaire_faction || "Inconnu"}
- Détachement adverse : ${bataille.adversaire_detachement || "N/A"}
- Mission : ${bataille.scenario || "N/A"}
- Score : ${bataille.score_moi} - ${bataille.score_adversaire}
- Résultat : ${bataille.resultat}
- Date : ${bataille.date}
- Tour final : ${bataille.tour_fin || "N/A"}
- Premier joueur : ${bataille.premier_joueur || "Inconnu"}

Rapport détaillé de la partie :
${bataille.notes || "Pas de notes détaillées"}

Historique des 10 dernières parties :
${historySummary}

Donne-moi une analyse en 4 sections structurées (utilise les tirets --- pour séparer) :

**1. Le tournant de la partie**
Identifie le moment précis où la partie a basculé. Sois chirurgical et basé sur les infos fournie.

**2. Le pattern détecté**
En comparant avec l'historique, repère UNE faiblesse récurrente que tu peux observer.

**3. Le conseil actionnable**
Donne UN conseil très concret pour la prochaine partie. Cite des distances, des positions de déploiement ou des stratagèmes.

**4. La question de coach**
Pose UNE question qui force le joueur à réfléchir avant sa prochaine partie.

---
Format de réponse : utilise les -- comme séparateurs, SANS markdown gras ou italique.`;

    // 5. Appeler Claude
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const analysis = message.content[0]?.type === "text" ? message.content[0].text : "";

    // 6. Sauvegarder dans Supabase
    const { error: updateErr } = await supabase
      .from("w40k_batailles")
      .update({ coachanalysis: analysis })
      .eq("id", gameId);

    if (updateErr) {
      console.error("Update error:", updateErr);
      return res.status(500).json({ error: "Failed to save analysis" });
    }

    return res.status(200).json({ analysis });
  } catch (error) {
    console.error("Coach API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
