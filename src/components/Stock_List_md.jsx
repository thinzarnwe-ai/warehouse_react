import React from 'react'

export default function Stock_List_md({stocks, pagination, onPageChange}) {
  
  return (
    <>
       <div className="relative overflow-x-auto px-4 hidden md:block min-h-screen  ">
        <table className="w-full  text-left rtl:text-right font-poppin mt-5 shadow-2xl">
          <thead className=" text-gray-800 uppercase bg-gray-50 border-b border-indigo-500 ">
            <tr>
              <th scope="col" className="px-6 py-5">
                No
              </th>
              <th scope="col" className="px-6 py-5">
                Product Code
              </th>
              <th scope="col" className="px-6 py-5">
                Product Name
              </th>
              <th scope="col" className="px-6 py-5">
                Location Name
              </th>
              <th scope="col" className="px-6 py-5">
                Qty
              </th>
              <th scope="col" className="px-6 py-5">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => {
          const serial =
            (pagination.current_page - 1) * pagination.per_page + index + 1;
          return (
              <tr key={stock.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
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
              <td className="px-6 py-5 w-50">
                <span className="py-1 px-2 rounded-full text-white bg-primary">
                  {stock.status}
                </span>
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

