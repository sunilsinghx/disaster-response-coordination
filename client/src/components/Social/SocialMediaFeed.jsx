// src/components/SocialMediaFeed.jsx
import { useEffect, useRef, useState } from "react";
import { getSocialMediaPost } from "../../api/api.js";
import { formatDistanceToNow } from "date-fns";
import socket from "../../api/socket.js";
import NotificationBar from "../Layout/NotificationBar.jsx";

export default function SocialMediaFeed({ disaster }) {
  const [posts, setPosts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const timeoutRef = useRef(null);

  function highlightHashtags(text) {
    // Split text by spaces, wrap hashtags in blue links
    return text.split(" ").map((word, i) => {
      if (word.startsWith("#")) {
        return (
          <a
            key={i}
            href={`https://bsky.social/search?q=${encodeURIComponent(word)}`}
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {word + " "}
          </a>
        );
      }
      return word + " ";
    });
  }

  // 1️⃣ Fetch initial posts when disaster changes
  useEffect(() => {
    if (!disaster) return;

    async function fetchPosts() {
      try {
        const data = await getSocialMediaPost(disaster.id);
        setPosts(data || []);
      } catch (error) {
        console.error("Failed to fetch social media posts", error);
      }
    }

    fetchPosts();
  }, [disaster]);

  // 2️⃣ Listen for real-time updates from WebSocket
  useEffect(() => {
    if (!disaster) return;

    const handler = (data) => {
      if (data.disaster_id !== disaster.id) return;

      // Add new posts at the top (preventing duplicates optional)
      setPosts((prev) => [...data.posts, ...prev]);

      setShowAlert(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowAlert(false), 3000);
    };

    socket.on("social_media_updated", handler);

    return () => {
      socket.off("social_media_updated", handler);
      clearTimeout(timeoutRef.current);
    };
  }, [disaster]);

  if (!disaster) return null;

  return (
    <div className="relative mt-12 p-3">
      <NotificationBar
        message="🔄 New social media post received!"
        visible={showAlert}
      />
      <h1
        className="text-2xl font-bold mb-4 
      "
      >
        Social Media Feed{" "}
      </h1>
      <div className="bg-white p-4 rounded shadow mb-4 mt-4">
        <h2 className="text-lg font-semibold mb-2">
          Social Media Reports{" "}
          <div className="flex flex-wrap">
            {disaster?.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-blue-400 text-gray-50 px-2 py-1 mr-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </h2>
        {posts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">
            No posts yet.
          </p>
        ) : (
          <ul className="max-h-[600px] overflow-y-auto space-y-6 pr-2">
            {posts.map((p, idx) => (
              <li
                key={idx}
                className="bg-neutral-100 border border-gray-300 rounded-lg shadow-sm p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {p.user_name || p.user_handle}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{p.user_handle}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(p.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <p className="text-gray-800 mb-3">
                  {highlightHashtags(p.post)}
                </p>
                <div className="flex space-x-8 text-gray-500 text-sm">
                  <HeartIcon />

                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Comment
                  </button>
                  <button className="flex items-center  gap-2 text-gray-600 hover:text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                    Share
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function HeartIcon() {
  const [like, setLike] = useState(false);

  return (
    <button
      onClick={() => setLike((prev) => !prev)}
      className={`flex items-center gap-2 cursor-pointer text-sm font-semibold select-none transition-colors
        ${like ? "text-red-600" : "text-gray-600 hover:text-red-600"}
      `}
    >
      <svg
        className={`w-5 h-5 transition-colors${
          like ? "text-red-600" : "text-gray-600 hover:text-red-600"
        }`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z" />
      </svg>
      <span>{like ? "Liked" : "Like"}</span>
    </button>
  );
}
