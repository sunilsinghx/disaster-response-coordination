import { supabase } from "../supabaseClient.js";

const createAuditEntry = (action, userId) => ({
  action,
  user_id: userId,
  timestamp: new Date().toISOString(),
});

//@desc create disaster
//@routes POST /disasters/
//@access Private
export const createDisaster = async (req, res) => {
  try {
    const {
      title,
      location_name,
      location, // { latitude, longitude }
      description,
      tags,
      owner_id,
      audit_trail = [],
    } = req.body;
    const userId = req.user?.id || req.body.owner_id || owner_id;

    const auditEntry = createAuditEntry("created", userId);
    const { data, error } = await supabase
      .from("disasters")
      .insert([
        {
          title,
          location_name,
          location: `SRID=4326;POINT(${location.longitude} ${location.latitude})`,
          description,
          tags,
          owner_id: userId,
          audit_trail: [...audit_trail, auditEntry],
        },
      ])
      .select();

    if (error) return res.status(400).json({ error: error.message });
    // Convert location WKT format to latitude and longitude
    const disaster = data[0];
    const locationWkt = disaster.location;

    // Parse the WKT to extract latitude and longitude
    const regex = /POINT\(([^ ]+) ([^ ]+)\)/;
    const match = locationWkt.match(regex);
    let latitude = null;
    let longitude = null;

    if (match) {
      longitude = parseFloat(match[1]);
      latitude = parseFloat(match[2]);
    }

    // Construct the response without audit_trail and created_at
    const disasterResponse = {
      id: disaster.id,
      title: disaster.title,
      location_name: disaster.location_name,
      latitude,
      longitude,
      description: disaster.description,
      tags: disaster.tags,
      owner_id: disaster.owner_id,
    };

    // Emit event with the cleaned-up disaster data
    req.io.emit("disaster_updated", {
      type: "created",
      data: disasterResponse,
    });

    // Send response with the relevant fields only
    res.status(201).json(disasterResponse);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating disaster", error: error.message });
  }
};

//@desc get disaster
//@routes GET /disasters?tag=
//@access Public
export const getDisasters = async (req, res) => {
  try {
    const { tag } = req.query;

    let query = supabase.from("disasters_with_latlon").select("*");

    if (tag && tag.trim() !== "") {
      query = query.contains("tags", [tag]);
    }

    const { data, error } = await query;

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "error getting disaster by tag", error: error.message });
  }
};

//@desc update disaster
//@routes PUT /disasters/:id
//@access Private
export const updateDisaster = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    const userId = req.user?.id || req.body.owner_id || updates.owner_id;

    if (updates.location) {
      const { latitude, longitude } = updates.location;
      updates.location = `SRID=4326;POINT(${longitude} ${latitude})`;
    }

    const { data: existing, error: fetchError } = await supabase
      .from("disasters")
      .select("audit_trail")
      .eq("id", id)
      .single();

    if (fetchError)
      return res.status(404).json({ error: "Disaster not found" });

    const auditEntry = createAuditEntry("updated", userId);
    updates.audit_trail = [...(existing.audit_trail || []), auditEntry];

    const { data, error } = await supabase
      .from("disasters")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    req.io.emit("disaster_updated", {
      type: "updated",
      data: data[0],
    });

    res.json(data[0]);
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Server error" });
  }
};

//@desc delete disaster
//@routes DELETE /disasters/:id
//@access Private
export const deleteDisaster = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.body.owner_id || updates.owner_id;

    const { data: existing, error: fetchError } = await supabase
      .from("disasters")
      .select("audit_trail")
      .eq("id", id)
      .single();

    if (fetchError)
      return res.status(404).json({ error: "Disaster not found" });

    const auditEntry = createAuditEntry("deleted", userId);
    const updatedTrail = [...(existing.audit_trail || []), auditEntry];

    await supabase
      .from("disasters")
      .update({ audit_trail: updatedTrail })
      .eq("id", id);

    const { error } = await supabase.from("disasters").delete().eq("id", id);
    console.log(error);

    if (error) return res.status(400).json({ error: error.message });

    req.io.emit("disaster_updated", {
      type: "delete",
      id,
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
