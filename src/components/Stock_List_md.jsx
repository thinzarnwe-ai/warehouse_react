import React from 'react'
import { useEffect,useState } from 'react';

export default function Stock_List_md() {
    const [stocks, setStocks] = useState([]);
    const [pagination, setPagination] = useState({
      current_page: 1,
      total: 0,
      per_page: 10 ,
    });
  
    const fetchStockData = async (page = 1) => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/stock_active?page=${page}`, {
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
              <td className="px-6 py-5">{stock.product_code}</td>
              <td className="px-6 py-5">{stock.product_name}</td>
              <td className="px-6 py-5">{stock.location_name}</td>
              <td className="px-6 py-5">{stock.total_qty}</td>
              <td className="px-6 py-5 ">
                <span className="py-1 px-2 rounded-full text-white bg-primary">
                  active
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

