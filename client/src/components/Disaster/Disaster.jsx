// src/components/DisasterDetails.jsx
import React, { useState, useRef, useEffect } from "react";
import SocialMediaFeed from "../Social/SocialMediaFeed";
import ResourceList from "../Resource/ResourceList";
import { ReportList } from "../Report/Report";
import { useAuth } from "../../context/AuthContext";
import {
  deleteDisaster,
  getDisasterList,
  createDisaster,
  updateDisaster,
  geocodeLocation,
} from "../../api/api";
import { useNavigate } from "react-router-dom";
import socket from "../../api/socket";

export const Disaster = ({ selectedDisaster }) => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  if (!selectedDisaster) {
    return <p className="text-gray-500">No disaster selected.</p>;
  }

  const handleDelete = async () => {
    await deleteDisaster(selectedDisaster.id);
    navigate("/dashboard");
  };

  return (
    <div>
      {currentUser?.role === "admin" && (
        <>
          <button
            className="mb-4 mt-8 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "Cancel Edit" : "Edit Disaster"}
          </button>
          <button
            className="mb-4 ml-8 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete
          </button>
        </>
      )}

      {isEditing ? (
        <DisasterForm
          existingDisaster={selectedDisaster}
          onFinish={() => setIsEditing(false)}
        />
      ) : (
        <>
          <SocialMediaFeed disaster={selectedDisaster} />
          <ResourceList disaster={selectedDisaster} />
        </>
      )}
    </div>
  );
};

export const DisasterForm = ({ existingDisaster, onFinish }) => {
  const isEdit = !!existingDisaster;

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      setTitle(existingDisaster.title || "");
      setLocation(existingDisaster.location_name || "");
      setDescription(existingDisaster.description || "");
      setTags(existingDisaster.tags?.join(", ") || "");
    }
  }, [existingDisaster]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = tags.split(",").map((t) => t.trim());

    try {
      if (isEdit) {
        await updateDisaster(
          existingDisaster.id,
          title,
          location,
          description,
          tagsArray
        );
        navigate("/dashboard");
      } else {
        const { latitude, longitude } = await geocodeLocation(description);
        const response = await createDisaster(
          title,
          location,
          latitude,
          longitude,
          description,
          tagsArray
        );
      }

      if (onFinish) onFinish(); // callback to refresh list or close form
      // Reset form if not editing
      if (!isEdit) {
        setTitle("");
        setLocation("");
        setDescription("");
        setTags("");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Edit Disaster" : "Create Disaster"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 border rounded shadow max-w-md"
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location Name"
          className="w-full p-2 border rounded-sm"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          cols={5}
          required
          className="w-full p-2 border rounded"
        ></textarea>

        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="w-full p-2 border rounded"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {isEdit ? "Update Disaster" : "Create Disaster"}
        </button>
      </form>
    </div>
  );
};

export const DisasterList = ({ selectedDisaster, setSelectedDisaster }) => {
  const [disasterList, setDisasterList] = useState([]);
  const [tag, setTag] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  // Fetch initial list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDisasterList(tag);
        if (Array.isArray(res)) {
          setDisasterList(res);
        }
      } catch (error) {
        console.error("Error fetching disasters:", error);
      }
    };

    debounceRef.current = setTimeout(fetchData, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [tag]);

  useEffect(() => {
    if (!socket) return;

    const handleDisasterUpdate = (data) => {
      // `data` here is the payload sent by the server on "disaster_updated" event

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      setDisasterList((prevList) => {
        const index = prevList.findIndex((d) => d.id === data.id);

        //update
        if (index !== -1) {
          const newList = prevList.filter((d) => d.id != data.id);
          return newList;
        } else {
          return [data?.data, ...prevList];
          //new disaster
        }
      });
    };

    socket.on("disaster_updated", handleDisasterUpdate);

    return () => {
      socket.off("disaster_updated", handleDisasterUpdate);
    };
  }, [socket]);

  return (
    <div className="bg-white p-4 rounded shadow mb-4 relative">
      {showNotification && (
        <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white p-2 rounded mb-2 text-center z-10">
          🔔 New disasters updates!
        </div>
      )}

      <h2 className="text-lg font-semibold mb-2">Disasters List</h2>
      <input
        type="text"
        value={tag}
        placeholder="Search by tag"
        className="w-full p-2 border rounded-sm"
        onChange={(e) => setTag(e.target.value)}
      />

      <ul className="space-y-2 mt-7 ">
        {disasterList?.map((d) => {
          return (
            <li
              key={d.id}
              className={`p-2 border hover:bg-green-100 cursor-pointer ${
                selectedDisaster?.id === d?.id ? "bg-green-200" : ""
              }`}
              onClick={() => {
                setSelectedDisaster(d);
                navigate(`/dashboard/${d.id}`);
              }}
            >
              <div className="font-semibold">
                {d.title}{" "} 
                {selectedDisaster && 
                <span
                  className={`${
                    selectedDisaster?.id === d?.id
                      ? "flex right-0.5 text-red-600"
                      : ""
                  }`}
                >
                  selected
                </span>}
              </div>
              <div className="text-sm text-gray-500">📍 {d.location_name}</div>
              {d.tags && d.tags.length > 0 && (
                <div className="flex flex-wrap gap-2  m-3">
                  {d.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-400 text-gray-50 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
