import React from "react";
import { Link } from "react-router-dom";

export default function Search({filters, setFilters}) {
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center  gap-6 md:gap-10 bg-primary shadow-md p-4 md:p-6 md:me-5">
        {/* Product Code Input */}
        <div className="w-full md:w-1/2">
          <label
            htmlFor="product_code"
            className="text-sm font-semibold text-white block"
          >
            Product Code
          </label>
          <input
            id="product_code"
            type="text"
            name="product_code"
            value={filters.product_code}
            onChange={handleChange}
            placeholder="Enter product code"
            className="mt-2 w-full py-3 px-4 border border-[#107a8b] rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#107a8b]"
          />
        </div>

        {/* Status Radios */}
        <div className="w-full md:w-1/2">
          <label className="text-sm font-semibold text-white block">
            Status
          </label>
        <div className="flex items-center gap-8 mt-3">
        {['in', 'out', 'Transfer In', 'Transfer Out'].map((status) => (
          <label key={status} className="flex items-center gap-2 text-sm font-medium text-white">
            <input
              type="radio"
              name="status"
              value={status}
              checked={filters.status === status}
              onChange={handleChange}
              className="accent-[#107a8b] w-4 h-4"
            />
            {status.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
          </label>
        ))}
      </div>

        </div>
      </div>
    </>
  );
}
