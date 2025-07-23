import React from 'react'
import { useState, useRef, useEffect } from "react";
import { Link  ,useNavigate ,useLocation} from 'react-router-dom';
import { useStateContext } from '../contexts/AppContext';

export default function Nav({}) {
    const { user, token, setUser, setToken } =  useStateContext();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();
    const location = useLocation();

  const getTitleByPath = () => {
    if (location.pathname === "/") return "Movement Transition";
    if (location.pathname === "/stock_balance_lists") return "Stock Balance Lists";
    if (location.pathname === "/stock_in_lists") return "Stock In Lists";
    if (location.pathname === "/stock_out_lists") return "Stock Out Lists";
    if (location.pathname === "/transfer_lists") return "Transfer Lists";
    if (location.pathname === "/locations") return "Location Lists";
    return "Warehouse System";
  };

    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


async function handleLogout(e) {
  e.preventDefault();
  console.log("Logout initiated");

  try {
    const token = localStorage.getItem("token");

    if (token) {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Logout API response:", data);
    } else {
      console.log("No token found, skipping API logout");
    }

    // Clear user-related data anyway
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");

  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    setOpen(false); // if closing a mobile menu or modal
  }
}


  return (
    <>
      <div className="flex justify-between p-4 mb-2 shadow-sm bg-gray-50">
        <h1 className="text-primary text-xl font-bold font-poppin">
            {getTitleByPath()}
        </h1>

        <div>
          <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Circle Icon Button */}
            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 border-3 border-primary rounded-full flex items-center justify-center text-primary hover:bg-indigo-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <ul className="py-1 text-sm text-gray-700">
                  <li>
                    <Link to="/profile"
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        // console.log("View Profile");
                        setOpen(false);
                      }}
                    >
                      View Profile
                    </Link>
                  </li>
                 <li>
                  <button
                    onClick={handleLogout}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </li>

                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
