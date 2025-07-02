import React, { useEffect,useState } from 'react'
import StockSearch from '../components/StockSearch'
import Stock_Out_List_md from '../components/Stock_Out_List_md'
import Stock_Out_List_sm from '../components/Stock_Out_List_sm'

export default function StockOut_List() {
  const [stocks, setStocks] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    pre_page: 10,
  })

  const [searchFilters, setSearchFilters] = useState({
    product_code: '',
    from_date: '',
    to_date: '',
  });

  const fetchStockData = async (page = 1) => {
     try {
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page: page.toString(),
        product_code: searchFilters.product_code || '',
        from_date: searchFilters.from_date || '',
        to_date: searchFilters.to_date || '',
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
      console.log(json);
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
    }, [searchFilters]); // Refetch when search filters change
  
    const handlePageChange = (newPage) => {
      fetchStockData(newPage);
    };
  
  return (
    <>
      <StockSearch filters={searchFilters} setFilters={setSearchFilters}/>
      <Stock_Out_List_md stocks={stocks} pagination={pagination} onPageChange={handlePageChange}/>
      <Stock_Out_List_sm
       stocks={stocks}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </>
  )
}
