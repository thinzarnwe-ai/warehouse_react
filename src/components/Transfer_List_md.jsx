import React from 'react'
import { Link } from 'react-router-dom';

export default function Transfer_List_md({
    stocks,
  pagination,
  onPageChange,
}) {
  return (
    <>
       <div className="relative overflow-x-auto px-4 hidden md:block min-h-screen  ">
        <table className="w-full  text-left rtl:text-right font-poppin mt-5 shadow-2xl">
          <thead className=" text-gray-800 uppercase bg-gray-50 border-b border-indigo-500 ">
            <tr className='text-sm'>
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
              <tr key={stock.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-sm">
              <th
                scope="row"
                className="px-6 py-4  text-gray-900 whitespace-nowrap dark:text-white"
              >
                {serial}
              </th>
              <td className="px-6 py-5">{stock.stock_tracking.product_code}</td>
              <td className="px-6 py-5">{stock.stock_tracking.product_name}</td>
              <td className="px-6 py-5">{stock.stock_tracking.location_name}</td>
              <td className="px-6 py-5">{stock.qty}</td>
              <td className="px-2 py-5 ">
                <span className="py-1 px-2 rounded-md text-xs text-white bg-primary">
                  {stock.status }
                </span>
              </td>

               <td className="ps-10">
              <Link to={`/detail/${stock.id}`} state={{ type: "transfer" }} >
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
            </td>
            </tr>
          );
        })}
          </tbody>
        </table>
      </div>
    </>
  )
}
