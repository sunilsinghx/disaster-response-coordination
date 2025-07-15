import React from "react";
import { useAuth } from "../../context/AuthContext"; // Adjust path as needed
import { Link } from "react-router-dom"; // if using React Router
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const { currentUser, selectedDisaster, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md px-6 absolute w-full py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Disaster Response
      </Link>

      <ul className="flex space-x-6 items-center">
        <li>
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-500">
            All Disasters
          </Link>
        </li>
        <li>
          {selectedDisaster && currentUser.role === "contributor" && (
            <Link
              to={`/dashboard/${selectedDisaster.id}/report`}
              className="text-gray-700 hover:text-blue-500"
            >
              Report
            </Link>
          )}
        </li>
        <li>
          <Link to="/about" className="text-gray-700 hover:text-blue-500">
            About
          </Link>
        </li>

        {currentUser ? (
          <>
            <li>
              <span className="text-sm text-gray-600 mr-2">
                Hi, {currentUser.username}
              </span>
              <button
                onClick={() => {
                  navigate("/");
                  logout();
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              to="/login"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
