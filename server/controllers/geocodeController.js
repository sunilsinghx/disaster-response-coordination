import express from "express";
import axios from "axios";

export const geoCode = async (req, res) => {
  const { description } = req.body;

  try {
    // Step 1: Extract location name using Gemini 2.0 Flash model
    const geminiPrompt = `Extract location from this text: "${description}"`;

    const geminiRes = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: geminiPrompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    const locationName =
      geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!locationName) {
      return res.status(400).json({ error: "Location extraction failed" });
    }

    // Step 2: Convert to lat/lng using OpenStreetMap Nominatim
    const geoRes = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: locationName,
          format: "json",
          limit: 1,
        },
      }
    );

    const place = geoRes.data[0];

    if (!place) {
      return res.status(404).json({ error: "Location not found on map" });
    }

    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);

    return res.json({
      location_name: locationName,
      latitude: lat,
      longitude: lon,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
