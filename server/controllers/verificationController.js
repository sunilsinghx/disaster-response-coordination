import axios from "axios";
import { supabase } from "../supabaseClient.js";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const verifyImage = async (req, res) => {
  const { id: disasterId } = req.params;
  const { imageUrl } = req.body;

  if (!imageUrl) {
    console.log(`[${new Date().toISOString()}] ERROR: Image URL is required`);
    return res.status(400).json({ error: "Image URL is required" });
  }

  const { data: disaster } = await supabase
    .from("disasters")
    .select("title")
    .eq("id", disasterId)
    .single();

  try {
    // Download the image
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const contentType = imageResponse.headers["content-type"];
    const base64Image = Buffer.from(imageResponse.data, "binary").toString(
      "base64"
    );

    // Call Gemini API
    const geminiRes = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: contentType,
                  data: base64Image,
                },
              },
              {
                text: `Analyze the image in context of the disaster titled "${disaster?.title}". Determine if the image is genuinely related to this disaster type. Then check if the image shows signs of digital manipulation (e.g., edits, overlays, AI generation). Return one of: "authentic", "manipulated", or "unrelated to disaster".`,
              },
            ],
          },
        ],
      }
    );

    const responseText =
      geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No result";

    const result = {
      imageUrl,
      verified: !responseText.toLowerCase().includes("manipulated"),
    };

    console.log(
      `[${new Date().toISOString()}] SUCCESS: Image verification result for disasterId=${disasterId}`,
      result
    );

    res.json(result);
  } catch (error) {
    console.log(
      `[${new Date().toISOString()}] ERROR: Image verification failed for disasterId=${disasterId}`,
      error?.response?.data || error.message
    );
    res.status(500).json({ error: "Image verification failed" });
  }
};
