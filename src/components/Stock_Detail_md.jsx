import React from "react";

export default function Stock_Detail_md({ stock }) {
  if (!stock) return <div>Loading...</div>;

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-semibold text-primary mb-6 text-center">
          Stock Tracking Detail
        </h2>
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-3 px-4 font-medium text-gray-600">
                Product Code
              </td>
              <td className="py-3 px-4 text-gray-800">
                {stock[0].product_code}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-gray-600">
                Location Name
              </td>
              <td className="py-3 px-4 text-gray-800">
                {stock[0].location.location_name}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-gray-600">Quantity</td>
              <td className="py-3 px-4 text-gray-800">{stock[0].total_qty}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-gray-600">Status</td>
              <td className="py-3 px-4">
                <span className="inline-block px-3 py-1 rounded-full bg-primary text-white text-sm">
                 Active
                </span>
              </td>
            </tr>
           
          </tbody>
        </table>
      </div>
    </>
  );
}
