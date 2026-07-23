import StockSearch from "../../components/StockSearch"
import Stock_Out_List_md from "../../components/Stock_Out_List_md";
import Stock_Out_List_sm from "../../components/Stock_Out_List_sm";
import { useStateContext } from "../../contexts/stateContext";
import { usePaginatedStockList } from "../../hooks/usePaginatedStockList";

export default function StockOut_List() {
  const { user } = useStateContext();
  const list = usePaginatedStockList({
    endpoint: "/api/stock_tracking_out",
    refreshKey: user?.user?.branch_id,
  });

  return (
    <>
      <StockSearch filters={list.filters} setFilters={list.setFilters} />
      {list.error && <p className="p-4 text-center text-red-600">{list.error}</p>}
      {list.isLoading && <p className="p-4 text-center text-gray-500">Loading…</p>}
      <Stock_Out_List_md
        user = {user}
        stocks={list.stocks}
        pagination={list.pagination}
        onPageChange={list.changePage}
        onDeleteStock={list.removeStock}
      />
      <Stock_Out_List_sm
        stocks={list.stocks}
        pagination={list.pagination}
        onPageChange={list.changePage}
      />
    </>
  );
}
