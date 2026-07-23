import StockSearch from "../../components/StockSearch";
import Transfer_List_sm from "../../components/Transfer_List_sm";
import Transfer_List_md from "../../components/Transfer_List_md";
import { useStateContext } from "../../contexts/stateContext";
import { usePaginatedStockList } from "../../hooks/usePaginatedStockList";

export default function Transfer_List() {
  const { user } = useStateContext();
  const list = usePaginatedStockList({
    endpoint: "/api/stock_tracking_transfer",
    refreshKey: user?.user?.branch_id,
  });
  return (
    <>
      <StockSearch filters={list.filters} setFilters={list.setFilters} />
      {list.error && <p className="p-4 text-center text-red-600">{list.error}</p>}
      {list.isLoading && <p className="p-4 text-center text-gray-500">Loading…</p>}
      <Transfer_List_md
        stocks={list.stocks}
        pagination={list.pagination}
        onPageChange={list.changePage}
      />
      <Transfer_List_sm
        stocks={list.stocks}
        pagination={list.pagination}
        onPageChange={list.changePage}
      />
    </>
  );
}
