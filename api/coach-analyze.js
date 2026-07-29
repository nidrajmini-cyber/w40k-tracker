module.exports = async function handler(req, res) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
    }

    // Structure correcte pour l'API Anthropic : system en top-level
    const requestBody = {
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      system: "Tu es un coach expert Warhammer 40K V11. Analyse tactiquement et réponds en français.",
      messages: [
        {
          role: "user",
          content: "Donne-moi un conseil de coach pour ma prochaine partie.",
        }
      ],
    };
    
    console.log("🔵 ANTHROPIC REQUEST:", JSON.stringify(requestBody, null, 2));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Anthropic API Error:", errorText.substring(0, 500));
      return res.status(response.status).json({ 
        error: "Anthropic API error",
        status: response.status,
        details: errorText.substring(0, 200)
      });
    }

    const data = await response.json();
    console.log("✅ Response received from Anthropic");
    
    const analysis = data.content[0]?.text || "No analysis generated";
    
    return res.status(200).json({ analysis });
    
  } catch (error) {
    console.error("❌ Exception:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
