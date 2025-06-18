import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function StockSearch() {
  let location = useLocation();
  let path = location.pathname;

  let route = '/create_stockin';
  if (path === '/stock_out_lists') {
    route = '/create_stockout';
  } else if (path === '/stock_in_lists') {
    route = '/create_stockin';
  } else if (path === '/transfer_lists') {
    route = '/create_transfer';
  }


  return (
    <>
      <div className="flex justify-between items-center md:me-5 pe-2 bg-primary">
        <div className="p-4 md:flex gap-15">
          <div className="w-full">
            <label htmlFor="" className=" font-medium block text-white">
              Product Code
            </label>
            <input
              type="text"
              className="0 py-3 rounded-lg block mt-2 border-primary text-sm shadow-sm  border w-full px-8 focus:border-3 focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label htmlFor="" className=" font-medium block text-white ">
              From Date
            </label>
            <input
              type="date"
              className="0 py-3 rounded-lg block mt-2 border-primary text-sm shadow-sm  border w-full px-8 focus:border-3 focus:outline-none"
            />
          </div>
          <div className="w-full">
            <label htmlFor="" className=" font-medium block text-white ">
             To Date
            </label>
            <input
              type="date"
              className="0 py-3 rounded-lg block mt-2 border-primary text-sm shadow-sm  border w-full px-8 focus:border-3 focus:outline-none"
            />
          </div>
       
          
        </div>
        <Link to={route} className="bg-[#fff] py-2 px-3 text-primary rounded">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
        </svg>

        </Link>
      </div>
    </>
  )
}
