import React from "react";
import Stock_List_md from "../components/Stock_List_md";
import Stock_List_sm from "../components/Stock_List_sm";
import Search from "../components/Search";
import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/AppContext";

export default function Home() {
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
    status: "",
  });

  const fetchStockData = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page: page.toString(),
        product_code: searchFilters.product_code || "",
        status: searchFilters.status || "",
      });

      const res = await fetch(`/api/show_all_stock?${params.toString()}`, {
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

  const handlePageChange = (newPage) => {
    fetchStockData(newPage);
  };
  return (
    <>
      <Search filters={searchFilters} setFilters={setSearchFilters} />
      <Stock_List_md
        stocks={stocks}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
      <Stock_List_sm
        stocks={stocks}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </>
  );
}
