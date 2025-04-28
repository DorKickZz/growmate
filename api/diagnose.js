export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST requests are allowed" });
    }
  
    const { photoBase64 } = req.body;
  
    if (!photoBase64) {
      return res.status(400).json({ error: "No photo provided" });
    }
  
    try {
      const response = await fetch("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        body: Buffer.from(photoBase64, "base64"),
      });
  
      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error contacting Hugging Face:", error);
      res.status(500).json({ error: "Failed to process image" });
    }
  }
  