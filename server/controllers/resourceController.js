import { supabase } from "../supabaseClient.js";

export const getResourcesNearby = async (req, res) => {
  const { id: disasterId } = req.params;
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude required'" });
  }
  try {
    const { data, error } = await supabase.rpc("get_nearby_resources", {
      lat_input: parseFloat(lat),
      lon_input: parseFloat(lon),
      distance_m: 10000, // 10 km
    });
    if (error) throw error;

    req.io.emit("resources_updated", {
      disaster_id: disasterId,
      resources: data,
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching nearby resources:", err.message);
    res.status(500).json({ error: "Failed to get nearby resources" });
  }
};

export const createResource = async (req, res) => {
  const { id: disasterId } = req.params;
  const { name, location_name, lat, lon, type } = req.body;

  if (!name || !lat || !lon || !type) {
    return res
      .status(400)
      .json({ error: "name, lat, lon, and type are required" });
  }

  try {
    // Insert resource with geography point location
    const { data, error } = await supabase
      .from("resources")
      .insert([
        {
          disaster_id: disasterId,
          name,
          location_name,
          location: `POINT(${lon} ${lat})`, // PostGIS expects lon lat order
          type,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    console.log("resource created emiting now....");

    // Emit WebSocket event to notify clients (if using socket.io on req.io)
    if (req.io) {
      req.io.emit("resources_updated", {
        disaster_id: disasterId,
        resource: data,
      });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating resource:", error.message);
    res.status(500).json({ error: "Failed to create resource" });
  }
};
