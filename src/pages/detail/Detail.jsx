import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Detail_md from "../../components/Detail_md";

export default function Detail() {
  const { id } = useParams();
const [stock, setStock] = useState(null);

 const fetchStockData = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/detail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    console.log(json);
    setStock(json.data); 
  } catch (err) {
    console.error("Failed to load stock data:", err);
  }
};

  useEffect(() => {
    if (id) fetchStockData();
  }, [id]);

  return (
    <Detail_md stock={stock} />
  );
}
