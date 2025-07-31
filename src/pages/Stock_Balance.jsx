import React from "react";
import Stock_Balance_md from "../components/Stock_Balance_md";
import Stock_Balance_sm from "../components/Stock_Balance_sm";
import Search_Balance_Stock from "../components/Search_Balance_Stock";
import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/AppContext";

export default function Stock_Balance() {
  const { user } = useStateContext();
  const branchId = user?.user?.branch_id;
  const [stocks, setStocks] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 10,
  });

  const [searchFilters, setSearchFilters] = useState({
    product_keyword: "",
    location_name: "",
  });

  const fetchStockData = async (page = 1, filters = searchFilters) => {
    try {
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page: page.toString(),
        product_keyword: filters.product_keyword || "",
        location_name: filters.location_name || "",
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
  }, [searchFilters, branchId]);

  const handlePageChange = (newPage) => {
    fetchStockData(newPage);
  };

  useEffect(() => {
    const scannedData = sessionStorage.getItem("scannedData");
    const scanTarget = sessionStorage.getItem("scanTarget");

    if (scannedData && scanTarget) {
      const key =
        scanTarget === "location" ? "location_name" : "product_keyword";

      const newFilters = {
        ...searchFilters,
        [key]: scannedData,
      };

      setSearchFilters(newFilters); // update state
      fetchStockData(1, newFilters); // immediate fetch

      sessionStorage.removeItem("scannedData");
      sessionStorage.removeItem("scanTarget");

      setPagination((prev) => ({
        ...prev,
        current_page: 1,
      }));
    }
  }, []);

  return (
    <>
      <Search_Balance_Stock
        filters={searchFilters}
        setFilters={setSearchFilters}
      />
      <Stock_Balance_md
        stocks={stocks}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
      <Stock_Balance_sm
        stocks={stocks}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </>
  );
}
