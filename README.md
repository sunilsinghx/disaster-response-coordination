# 🌐 Disaster Response Coordination Platform

A backend-heavy disaster management platform built with **Node.js** and **React.js**, designed to assist emergency response using geospatial data, AI, and social media integrations.

---

## 📌 Overview

This project aggregates real-time disaster data, supports AI-based location extraction, and enables geospatial resource tracking to coordinate disaster responses effectively.

---

## 🔧 Tech Stack

- **Backend:** Node.js, Express.js, Supabase (PostgreSQL + PostGIS)
- **Frontend:** React + Tailwind CSS
- **APIs:**
  - Google Gemini API (location extraction, image verification)
  - Bluesky API (disaster-related social posts)
  - OpenStreetMap (geocoding)
- **Real-time:** Socket.IO
- **AI Tooling:** ChatGPT (logic & query generation), Google Gemini

---

## 📦 Features

- ✅ CRUD operations for disasters with audit trail
- ✅ AI-based location name extraction from descriptions (Gemini)
- ✅ Geocoding via Nominatim (OpenStreetMap)
- ✅ social media post fetch (Bluesky)
- ✅ Geospatial search with `ST_DWithin` (Supabase/PostGIS)
- ✅ Image verification using Gemini API
- ✅ WebSocket-based real-time updates
- ✅ Structured logging of backend operations

---
## 👤 Mock Users (for Testing)

Below are mock users used for development and testing:

| Role         | Username     | User ID      | Permissions                                      |
|--------------|--------------|--------------|--------------------------------------------------|
| Admin        | `netrunnerX` | `user_1005`  | create/edit/delete disasters        |
| Contributor  | `reliefAdmin`| `user_1002`  | Can report disasters and can view post,resources |
| Contributor  | `fieldAgent` | `user_1004`  | Can report disasters and can view post,resources |

---

## 📋 Supabase Setup

- Used as the primary database
- Includes:
  - Geospatial indexing (`geometry(Point, 4326)`)
  - Real-time disaster/report/resource tables
  - API cache table for Gemini and Bluesky responses

---

## 🔗 External Integrations

- **Google Gemini API**: Location extraction, image authenticity verification
- **Bluesky API**: Social media disaster post monitoring
- **OpenStreetMap (Nominatim)**: Geocoding text locations to lat/lng

---

## 📁 Sample Data

<details>
<summary>Disaster</summary>

```json
{
  "title": "NYC Flood",
  "location_name": "Manhattan, NYC",
  "description": "Heavy flooding in Manhattan",
  "tags": ["flood", "urgent"],
  "owner_id": "netrunnerX"
}
</details> <details> <summary>Report</summary>

{
  "disaster_id": "123",
  "user_id": "citizen1",
  "content": "Need food in Lower East Side",
  "image_url": "http://example.com/flood.jpg",
  "verification_status": "pending"
}
</details> <details> <summary>Resource</summary>

{
  "disaster_id": "123",
  "name": "Red Cross Shelter",
  "location_name": "Lower East Side, NYC",
  "type": "shelter"
}
</details> ```
