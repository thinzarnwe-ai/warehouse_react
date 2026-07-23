import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosClient from "../axiosClient";

const DEFAULT_FILTERS = {
  product_code: "",
  from_date: "",
  to_date: "",
};

const DEFAULT_PAGINATION = {
  current_page: 1,
  total: 0,
  per_page: 10,
};

function readFilters(searchParams) {
  return Object.fromEntries(
    Object.keys(DEFAULT_FILTERS).map((key) => [
      key,
      searchParams.get(key) ?? "",
    ]),
  );
}

function createSearchParams(filters, page) {
  const params = new URLSearchParams({ page: String(page) });

  Object.entries(filters).forEach(([key, value]) => {
    const normalizedValue = String(value ?? "").trim();
    if (normalizedValue) params.set(key, normalizedValue);
  });

  return params;
}

export function usePaginatedStockList({ endpoint, refreshKey }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => readFilters(searchParams));
  const [stocks, setStocks] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const abortControllerRef = useRef(null);
  const skipFirstFilterEffectRef = useRef(true);

  const fetchPage = useCallback(
    async (page, activeFilters) => {
      abortControllerRef.current?.abort();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setIsLoading(true);
      setError("");

      try {
        const response = await axiosClient.get(endpoint, {
          params: { page, ...activeFilters },
          signal: abortController.signal,
          withCredentials: true,
        });
        const pageData = response.data?.data;

        if (!pageData || !Array.isArray(pageData.data)) {
          throw new Error("The server returned an invalid paginated response.");
        }

        setStocks(pageData.data);
        setPagination({
          current_page: pageData.current_page ?? page,
          total: pageData.total ?? 0,
          per_page: pageData.per_page ?? DEFAULT_PAGINATION.per_page,
        });
      } catch (requestError) {
        if (requestError.code !== "ERR_CANCELED") {
          setError(
            requestError.response?.data?.message ??
              requestError.message ??
              "Unable to load stock data.",
          );
        }
      } finally {
        if (abortControllerRef.current === abortController) {
          setIsLoading(false);
        }
      }
    },
    [endpoint],
  );

  useEffect(() => {
    const initialPage = Math.max(
      1,
      Number.parseInt(searchParams.get("page") ?? "1", 10) || 1,
    );
    fetchPage(initialPage, filters);

    return () => abortControllerRef.current?.abort();
    // URL state is intentionally read only during initialization.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPage]);

  useEffect(() => {
    if (skipFirstFilterEffectRef.current) {
      skipFirstFilterEffectRef.current = false;
      return;
    }

    setSearchParams(createSearchParams(filters, 1), { replace: true });
    fetchPage(1, filters);
  }, [fetchPage, filters, refreshKey, setSearchParams]);

  const changePage = useCallback(
    (page) => {
      setSearchParams(createSearchParams(filters, page), { replace: true });
      fetchPage(page, filters);
    },
    [fetchPage, filters, setSearchParams],
  );

  const removeStock = useCallback((deletedId) => {
    setStocks((currentStocks) =>
      currentStocks.filter((stock) => stock.id !== deletedId),
    );
    setPagination((currentPagination) => ({
      ...currentPagination,
      total: Math.max(0, currentPagination.total - 1),
    }));
  }, []);

  return {
    changePage,
    error,
    filters,
    isLoading,
    pagination,
    removeStock,
    setFilters,
    stocks,
  };
}
