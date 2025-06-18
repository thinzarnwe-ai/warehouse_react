import React from "react";
import { Link } from "react-router-dom";

export default function Search() {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center  gap-6 md:gap-10 bg-primary shadow-md p-4 md:p-6 md:me-5">
        {/* Product Code Input */}
        <div className="w-full md:w-1/2">
          <label
            htmlFor="product-code"
            className="text-sm font-semibold text-white block"
          >
            Product Code
          </label>
          <input
            id="product-code"
            type="text"
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
             <label className="flex items-center gap-2 text-sm font-medium text-white">
              <input
                type="radio"
                name="status"
                className="accent-[#107a8b] w-4 h-4"
              />
              In
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-white">
              <input
                type="radio"
                name="status"
                className="accent-[#107a8b] w-4 h-4"
              />
              Out
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-white">
              <input
                type="radio"
                name="status"
                className="accent-[#107a8b] w-4 h-4"
              />
              Transfer
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
