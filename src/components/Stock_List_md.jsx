import React from 'react'
import { Link } from 'react-router-dom';

export default function Stock_List_md({stocks, pagination, onPageChange}) {
  
  return (
    <>
       <div className="relative overflow-x-auto px-4 hidden md:block min-h-screen  ">
        <table className="w-full  text-left rtl:text-right font-poppin mt-5 shadow-2xl">
          <thead className=" text-gray-800 uppercase bg-gray-50 border-b border-indigo-500">
            <tr className=' text-sm'>
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
                Location Name
              </th>
              <th scope="col" className="px-3 py-5">
                Qty
              </th>
              <th scope='col' className='px-7 py-5'>
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
              <tr key={stock.id} className="bg-white border-b  border-gray-200 text-sm">
              <th
                scope="row"
                className="px-6 py-5 whitespace-nowrap dark:text-white"
              >
                {serial}
              </th>
              <td className="px-6 ">{stock.stock_tracking.product_code}</td>
              <td className="px-6">{stock.stock_tracking.product_name}</td>
              <td className="px-6 ">{stock.stock_tracking.location_name}</td>
              <td className="px-6 ">{stock.qty}</td>
              <td className="px-6 text-sm w-40">  {new Date(stock.created_at).toLocaleDateString(undefined, {year: 'numeric',month: 'short',day: 'numeric'})}</td>
              <td className=" text-center">
                <span className="py-1 px-2 rounded-md text-white bg-primary text-xs">
                  {stock.status}
                </span>
              </td>
             <td className="ps-10 flex justify-content-center gap-2 mt-5">
              <Link to={`/detail/${stock.id}`}>
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

