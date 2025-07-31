import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Stock_In_List_md({
  user,
  stocks,
  pagination,
  onPageChange,
  onDeleteStock,
}) {
  const [confirmId, setConfirmId] = useState(null);
  const isBranchManager = user?.roles?.includes("Branch Manager");
  const handleDelete = async (stockId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/deleteStockIn/${stockId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
      let errorMsg = "Failed to delete";
      try {
        const errData = await res.json();
        errorMsg = errData?.error || errData?.message || errorMsg;
      } catch (e) {
        errorMsg = res.statusText || errorMsg;
      }
      throw new Error(errorMsg);
    }
      if (onDeleteStock) onDeleteStock(stockId);
      toast.success("Delete successfully.");
    } catch (err) {
      toast.error("Failed to delete: " + err.message);
    } finally {
      setConfirmId(null);
    }
  };
  return (
    <>
      <div className="relative overflow-x-auto px-4 hidden md:block min-h-screen  ">
        <table className="w-full  text-left rtl:text-right font-poppin mt-5 shadow-2xl">
          <thead className=" text-gray-800 uppercase bg-gray-50 border-b border-indigo-500 ">
            <tr className="text-sm">
              <th scope="col" className="px-6 py-5">
                No
              </th>
              <th scope="col" className="px-4 py-5">
                Product Code
              </th>
              <th scope="col" className="px-6 py-5">
                Product Name
              </th>
              <th scope="col" className="px-6 py-5">
                Category
              </th>
              <th scope="col" className="px-6 py-5">
                Qty
              </th>
              <th scope='col' className='px-6 py-5'>
                Date
              </th>
              <th scope="col" className="px-6 py-5">
                Status
              </th>
              <th scope="col" className="px-6 py-5">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => {
              const serial =
                (pagination.current_page - 1) * pagination.per_page + index + 1;
              return (
                <tr
                  key={stock.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-sm"
                >
                  <th
                    scope="row"
                    className="px-6 py-4  text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {serial}
                  </th>
                  <td className="px-6 py-5">
                    {stock.stock_tracking.product_code}
                  </td>
                  <td className="px-6 py-5">
                    {stock.stock_tracking.product_name}
                  </td>
                  <td className="px-6 py-5">
                    {stock.stock_tracking.location_name}
                  </td>
                  <td className="px-6 py-5">{stock.qty}</td>
                   <td className="px-6 text-sm w-35">  {new Date(stock.created_at).toLocaleDateString(undefined, {year: 'numeric',month: 'short',day: 'numeric'})}</td>
                  <td className="px-6 py-5 ">
                    <span className="py-1 px-2 rounded-md text-sm text-white bg-primary">
                      {stock.status}
                    </span>
                  </td>
                  <td className="ps-7 flex items-center gap-1 py-6">
                    <Link
                      to={`/detail/${stock.id}`}
                      state={{ type: "stock-in" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 bg-primary px-1 rounded-md text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </Link>
                     {isBranchManager && (
                    <button
                      onClick={() => setConfirmId(stock.id)}
                      className="bg-red-700 rounded-md text-white"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6 px-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                        )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {confirmId && (
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 z-50">
              <div className="bg-primary text-white p-6 rounded-lg shadow-xl w-80 text-center border-2 border-primary">
                <h2 className="mb-4 text-lg font-semibold">Confirm Delete</h2>
                <p className="mb-6">
                  Are you sure you want to delete this record?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="px-4 py-2 rounded bg-red-600 text-white"
                    onClick={() => handleDelete(confirmId)}
                  >
                    Yes, Delete
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-gray-200 text-primary"
                    onClick={() => setConfirmId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </table>
      </div>
    </>
  );
}
