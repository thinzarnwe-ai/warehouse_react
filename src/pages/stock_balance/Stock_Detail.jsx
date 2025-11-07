import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Stock_Detail_md from "../../components/Stock_Detail_md";

export default function Stock_Detail() {
  const { id } = useParams();
const [stock, setStock] = useState(null);

 const fetchStockData = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/stock_detail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    console.log(json);
    setStock(json.data); // directly set the single item
  } catch (err) {
    console.error("Failed to load stock data:", err);
  }
};

  useEffect(() => {
    if (id) fetchStockData();
  }, [id]);

  return (
    <Stock_Detail_md stock={stock} />
  );
}
