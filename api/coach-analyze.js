module.exports = async function handler(req, res) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log("=== DEBUG API KEY ===");
    console.log("API Key exists:", !!apiKey);
    console.log("API Key length:", apiKey?.length);
    console.log("API Key starts with:", apiKey?.substring(0, 20));
    console.log("API Key ends with:", apiKey?.substring(apiKey?.length - 20));
    
    // Vérifier les caractères problématiques
    if (apiKey) {
      for (let i = 0; i < apiKey.length; i++) {
        const char = apiKey.charCodeAt(i);
        if (char > 127) {
          console.log(`NON-ASCII char at index ${i}: code ${char}`);
        }
      }
    }
    
    if (!apiKey) {
      return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });
    }

    const prompt = "Test";

    console.log("Calling Anthropic API...");
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 100,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    console.log("Anthropic response status:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Anthropic error:", errorData.substring(0, 500));
      return res.status(response.status).json({ 
        error: "Anthropic API error",
        status: response.status
      });
    }

    const data = await response.json();
    const analysis = data.content[0]?.text || "No response";
    
    return res.status(200).json({ analysis });
    
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
