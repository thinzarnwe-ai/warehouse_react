import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StockSearch from "../components/StockSearch";
import Stock_Out_List_md from "../components/Stock_Out_List_md";
import Stock_Out_List_sm from "../components/Stock_Out_List_sm";
import { useStateContext } from "../contexts/AppContext";

export default function StockOut_List() {
  const { user } = useStateContext();
  const branchId = user?.user?.branch_id;
  const [stocks, setStocks] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    pre_page: 10,
  });

 
   const [searchParams, setSearchParams] = useSearchParams();
   const didInitRef = useRef(false);
 
 
   const initialFilters = useMemo(
     () => ({
       product_code: searchParams.get("product_code") ?? "",
       from_date: searchParams.get("from_date") ?? "",
       to_date: searchParams.get("to_date") ?? "",
     }),
     [searchParams]
   );
 
   const [searchFilters, setSearchFilters] = useState(initialFilters);

  const fetchStockData = async (page = 1, filters = searchFilters) => {
    try {
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page: String(page),
        product_code: filters.product_code || "",
        from_date: filters.from_date || "",
        to_date: filters.to_date || "",
      });

      const res = await fetch(`/api/stock_tracking_out?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setStocks(json.data.data);
      // console.log(json);
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
      if (didInitRef.current) return;
  
      const pageFromUrl = Number(searchParams.get("page") || "1");
  
      
      setSearchFilters(initialFilters);
  
      fetchStockData(pageFromUrl, initialFilters);
      didInitRef.current = true;
    }, []);
  
  
    useEffect(() => {
      if (!didInitRef.current) return;
  
      const next = new URLSearchParams(searchParams);
      next.set("page", "1");
      if (searchFilters.product_code) next.set("product_code", searchFilters.product_code); else next.delete("product_code");
      if (searchFilters.from_date)    next.set("from_date",    searchFilters.from_date);    else next.delete("from_date");
      if (searchFilters.to_date)      next.set("to_date",      searchFilters.to_date);      else next.delete("to_date");
  
      setSearchParams(next, { replace: false });
      fetchStockData(1, searchFilters);
    }, [searchFilters, branchId]);
  
    const handleDeleteStock = (deletedId) => {
      setStocks((prev) => prev.filter((item) => item.id !== deletedId));
    };
  
    const handlePageChange = (newPage) => {
      const next = new URLSearchParams(searchParams);
      next.set("page", String(newPage));
      if (searchFilters.product_code) next.set("product_code", searchFilters.product_code); else next.delete("product_code");
      if (searchFilters.from_date)    next.set("from_date",    searchFilters.from_date);    else next.delete("from_date");
      if (searchFilters.to_date)      next.set("to_date",      searchFilters.to_date);      else next.delete("to_date");
  
      setSearchParams(next, { replace: false });
      fetchStockData(newPage, searchFilters);
    };

  return (
    <>
      <StockSearch filters={searchFilters} setFilters={setSearchFilters} />
      <Stock_Out_List_md
        user = {user}
        stocks={stocks}
        pagination={pagination}
        onPageChange={handlePageChange}
        onDeleteStock={handleDeleteStock}
      />
      <Stock_Out_List_sm
        stocks={stocks}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </>
  );
}
