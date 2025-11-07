import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export function useProductSearch(selectedBranch, setForm) {
  const [search, setSearch] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const branch = selectedBranch?.value;
      if (!branch || !search.trim()) return setSuggestions([]);

      const token = localStorage.getItem("token");
      const res = await fetch(`/api/get-product/${search}/${branch}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (!res.ok) return setSuggestions([]);

      const data = json?.data?.products || [];

      if (!isNaN(search)) {
        if (!data.length) return toast.error("Product not found");
        const p = data[0];
        setForm((prev) => ({
          ...prev,
          product_code: p.barcode_code,
          product_name: p.barcode_bill_name,
          ratio: p.unit_rate,
          unit_code: p.unit_code,
        }));
        setSuggestions([]);
        return;
      }

      if (search.length >= 2) {
        setIsTyping(true);
        setSuggestions(data);
      }
    };

    const timer = setTimeout(fetchData, 400);
    return () => clearTimeout(timer);
  }, [search, selectedBranch]);

  return { search, setSearch, isTyping, setIsTyping, suggestions, setSuggestions };
}
