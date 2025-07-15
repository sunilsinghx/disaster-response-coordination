import React from 'react';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-800 ">
      <h1 className="text-3xl font-bold mt-10 mb-4 text-blue-600">About — Disaster Response Coordination Platform</h1>
      <p className="mb-4 text-lg">
        This project is a <strong>(Node.js + React.js) backend-heavy disaster management platform</strong> that aggregates real-time data to support effective response during emergencies. It combines geospatial data processing, social media monitoring, and AI-assisted location extraction and verification.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">🔧 Tech Stack</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li><strong>Backend:</strong> Node.js, Express.js, Supabase (PostgreSQL with PostGIS)</li>
        <li><strong>Frontend:</strong> React + Tailwind CSS</li>
        <li><strong>APIs:</strong> Google Gemini API, Bluesky API, Mapping service (OpenStreetMap / Nominatim)</li>
        <li><strong>Real-time:</strong> WebSockets (Socket.IO)</li>
        <li><strong>AI Tooling:</strong> ChatGPT (used for helping making routes, Supabase queries, and WebSocket logic), Google Gemini</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">📦 Features Implemented</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>CRUD operations for disasters with audit trail tracking</li>
        <li>Location name extraction from disaster descriptions using <strong>Google Gemini API</strong></li>
        <li>Geocoding of locations using <strong>Nominatim</strong> (OpenStreetMap)</li>
        <li>Fetching real-time social media reports using the <strong>Bluesky API</strong></li>
        <li>Geospatial resource lookup using Supabase and <code>ST_DWithin</code></li>
        <li>Image authenticity verification via Gemini API</li>
        <li>Structured logging of backend actions</li>
        <li>Real-time WebSocket broadcasts for disaster updates and new reports</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">📋 Supabase Setup</h2>
      <p className="mb-4">
        Supabase is used as the primary database. It includes geospatial indexing, a caching table for API responses (e.g. Gemini, Bluesky), and real-time data management for disasters, reports, and resources.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">🔍 External Integrations</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li><strong>Gemini API</strong>: Extracts location names and verifies image authenticity</li>
        <li><strong>Bluesky API</strong>: Bluesky API for fetching social media disaster posts</li>
        <li><strong>OpenStreetMap (Nominatim)</strong>: Converts extracted locations into latitude and longitude</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">🚫 Not Implemented</h2>
      <ul className="list-disc ml-6 text-red-600">
        <li>Rate limiting on external APIs</li>
        <li>Fetching additional resource data (e.g., hospitals) from mapping services</li>
        <li>Priority alert system for urgent social media keywords (e.g., “SOS”)</li>
      </ul>

      

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">📁 Sample Data</h2>
      <pre className="bg-gray-800 p-4 text-white rounded text-sm overflow-x-auto mb-4">
{`Disaster:
{
  title: "NYC Flood",
  location_name: "Manhattan, NYC",
  description: "Heavy flooding in Manhattan",
  tags: ["flood", "urgent"],
  owner_id: "netrunnerX"
}

Report:
{
  disaster_id: "123",
  user_id: "citizen1",
  content: "Need food in Lower East Side",
  image_url: "http://example.com/flood.jpg",
  verification_status: "pending"
}

Resource:
{
  disaster_id: "123",
  name: "Red Cross Shelter",
  location_name: "Lower East Side, NYC",
  type: "shelter"
}`}
      </pre>

      <p className="mt-8 text-sm text-gray-600 mb-10">
        Note: This project is focused on backend logic and integrations, with a lightweight frontend to test core functionality.
      </p>
    </div>
  );
};

export default About;
