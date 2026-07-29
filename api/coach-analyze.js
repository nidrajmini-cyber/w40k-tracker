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

    // Données simples - pas d'appel à Supabase pour éviter les erreurs ByteString
    const prompt = `Tu es un coach Warhammer 40K. Donne une analyse rapide en 4 points pour une partie (sépare par --):
1. Le tournant
2. Une faiblesse
3. Un conseil
4. Une question

Sois concis (2-3 lignes par point).`;

    console.log("🔵 Calling Anthropic API...");
    
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
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

    if (!claudeRes.ok) {
      const errData = await claudeRes.json();
      console.error("Claude API error:", errData);
      return res.status(500).json({ error: "Claude API failed", details: errData });
    }

    const claudeData = await claudeRes.json();
    const analysis = claudeData.content[0]?.text || "Pas d'analyse disponible";
    
    console.log("✓ Analysis generated");
    return res.status(200).json({ analysis });
    
  } catch (error) {
    console.error("❌ Coach API error:", error);
    return res.status(500).json({ error: error.message });
  }
};
