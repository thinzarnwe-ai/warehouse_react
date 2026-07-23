import StockSearch from "../../components/StockSearch";
import Stock_In_List_md from "../../components/Stock_In_List_md";
import Stock_In_List_sm from "../../components/Stock_In_List_sm";
import { useStateContext } from "../../contexts/stateContext";
import { usePaginatedStockList } from "../../hooks/usePaginatedStockList";

export default function StockIn_List() {
  const { user } = useStateContext();
  const {
    changePage,
    error,
    filters,
    isLoading,
    pagination,
    removeStock,
    setFilters,
    stocks,
  } = usePaginatedStockList({
    endpoint: "/api/stock_tracking_in",
    refreshKey: user?.user?.branch_id,
  });

  return (
    <>
      <StockSearch filters={filters} setFilters={setFilters} />
      {error && <p className="p-4 text-center text-red-600">{error}</p>}
      {isLoading && <p className="p-4 text-center text-gray-500">Loading…</p>}
      <Stock_In_List_md
        user={user}
        stocks={stocks}
        pagination={pagination}
        onPageChange={changePage}
        onDeleteStock={removeStock}
      />
      <Stock_In_List_sm
        stocks={stocks}
        pagination={pagination}
        onPageChange={changePage}
      />
    </>
  );
}
