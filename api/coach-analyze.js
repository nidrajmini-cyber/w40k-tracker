module.exports = async function handler(req, res) {
  try {
    console.log("Coach API called");
    return res.status(200).json({ 
      analysis: "Test OK - API is working. This is a static response." 
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
