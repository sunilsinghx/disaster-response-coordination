import { useEffect, useState } from "react";
import { getResourceList } from "../../api/api.js";
import socket from "../../api/socket.js";
import NotificationBar from "../Layout/NotificationBar.jsx";

export default function ResourceList({ disaster }) {
  const [resources, setResources] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  // 1️⃣ Fetch resources when disaster changes
  useEffect(() => {
    if (!disaster) return;

    async function fetchResourceList() {
      try {
        const data = await getResourceList(disaster);
        setResources(data);
      } catch (error) {
        console.error("Failed to fetch resources", error);
      }
    }

    fetchResourceList();
  }, [disaster]);

  // 2️⃣ Listen for WebSocket updates
  useEffect(() => {
    if (!disaster) return;

    const handleResourceUpdate = (update) => {
      if (!update?.disaster_id) return;
      if (update.disaster_id !== disaster.id) return;

      if (Array.isArray(update.resources)) {
        // full list replacement
        const currentIds = resources
          .map((r) => r.id)
          .sort()
          .join(",");
        const incomingIds = update.resources
          .map((r) => r.id)
          .sort()
          .join(",");

        if (currentIds !== incomingIds) {
          setResources(update.resources);
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        }
      } else if (update.resource) {
        // add single resource if not already present
        const exists = resources.some((r) => r.id === update.resource.id);
        if (!exists) {
          setResources((prev) => [...prev, update.resource]);
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        }
      }
    };

    socket.on("resources_updated", handleResourceUpdate);

    return () => {
      socket.off("resources_updated", handleResourceUpdate);
    };
  }, [disaster, resources]);

  if (!disaster) return null;

  return (
    <div className="bg-white p-4 rounded shadow mb-4 relative max-h-[600px] overflow-y-auto space-y-6">
      {/* Use your reusable NotificationBar */}
      <NotificationBar
        message="🔔 New resources available!"
        visible={showAlert}
      />

      <h2 className="text-lg font-semibold mb-2">Nearby Resources</h2>
      {resources.length === 0 ? (
        <p className="text-sm text-gray-500">No resources found.</p>
      ) : (
        <ul className="space-y-2">
          {resources.map((r) => (
            <li key={r.id} className="p-2 border rounded">
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-gray-500">{r.location_name}</div>
              <div className="text-xs text-blue-500">{r.type}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
