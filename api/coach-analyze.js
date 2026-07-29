module.exports = async function handler(req, res) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log("Claude API key exists:", !!apiKey);
    
    if (!apiKey) {
      return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });
    }

    const prompt = "Give a brief 2-line coaching tip for Warhammer 40K.";

    // Nettoyer le prompt pour éviter les erreurs d'encodage
    const cleanPrompt = prompt
      .replace(/[\u2018\u2019\u201C\u201D]/g, "'")  // Guillemets courbes -> droits
      .replace(/[\u2013\u2014]/g, '-')               // Tirets cadratin -> tiret simple
      .replace(/[^\x00-\x7F]/g, '');                 // Supprime tout caractère non-ASCII

    console.log("Original prompt length:", prompt.length);
    console.log("Cleaned prompt length:", cleanPrompt.length);
    console.log("Cleaned prompt:", cleanPrompt.substring(0, 100));

    console.log("Calling Anthropic API...");
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: cleanPrompt,  // Utiliser le prompt nettoyé
          },
        ],
      }),
    });

    console.log("Anthropic response status:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Anthropic error:", errorData);
      return res.status(response.status).json({ 
        error: "Anthropic API error",
        details: errorData.substring(0, 200)
      });
    }

    const data = await response.json();
    console.log("Response received");
    
    const analysis = data.content[0]?.text || "No analysis generated";
    
    return res.status(200).json({ analysis });
    
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
