import { supabase } from "../supabaseClient.js";

const CACHE_TTL_MS = 3600000; //1hr
/*
export const getSocialMediaPosts = async (req, res) => {
  const { id: disasterId } = req.params;
  const cacheKey = `social_media_${disasterId}`;
  const now = new Date();
  try {
    // 1 check cache
    const { data: cached, error } = await supabase
      .from("cache")
      .select("*")
      .eq("key", cacheKey)
      .single();

    if (cached && new Date(cached.expires_at) > now) {

      return res.json(cached.value);
    }

    // 2. Fetch mock socail media post
    const mockPosts = [
      // {
      //   post: "#floodrelief Need urgent food in Lower East Side",
      //   user: "citizen1",
      //   timestamp: now.toISOString(),
      // },
      // {
      //   post: "Volunteers needed at Red Cross shelter",
      //   user: "helper42",
      //   timestamp: now.toISOString(),
      // },

      {
        "disaster_id": "4eb3bf61-afa7-4bc0-8336-827761b3350c",
        "user_handle": "fl_resident",
        "post": "Evacuating Miami Beach now. Hurricane winds are picking up! #hurricane #evacuation",
        "created_at": "2025-07-06T12:10:00Z"
      },
      {
        "disaster_id": "4eb3bf61-afa7-4bc0-8336-827761b3350c",
        "user_handle": "news_bot",
        "post": "Category 4 hurricane nearing Miami. Immediate evacuation advised!",
        "created_at": "2025-07-06T12:15:00Z"
      },
      {
        "disaster_id": "633f403b-f76a-4cee-aa61-bbbcb88f17e2",
        "user_handle": "stormwatcher92",
        "post": "Tornado just hit near OKC airport. Trees down everywhere. #emergency #tornado",
        "created_at": "2025-07-06T12:05:00Z"
      },
      {
        "disaster_id": "633f403b-f76a-4cee-aa61-bbbcb88f17e2",
        "user_handle": "rescue_ops",
        "post": "First responders en route to affected areas in Oklahoma City.",
        "created_at": "2025-07-06T12:20:00Z"
      },
      {
        "disaster_id": "35ce956f-c2d0-47c3-af8c-d09c1cc32f1e",
        "user_handle": "forestguard",
        "post": "Shasta fire is spreading rapidly. Evac orders issued in nearby towns.",
        "created_at": "2025-07-06T11:58:00Z"
      },
      {
        "disaster_id": "35ce956f-c2d0-47c3-af8c-d09c1cc32f1e",
        "user_handle": "fireupdateCA",
        "post": "Fire now moving southwest. Air support dispatched. #wildfire",
        "created_at": "2025-07-06T12:10:00Z"
      },
      {
        "disaster_id": "d951d823-c3f2-40c1-ad5d-6813c3c294be",
        "user_handle": "quakealertsf",
        "post": "Magnitude 6.8 quake shakes SF. Expect aftershocks. #earthquake",
        "created_at": "2025-07-06T11:50:00Z"
      },
      {
        "disaster_id": "d951d823-c3f2-40c1-ad5d-6813c3c294be",
        "user_handle": "citizenSF",
        "post": "My building is cracked. Please send help. We are in San Francisco Downtown.",
        "created_at": "2025-07-06T11:52:00Z"
      },
      {
        "disaster_id": "4912afdb-82dc-4e67-bf66-273717a3dc01",
        "user_handle": "localhelper",
        "post": "People trapped in flooded park area. Need rescue ASAP. #flood",
        "created_at": "2025-07-06T11:35:00Z"
      },
      {
        "disaster_id": "4912afdb-82dc-4e67-bf66-273717a3dc01",
        "user_handle": "city_alert",
        "post": "Downtown flooding confirmed. Avoid City Park region.",
        "created_at": "2025-07-06T11:40:00Z"
      }

    ];

    const filteredPosts = mockPosts.filter(
      (post) => post.disaster_id === disasterId
    );

    // 3. cache in supabase
    const expiresAt = new Date(now.getTime() + CACHE_TTL_MS).toISOString();

    await supabase.from("cache").upsert({
      key: cacheKey,
      value: filteredPosts,
      expires_at: expiresAt,
    });

    // 4. Emit Websocket event
    req.io.emit("social_media_updated", { disaster_id:disasterId, posts: filteredPosts });

    res.json(mockPosts);
  } catch (error) {
    console.error("Social media fetch failed:", error.message);
    res.status(500).json({ error: "Failed to fetch social media posts" });
  }
};*/

import dotenv from "dotenv";
dotenv.config();

import { AtpAgent } from "@atproto/api";

const agent = new AtpAgent({ service: "https://bsky.social" });

await agent.login({
  identifier: process.env.BLUESKY_USERNAME,
  password: process.env.BLUESKY_PASSWORD,
});

