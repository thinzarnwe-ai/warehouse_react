import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ProductSearch({ form, setForm, selectedBranch, startScan }) {
  const [search, setSearch] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [lastError, setLastError] = useState(""); 

  useEffect(() => {
    if (form.product_code && /^\d+$/.test(form.product_code)) {
      setSearch(form.product_code);
    }
  }, [form.product_code]);
  
  useEffect(() => {
    if (!/^\d+$/.test(search)) setSearch(form.product_name || "");
  }, [form.product_name]);


  useEffect(() => {
    const fetchProduct = async () => {
      const branch = selectedBranch?.value;
      const keyword = search.trim();

      if (!branch) return;

      if (!keyword) {
        setNameSuggestions([]);
        setForm((prev) => ({
          ...prev,
          product_code: "",
          product_name: "",
          ratio: "",
          unit_code: "",
        }));
        return;
      }

      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`/api/get-product/${keyword}/${branch}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();
        const products = json?.data?.products || [];
        if (!isNaN(keyword)) {
          if (products.length > 0) {
            const p = products[0];
            setForm((prev) => ({
              ...prev,
              product_code: p.barcode_code || "",
              product_name: p.barcode_bill_name || "",
              ratio: p.unit_rate || "",
              unit_code: p.unit_code || "",
            }));
            setLastError(""); 
          } else {
            if (lastError !== keyword) {
              toast.error("Product code not found");
              setLastError(keyword);
            }
            setForm((prev) => ({
              ...prev,
              product_code: "",
              product_name: "",
              ratio: "",
              unit_code: "",
            }));
          }
          setNameSuggestions([]);
          setIsTyping(false);
          return;
        }

        if (keyword.length >= 2) {
          setIsTyping(true);
          setNameSuggestions(products);
        } else {
          setNameSuggestions([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Error fetching product info");
        setForm((prev) => ({
          ...prev,
          product_code: "",
          product_name: "",
          ratio: "",
          unit_code: "",
        }));
        setNameSuggestions([]);
      }
    };

    const timeout = setTimeout(fetchProduct, 400);
    return () => clearTimeout(timeout);
  }, [search, selectedBranch]);

  const handleClear = () => {
    setSearch("");
    setNameSuggestions([]);
    setForm((prev) => ({
      ...prev,
      product_code: "",
      product_name: "",
      ratio: "",
      unit_code: "",
    }));
  };

  return (
    <div className="col-span-2 relative">
      <label
        htmlFor="search_data"
        className="block text-sm font-medium text-primary"
      >
        Search by Product Code / Name <span className="text-red-600">*</span>
      </label>

      <div className="flex gap-2 relative">
        <input
          type="text"
          id="search_data"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsTyping(true)}
          onBlur={() => setTimeout(() => setIsTyping(false), 200)}
          className=" border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900"
          placeholder="Enter product code or name"
        />

        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-14 top-3 text-gray-500 hover:text-gray-600"
            title="Clear search"
          >
            ✕
          </button>
        )}

        <button
          type="button"
          className="border p-2 rounded border-primary"
          onClick={() => startScan("product_code")}
          title="Scan Product"
        >
          📷
        </button>

        {isTyping && nameSuggestions.length > 0 && (
          <ul className="absolute top-full mt-1 bg-white border rounded shadow-md max-h-40 overflow-auto z-50 w-full">
            {nameSuggestions.map((item) => (
              <li
                key={item.product_code}
                className="px-3 py-1 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  setIsTyping(false);
                  setNameSuggestions([]);
                  setSearch(item.barcode_bill_name || item.product_name1 || "");
                  setForm((prev) => ({
                    ...prev,
                    product_code: item.product_code,
                    product_name:
                      item.barcode_bill_name || item.product_name1 || "",
                    ratio: item.unit_rate,
                    unit_code: item.unit_code,
                  }));
                }}
              >
                {item.barcode_bill_name || item.product_name1} (
                {item.product_code})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
