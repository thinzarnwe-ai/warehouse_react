import React, { useState, useEffect } from "react";

export default function ProductSearchTransfer({ form, setForm, selectedBranch, startScan }) {
  const [search, setSearch] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
       if (form.product_code && /^\d+$/.test(form.product_code)) {
         setSearch(form.product_code);
       }
     }, [form.product_code]);


  useEffect(() => {
    if (!/^\d+$/.test(search)) setSearch(form.product_name || "");
  }, [form.product_name]);

  useEffect(() => {
    const branch = selectedBranch?.value;
    const keyword = search.trim();
    if (!branch || !keyword) {
      setSuggestions([]);
      return;
    }

    if (/^\d+$/.test(keyword)) {
      setSuggestions([]);
      setForm((prev) => ({
        ...prev,
        product_code: keyword,
        product_name: "",
        location_name: "",
        qty: "",
      }));
      return;
    }

    if (keyword.length < 2) return setSuggestions([]);
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/product/${keyword}/${branch}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setSuggestions(Array.isArray(json?.data) ? json.data : []);
      } catch {
        setSuggestions([]);
      }
    };

    const t = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(t);
  }, [search, selectedBranch]);

  const handleClear = () => {
    setSearch("");
    setForm((prev) => ({
      ...prev,
      product_code: "",
      product_name: "",
      location_name: "",
      qty: "",
    }));
    setSuggestions([]);
  };

  return (
    <div className="sm:col-span-3 relative">
      <label className="block text-sm font-medium text-primary">
        Search Product Code / Name <span className="text-red-600">*</span>
      </label>
      <div className="flex gap-3 relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsTyping(true)}
          onBlur={() => setTimeout(() => setIsTyping(false), 200)}
          placeholder="Enter or scan product"
          className="mt-2 border-primary w-full rounded-md px-3 py-1.5 text-base text-gray-900"
        />
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-14 top-3 text-gray-500 hover:text-gray-600"
          >
            ✕
          </button>
        )}
        <button
          type="button"
          className="border-2 px-2 rounded border-primary"
          onClick={() => startScan("product")}
        >
          📷
        </button>

        {isTyping && suggestions.length > 0 && (
          <ul className="absolute top-full mt-1 bg-white border rounded shadow-md max-h-40 overflow-auto z-50 w-full">
            {suggestions.map((item) => (
              <li
                key={item.product_code}
                className="px-3 py-1 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  setIsTyping(false);
                  setSuggestions([]);
                  setSearch(item.product_name || "");
                  setForm((prev) => ({
                    ...prev,
                    product_code: item.product_code,
                    product_name: item.product_name,
                    location_name: "",
                    qty: "",
                  }));
                }}
              >
                {item.product_name} ({item.product_code})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
