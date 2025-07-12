import { useState } from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "flowbite";
import Sidebar from "../../components/Sidebar";
import Nav from "../../components/Nav";
import AppProvider, { useStateContext } from "../../contexts/AppContext";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  const { user, token } = useStateContext();
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          // Base style
          style: {
            background: "#107a8b",
            color: "#ffffff",
            padding: "12px 16px",
            borderRadius: "8px",
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },

          // Success style
          success: {
            style: {
              background: "#28a745",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#28a745",
            },
          },

          // Error style
          error: {
            style: {
              background: "#dc3545",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#dc3545",
            },
          },

          // info style
          loading: {
            style: {
              background: "#ffc107",
              color: "#000",
            },
            iconTheme: {
              primary: "#000",
              secondary: "#ffc107",
            },
          },
        }}
      />

      <Sidebar />
      <div className="sm:ml-64 md:bg-[#f1efef] min-h-screen overflow-x-hidden">
        <Nav />
        <Outlet />
      </div>
    </>
  );
}

export default App;
