// src/components/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const users = [
    { username: "netrunnerX", role: "admin" },
    { username: "reliefAdmin", role: "contributor" },
    { username: "fieldAgent", role: "contributor" },
  ];

  const [selectedUser, setSelectedUser] = useState(users[0]);

  const handleLogin = () => {
    if (!selectedUser) return;

    login(selectedUser.username);
  };

  const handleChange = (e) => {
    const selectedUsername = e.target.value;
    const userObj = users.find((u) => u.username === selectedUsername);
    setSelectedUser(userObj);
  };

  return (
    <div className="bg-white shadow p-4 rounded mb-4 w-full max-w-sm">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select User (Mock Login)
      </label>
      <select
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded"
      >
        {users.map((u) => (
          <option key={u.username} value={u.username}>
            {u.username} ({u.role})
          </option>
        ))}
      </select>
      {selectedUser && (
        <p className="mt-2 text-sm text-gray-500">
          Log in as <strong>{selectedUser.username}</strong> (
          {selectedUser?.role})
        </p>
      )}
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white py-2 mt-5 px-4 rounded  hover:bg-blue-700"
      >
        Login
      </button>
    </div>
  );
}