export const getSocialMediaPosts = async (req, res) => {
  const { id: disasterId } = req.params;
  const cacheKey = `social_media_${disasterId}`;
  const now = new Date();

  const mockPosts = [
    {
      post: "#floodrelief Need urgent food in Lower East Side",
      user: "citizen1",
      timestamp: now.toISOString(),
    },
    {
      post: "Volunteers needed at Red Cross shelter",
      user: "helper42",
      timestamp: now.toISOString(),
    },

    {
      disaster_id: "4eb3bf61-afa7-4bc0-8336-827761b3350c",
      user_handle: "fl_resident",
      post: "Evacuating Miami Beach now. Hurricane winds are picking up! #hurricane #evacuation",
      created_at: "2025-07-06T12:10:00Z",
    },
    {
      disaster_id: "4eb3bf61-afa7-4bc0-8336-827761b3350c",
      user_handle: "news_bot",
      post: "Category 4 hurricane nearing Miami. Immediate evacuation advised!",
      created_at: "2025-07-06T12:15:00Z",
    },
    {
      disaster_id: "633f403b-f76a-4cee-aa61-bbbcb88f17e2",
      user_handle: "stormwatcher92",
      post: "Tornado just hit near OKC airport. Trees down everywhere. #emergency #tornado",
      created_at: "2025-07-06T12:05:00Z",
    },
    {
      disaster_id: "633f403b-f76a-4cee-aa61-bbbcb88f17e2",
      user_handle: "rescue_ops",
      post: "First responders en route to affected areas in Oklahoma City.",
      created_at: "2025-07-06T12:20:00Z",
    },
    {
      disaster_id: "35ce956f-c2d0-47c3-af8c-d09c1cc32f1e",
      user_handle: "forestguard",
      post: "Shasta fire is spreading rapidly. Evac orders issued in nearby towns.",
      created_at: "2025-07-06T11:58:00Z",
    },
    {
      disaster_id: "35ce956f-c2d0-47c3-af8c-d09c1cc32f1e",
      user_handle: "fireupdateCA",
      post: "Fire now moving southwest. Air support dispatched. #wildfire",
      created_at: "2025-07-06T12:10:00Z",
    },
    {
      disaster_id: "d951d823-c3f2-40c1-ad5d-6813c3c294be",
      user_handle: "quakealertsf",
      post: "Magnitude 6.8 quake shakes SF. Expect aftershocks. #earthquake",
      created_at: "2025-07-06T11:50:00Z",
    },
    {
      disaster_id: "d951d823-c3f2-40c1-ad5d-6813c3c294be",
      user_handle: "citizenSF",
      post: "My building is cracked. Please send help. We are in San Francisco Downtown.",
      created_at: "2025-07-06T11:52:00Z",
    },
    {
      disaster_id: "4912afdb-82dc-4e67-bf66-273717a3dc01",
      user_handle: "localhelper",
      post: "People trapped in flooded park area. Need rescue ASAP. #flood",
      created_at: "2025-07-06T11:35:00Z",
    },
    {
      disaster_id: "4912afdb-82dc-4e67-bf66-273717a3dc01",
      user_handle: "city_alert",
      post: "Downtown flooding confirmed. Avoid City Park region.",
      created_at: "2025-07-06T11:40:00Z",
    },
  ];

  const filteredPosts = mockPosts.filter(
    (post) => post.disaster_id === disasterId
  );

  try {
    // Step 1: Check Supabase cache
    const { data: cached, error: cacheError } = await supabase
      .from("cache")
      .select("*")
      .eq("key", cacheKey)
      .single();

    if (cached && new Date(cached.expires_at) > now) {
      return res.json(cached.value);
    }

    // Step 2: Get disaster title from DB
    const { data: disaster, error: disasterError } = await supabase
      .from("disasters")
      .select("title")
      .eq("id", disasterId)
      .single();

    if (disasterError || !disaster?.title) {
      return res.status(404).json({ error: "Disaster not found" });
    }

    const searchQuery = disaster.title.toLowerCase();

    // Step 3: Search Bluesky using title
    const result = await agent.app.bsky.feed.searchPosts({
      q: searchQuery,
      limit: 10,
    });

    // Step 4: Format posts
    const posts = result?.data.posts.map((p) => ({
      disaster_id: disasterId,
      user_handle: p.author.handle, // e.g., user.bsky.social
      user_name: p.author.displayName || "", // e.g., John Doe (optional fallback)
      post: p.record.text,
      created_at: p.indexedAt,
    }));

    if (posts.length === 0) {
      posts = filteredPosts;
    }

    // Step 5: Cache posts in Supabase
    const expiresAt = new Date(now.getTime() + CACHE_TTL_MS).toISOString();
    await supabase.from("cache").upsert({
      key: cacheKey,
      value: posts,
      expires_at: expiresAt,
    });

    // Step 6: Emit WebSocket update
    req.io.emit("social_media_updated", {
      disaster_id: disasterId,
      posts,
    });

    // Step 7: Send response
    res.json(posts);
  } catch (error) {
    console.error("Social media fetch failed:", error.message);
    res.status(500).json({ error: "Failed to fetch social media posts" });
  }
};
