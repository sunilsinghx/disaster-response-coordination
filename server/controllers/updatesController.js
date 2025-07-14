import axios from "axios";
import * as cheerio from "cheerio";

import { supabase } from "../supabaseClient.js";

const CACHE_TTL_MS = 3600000;

export const getOfficialUpdates = async (req, res) => {
  const { id: disasterId } = req.params;
  const cacheKey = `offical_updates_${disasterId}`;
  const now = new Date();

  try {
    //check cache
    const { data: cached } = await supabase
      .from("cache")
      .select("*")
      .eq("key", cacheKey)
      .single();

    if (cached && new Date(cached.expires_at) > now) {
      return res.json(cached.value);
    }

    // Mock scrape (replace with real URLs)
    const urls = ["https://www.redcross.org/", "https://www.fema.gov/"];
    let updates = [];

    for (const url of urls) {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      $("a").each((i, el) => {
        const text = $(el).text().trim();
        const href = $(el).attr("href");
        if (
          text.toLowerCase().includes("disaster") ||
          text.toLowerCase().includes("relief")
        ) {
          updates.push({ source: url, text, link: href });
        }
      });
    }

    // Cache
    const expiresAt = new Date(now.getTime() + CACHE_TTL_MS).toISOString();
    await supabase.from("cache").upsert({
      key: cacheKey,
      value: updates,
      expires_at: expiresAt,
    });

    req.io.emit("official_updates_updated", { disasterId, updates });

    res.json(updates);
  } catch (error) {
    console.error("Error scraping official updates:", err.message);
    res.status(500).json({ error: "Failed to fetch official updates" });
  }
};
