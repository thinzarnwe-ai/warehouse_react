import React from "react";

export default function Stock_Balance_sm({stocks, pagination, onPageChange}) {
 
  return (
    <>
      <div className="md:hidden space-y-4 px-4 pt-4 bg-primary">
        {stocks.map((stock, index) => {
          const serial =
            (pagination.current_page - 1) * pagination.per_page + index + 1;
          return (
            <div
              key={stock.id}
              className="bg-white/30 backdrop-blur-md border-l-4 border-[#fff3e1] shadow-lg rounded-xl p-4 flex justify-between items-start ring-1 ring-white/40"
              style={{ background: "rgba(255, 255, 255, 0.15)" }}
            >
              {/* Left Side */}
              <div className="space-y-1">
                <p className="text-sm text-gray-300">#{serial}</p>
                <p className="text-lg font-bold text-white">
                  {stock.product_code}
                </p>
                <p className="text-sm text-white">{stock.product_name}</p>
                <p className="text-sm text-white">
                  📍 {stock.location_name}
                </p>
                <p className="text-sm text-white">
                  Qty:{" "}
                  <span className="text-[#fff] font-bold">
                    {stock.total_qty}
                  </span>
                </p>
              </div>

              {/* Right Side */}
              <div className="text-end space-y-1 w-25">
                <span className="inline-block py-1 px-3 text-xs font-medium rounded-xl bg-[#2a3d47] text-[#94edf3] border  border-[#94edf3]">
                Active
              </span>

                <p className="text-sm font-medium text-gray-200">
                   {new Date(stock.updated_at).toLocaleDateString(undefined, {year: 'numeric',month: 'short',day: 'numeric',hour: '2-digit',minute: '2-digit'})}
                </p>
              </div>
            </div>
          );
        })}
      </div>

         <div className="mt-6 flex justify-center gap-4">
        <button
          disabled={pagination.current_page === 1}
          onClick={() => onPageChange(pagination.current_page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <p className="text-sm text-gray-600 text-center mt-2">
          Page {pagination.current_page}
        </p>

        <button
          disabled={
            pagination.current_page * pagination.per_page >= pagination.total
          }
          onClick={() => onPageChange(pagination.current_page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
}
