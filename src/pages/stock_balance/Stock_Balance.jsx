import { useCallback, useEffect, useRef, useState } from "react";
import Stock_Balance_md from "../../components/Stock_Balance_md";
import Stock_Balance_sm from "../../components/Stock_Balance_sm";
import Search_Balance_Stock from "../../components/Search_Balance_Stock";
import { useStateContext } from "../../contexts/stateContext";

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

  const latestRequest = useRef(0);
  const abortControllerRef = useRef(null);

  const fetchStockData = useCallback(async (page, filters) => {
    const requestId = latestRequest.current + 1;
    latestRequest.current = requestId;
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

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
        signal: abortController.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

    
      if (latestRequest.current !== requestId) return;
      if (!json?.data?.data || !Array.isArray(json.data.data)) {
        throw new Error("The server returned an invalid stock response.");
      }

      setStocks(json.data.data);
      setPagination({
        current_page: json.data.current_page ?? 1,
        total: json.data.total ?? 0,
        per_page: json.data.per_page ?? 10,
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Failed to load stock data:", err);
      }
    } finally {
      if (latestRequest.current === requestId) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = window.setTimeout(
      () => fetchStockData(1, searchFilters),
      400,
    );

    return () => {
      window.clearTimeout(debounceTimer);
      abortControllerRef.current?.abort();
    };
  }, [branchId, fetchStockData, searchFilters]);

  const handlePageChange = (newPage) => {
    fetchStockData(newPage, searchFilters);
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
          return newFilters;
        });

        sessionStorage.removeItem("scanData");
        sessionStorage.removeItem("scanKeyword");

        setPagination((prev) => ({ ...prev, current_page: 1 }));
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
