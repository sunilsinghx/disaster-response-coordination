// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import { DisasterForm, DisasterList } from "./Disaster/Disaster";

export default function Dashboard() {
  const { currentUser, selectedDisaster, setSelectedDisaster } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {currentUser?.id}</h1>

      <p className="text-lg text-gray-600 mb-4">
        Hello 👋 {currentUser?.username}
      </p>
      <DisasterList
        setSelectedDisaster={setSelectedDisaster}
        selectedDisaster={selectedDisaster}
      />

      {currentUser?.role === "admin" && (
        <>
          <DisasterForm />
        </>
      )}
    </div>
  );
}
