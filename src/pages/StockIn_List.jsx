import React, { useEffect, useState } from "react";
import StockSearch from "../components/StockSearch";
import Stock_In_List_md from "../components/Stock_In_List_md";
import Stock_In_List_sm from "../components/Stock_In_List_sm";
import { useStateContext } from "../contexts/AppContext";

export default function StockIn_List() {
  const { user } = useStateContext();
  const branchId = user?.user?.branch_id;
  const [stocks, setStocks] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 10,
  });

  const [searchFilters, setSearchFilters] = useState({
    product_code: "",
    from_date: "",
    to_date: "",
  });

  const fetchStockData = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page: page.toString(),
        product_code: searchFilters.product_code || "",
        from_date: searchFilters.from_date || "",
        to_date: searchFilters.to_date || "",
      });

      const res = await fetch(`/api/stock_tracking_in?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      // console.log(json);
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
  }, [searchFilters, branchId]); 
  const handleDeleteStock = (deletedId) => {
    setStocks((prev) => prev.filter((item) => item.id !== deletedId));
  }

  const handlePageChange = (newPage) => {
    fetchStockData(newPage);
  };

  return (
    <>
      <StockSearch filters={searchFilters} setFilters={setSearchFilters} />
      <Stock_In_List_md
        user = {user}
        stocks={stocks}
        pagination={pagination}
        onPageChange={handlePageChange} 
        onDeleteStock={handleDeleteStock}
      />
      <Stock_In_List_sm
        stocks={stocks}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </>
  );
}
