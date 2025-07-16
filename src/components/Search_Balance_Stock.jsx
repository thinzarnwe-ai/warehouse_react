import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Search({ filters, setFilters }) {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const startScan = (field) => {
    navigate(`/scan/${field}`);
  };


  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-10 bg-primary shadow-md p-4 md:p-6 md:me-5">
      {/* Product Code Input */}
      <div className="w-full md:w-1/2">
        <label
          htmlFor="product_code"
          className="text-sm font-semibold text-white block"
        >
          Product Code / Name
        </label>
        <div className="flex gap-5">
          <input
            id="product_code"
            type="text"
            name="product_keyword"
            value={filters.product_keyword}
            onChange={handleChange}
            placeholder="Enter product code or name"
            className="mt-2 w-full py-3 px-4 border border-[#107a8b] rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#107a8b]"
          />
          <ScanButton onClick={() => startScan("product")} />
        </div>
      </div>

      {/* Location Name Input */}
      <div className="w-full md:w-1/2">
        <label
          htmlFor="location_name"
          className="text-sm font-semibold text-white block"
        >
          Location Name
        </label>
        <div className="flex gap-5">
          <input
            id="location_name"
            type="text"
            name="location_name"
            value={filters.location_name}
            onChange={handleChange}
            placeholder="Enter location name"
            className="mt-2 w-full py-3 px-4 border border-[#107a8b] rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#107a8b]"
          />
          <ScanButton onClick={() => startScan("location")} />
        </div>
      </div>
    </div>
  );
}

function ScanButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-2 px-2 rounded border-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-8 text-white"
      >
        <path
          fillRule="evenodd"
          d="M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 9.375v-4.5ZM4.875 4.5a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 0 1-1.875-1.875v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75A.75.75 0 0 1 6 7.5v-.75Zm9.75 0A.75.75 0 0 1 16.5 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.035-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 19.125v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875-.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM6 16.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm9.75 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm-3 3a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
