import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useStateContext } from "../contexts/AppContext";

export default function Nav() {
  const { user, token, setUser, setToken } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();
  const [open, setOpen] = useState(false);
  const [branchDropdown, setBranchDropdown] = useState(false);
  const [branches, setBranches] = useState([]);

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/user-branch", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const json = await res.json();
        const formatted = json.data.map((branch) => ({
          id: branch.id,
          name: branch.name,
        }));
        setBranches(formatted);
      } catch (error) {
        console.error("Failed to fetch branches", error);
      }
    };
    fetchBranches();
  }, []);

  const selectedBranch = branches.find(
    (b) => String(b.id) === String(user?.user?.branch_id)
  );

  const handleSelectBranch = async (branch) => {
    setBranchDropdown(false);
    setOpen(false);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/branch", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ branch_id: branch.id }),
      });
      if (res.ok) {
        setUser((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            branch_id: branch.id,
          },
        }));
      }
    } catch (e) {
      // handle error
    }
  };

  const isBranchSelected = (branch) => branch.id === user?.branch_id;

  const getTitleByPath = () => {
    switch (location.pathname) {
      case "/":
        return "Movement Transition";
      case "/stock_balance_lists":
        return "Stock Balance Lists";
      case "/stock_in_lists":
        return "Stock In Lists";
      case "/stock_out_lists":
        return "Stock Out Lists";
      case "/transfer_lists":
        return "Transfer Lists";
      case "/locations":
        return "Location Lists";
      default:
        return "Warehouse System";
    }
  };

  async function handleLogout(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("/api/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setOpen(false);
    }
  }

  // Close all dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setBranchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between p-4 mb-2 shadow-sm bg-gray-50">
      <h1 className="text-primary text-xl font-bold font-poppin">
        {getTitleByPath()}
      </h1>
      <div>
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-10 h-10 border-2 border-primary rounded-full flex items-center justify-center text-primary hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <ul className="py-1 text-sm text-gray-700">
                {/* Selected Branch with dropdown */}
                <li className="relative">
                  <button
                    onClick={() => setBranchDropdown((v) => !v)}
                    className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100"
                  >
                    <span>
                      <i className="bi bi-diagram-3 me-2" />
                      {selectedBranch?.name || "No branch selected"}
                    </span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
                        branchDropdown ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
             
                  {branchDropdown && (
                    <ul className="ml-2 w-48 bg-primary text-white rounded-md shadow-lg border border-gray-200 z-50">
                      {branches.map((branch) => (
                        <li key={branch.id}>
                          <button
                            onClick={() => handleSelectBranch(branch)}
                            className={`flex w-full items-center px-4 py-2 hover:bg-[#0d6371] shadow-sm ${
                              isBranchSelected(branch)
                                ? "bg-primary text-white font-bold"
                                : ""
                            }`}
                          >
                            <i className="bi bi-bezier me-2" />
                            {branch.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                {/* View Profile */}
                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    <i className="bi bi-person-lines-fill me-2" />
                    View Profile
                  </Link>
                </li>
                {/* Logout */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    <i className="bi bi-box-arrow-right me-2" />
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
