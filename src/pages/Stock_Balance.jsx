import React from "react";
import Stock_Balance_md from "../components/Stock_Balance_md";
import Stock_Balance_sm from "../components/Stock_Balance_sm";
import Search_Balance_Stock from "../components/Search_Balance_Stock";
import { useEffect, useState } from "react";

export default function Stock_Balance() {
const [stocks, setStocks] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 10,
  });

  const [searchFilters, setSearchFilters] = useState({
    product_code: '',
    location_name: '',
  });

  const fetchStockData = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page: page.toString(),
        product_code: searchFilters.product_code || '',
        location_name: searchFilters.location_name || '',
      });

      const res = await fetch(`/api/stock_active?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

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
  }, [searchFilters]); // Refetch when search filters change

  const handlePageChange = (newPage) => {
    fetchStockData(newPage);
  };
  return (
    <>
      <Search_Balance_Stock filters={searchFilters} setFilters={setSearchFilters}/>
      <Stock_Balance_md stocks={stocks}
        pagination={pagination}
        onPageChange={handlePageChange}/>
      <Stock_Balance_sm  stocks={stocks}
        pagination={pagination}
        onPageChange={handlePageChange}/>
    </>
  );
}
