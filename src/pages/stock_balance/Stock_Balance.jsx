import React, { useEffect, useState, useRef, useMemo } from "react";
import Stock_Balance_md from "../../components/Stock_Balance_md";
import Stock_Balance_sm from "../../components/Stock_Balance_sm";
import Search_Balance_Stock from "../../components/Search_Balance_Stock";
import { useStateContext } from "../../contexts/AppContext";
import { throttle } from "lodash"; 

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
  const [isLoading, setIsLoading] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(0);

  const latestRequest = useRef(0);

  const fetchStockData = async (page = 1, filters = searchFilters) => {
    const requestId = Date.now();
    latestRequest.current = requestId;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

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

    
      if (latestRequest.current !== requestId) return;
      if (!json?.data?.data || !Array.isArray(json.data.data)) {
        console.warn("⚠️ API returned null or invalid data, skipping update.");
        return;
      }

      setStocks(json.data.data);
      setPagination({
        current_page: json.data.current_page ?? 1,
        total: json.data.total ?? 0,
        per_page: json.data.per_page ?? 10,
      });
    } catch (err) {
      console.error("❌ Failed to load stock data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const throttledFetch = useMemo(() => throttle(fetchStockData, 500), []);

  useEffect(() => {
    throttledFetch(1, searchFilters);
  }, [searchFilters, branchId]);

  const handlePageChange = (newPage) => {
    fetchStockData(newPage);
  };

  useEffect(() => {
    const processScanData = () => {
      const scannedData = sessionStorage.getItem("scanData");
      const scanTarget = sessionStorage.getItem("scanKeyword");

      if (scannedData && scanTarget) {
        const key =
          scanTarget === "location" ? "location_name" : "product_keyword";

        setSearchFilters((prev) => {
          const newFilters = { ...prev, [key]: scannedData };
          fetchStockData(1, newFilters);
          return newFilters;
        });

        sessionStorage.removeItem("scanData");
        sessionStorage.removeItem("scanKeyword");

        setPagination((prev) => ({ ...prev, current_page: 1 }));
        setLastScanTime(Date.now());
      }
    };

    processScanData();

    const handleStorageChange = (e) => {
      if (e.key === "scanData" || e.key === "scanKeyword") {
        processScanData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <>
      <Search_Balance_Stock
        filters={searchFilters}
        setFilters={setSearchFilters}
      />

      {isLoading && (
        <div className="text-center text-gray-500 py-4 animate-pulse">
          🔄 Loading stock data...
        </div>
      )}

      {!isLoading && (
        <>
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
      )}
    </>
  );
}
