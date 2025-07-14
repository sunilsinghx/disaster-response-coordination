// src/components/NotificationBar.jsx
export default function NotificationBar({ message, visible }) {
  if (!visible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in-out">
      {message}
    </div>
  );
}
