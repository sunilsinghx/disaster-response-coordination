import { supabase } from "../supabaseClient.js";

export const getReports = async (req, res) => {
  const { id: disasterId } = req.params;

  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("disaster_id", disasterId);
    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error fetching nearby resources:", err.message);
    res.status(500).json({ error: "Failed to get reports" });
  }
};

export const createReport = async (req, res) => {
  const { content, imageUrl, user_id, disasterId, verified } = req.body;
  try {
    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          disaster_id: disasterId,
          content,
          image_url: imageUrl || null,
          user_id: user_id || null,
          created_at: new Date().toISOString(),
          verification_status: verified,
        },
      ])
      .select();

    if (error) throw error;

    res
      .status(201)
      .json({ message: "Report created successfully", report: data[0] });
  } catch (err) {
    console.error("Error creating report:", err.message);
    res.status(500).json({ error: "Failed to create report" });
  }
};
