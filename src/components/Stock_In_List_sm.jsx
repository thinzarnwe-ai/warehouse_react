import React from "react";
import { useState, useEffect } from "react";

export default function Stock_In_List_sm() {
  const [stocks, setStocks] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 10,
  });

  const fetchStockData = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/stock_tracking_in?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      // console.log(json.data.data)
      setStocks(json.data.data);
      setPagination({
        current_page: json.data.current_page,
        total: json.data.total,
        per_page: json.data.per_page,
      });
    } catch (err) {
      console.error("Failed to load stock data:", err);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const handlePageChange = (newPage) => {
    // console.log("hello world");
    fetchStockData(newPage);
  };
  return (
    <>
      <div className="md:hidden space-y-4 px-4 py-4 bg-primary">
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
                  {stock.stock_tracking.product_code}
                </p>
                <p className="text-sm text-white">
                  {stock.stock_tracking.product_name}
                </p>
                <p className="text-sm text-white">
                  📍 {stock.stock_tracking.location_name}
                </p>
                <p className="text-sm text-white">
                  Qty:{" "}
                  <span className="text-[#fff] font-bold">{stock.qty}</span>
                </p>
              </div>

              {/* Right Side */}
              <div className="text-end space-y-1">
                <span className="inline-block py-1 px-3 text-xs font-medium rounded-full bg-[#fff3e1] text-[#e20049] shadow-sm">
                 {stock.status}
                </span>
                <p className="text-sm font-medium text-gray-200">
                  {new Date(stock.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          disabled={pagination.current_page === 1}
          onClick={() => handlePageChange(pagination.current_page - 1)}
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
          onClick={() => handlePageChange(pagination.current_page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
}
