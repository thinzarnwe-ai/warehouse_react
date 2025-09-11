import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { useStockForm } from "../custom_hooks/useStockForm";
import { useNavigate, useLocation } from "react-router-dom";

export default function Create_StockIn() {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    location_name: "",
    product_code: "",
    product_name: "",
    qty: "",
    remark: "",
    ratio: "",
    unit_code: "",
  });

  const { branches, loadingBranches, startScan } = useStockForm({
    form,
    setForm,
    selectedBranch,
    enableProductFetch: false,
  });

  //Scan Qr or Bar code
  useEffect(() => {
    const draft = sessionStorage.getItem("formDraft");
    if (draft) {
      setForm(JSON.parse(draft));
    }

    const scannedData = sessionStorage.getItem("scannedData");
    const scanTarget = sessionStorage.getItem("scanTarget");

    if (scannedData && scanTarget) {
      setForm((prev) => ({
        ...prev,
        [scanTarget === "location" ? "location_name" : "product_code"]:
          scannedData,
      }));

      sessionStorage.removeItem("scannedData");
      sessionStorage.removeItem("scanTarget");
    }
  }, [location]);

  //Branch Selected
  useEffect(() => {
    if (branches.length > 0 && !selectedBranch) {
      setSelectedBranch(branches[0]);
    }
  }, [branches]);

  //search by porduct code fetch
 useEffect(() => {
    const fetchProductName = async () => {
      const code = form.product_code?.trim();
      const branch = selectedBranch?.value;
      if (!code) return;
      if (!branch) return;

      try {
        const token = localStorage.getItem("token");
        // console.log(selectedBranch.value);
        // const branch = selectedBranch.value;
        const res = await fetch(`/api/get-product/${code}/${branch}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();
        // console.log(json.data);
        const productName = json?.data?.product_name?.barcode_bill_name || "";
        const ratio = json?.data?.product_name?.unit_rate || "";
        const unit = json?.data?.product_name?.unit_code || "";
        console.log(unit);

        setForm((prev) => ({
          ...prev,
          product_name: productName,
          ratio:ratio,
          unit:unit,
        }));
      } catch (err) {
        // console.warn("Failed to fetch product name:", err);
        setForm((prev) => ({
          ...prev,
          product_name: "",
          ratio: "",
          unit: "",
        }));
      }
    };

    fetchProductName();
  }, [form.product_code, selectedBranch?.value]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "product_name") {
      setIsTyping(true);
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //search by product name
  // useEffect(() => {
  //   const name = form.product_name?.trim();
  //   // console.log(name);
  //   if (!name) {
  //     setNameSuggestions([]);
  //     return;
  //   }

  //   const delayDebounce = setTimeout(async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const res = await fetch(`/api/product_name/${name}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           Accept: "application/json",
  //         },
  //       });

  //       const json = await res.json();
  //       // console.log(json);
  //       setNameSuggestions(json?.data?.product_name || []);
  //     } catch (err) {
  //       setNameSuggestions([]);
  //     }
  //   }, 300);

  //   return () => clearTimeout(delayDebounce);
  // }, [form.product_name]);

  // console.log(nameSuggestions);

  //form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/stock_tracking_in", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          from_branch: selectedBranch?.value,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Stock In saved successfully.");
        navigate("/stock_in_lists");
        sessionStorage.removeItem("formDraft");
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        toast.error(result.message || "Validation failed.");
      }
    } catch (error) {
      toast.error("An error occurred while saving form.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="md:bg-gray-200 md:p-[20px]">
      <div className="space-y-12 pb-0 md:w-[75%] md:m-auto border-1 border-primary shadow rounded-3xl bg-primary">
        <div className="md:h-15 h-15 flex items-end justify-center rounded">
          <h2 className="text-2xl font-bold text-white">Stock In Form</h2>
        </div>
        <div className="border-b border-gray-900/10 pb-12 bg-white w-full p-10 rounded-t-4xl">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Branch Select */}
            <div className="sm:col-span-3">
              <label
                htmlFor="branch"
                className="block text-sm font-medium text-primary"
              >
                Branch <span className="text-red-600">*</span>
              </label>
              <div className="mt-2">
                <Select
                  id="branch"
                  name="branch_name"
                  options={branches}
                  value={selectedBranch}
                  onChange={setSelectedBranch}
                  isLoading={loadingBranches}
                  placeholder="Select a branch"
                  className="text-sm w-full border border-primary"
                  classNamePrefix="react-select"
                />
              </div>
            </div>

            {/* Location */}
            <div className="sm:col-span-3">
              <label
                htmlFor="location_name"
                className="block text-sm font-medium text-primary"
              >
                Location <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-5">
                <input
                  type="text"
                  name="location_name"
                  value={form.location_name}
                  onChange={handleInputChange}
                  className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900 bg-gray-200"
                  
                />

                <button
                  type="button"
                  className="border-2 px-1 rounded border-primary"
                  onClick={() => startScan("location")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-8"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 9.375v-4.5ZM4.875 4.5a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 0 1-1.875-1.875v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75A.75.75 0 0 1 6 7.5v-.75Zm9.75 0A.75.75 0 0 1 16.5 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.035-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 19.125v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875-.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM6 16.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm9.75 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm-3 3a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {errors.location_name && (
                <p className="text-red-500">{errors.location_name[0]}</p>
              )}
            </div>

            {/* Product Code */}
            <div className="sm:col-span-3">
              <label
                htmlFor="product_code"
                className="block text-sm font-medium text-primary"
              >
                Product Code <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-5">
                <input
                  type="text"
                  name="product_code"
                  value={form.product_code}
                  onChange={handleInputChange}
                  className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900"
                />
                <button
                  className="border-2 px-1 rounded border-primary"
                  type="button"
                  onClick={() => startScan("product")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-8"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 9.375v-4.5ZM4.875 4.5a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 0 1-1.875-1.875v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75A.75.75 0 0 1 6 7.5v-.75Zm9.75 0A.75.75 0 0 1 16.5 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.035-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 19.125v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875-.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM6 16.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm9.75 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm-3 3a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {errors.product_code && (
                <p className="text-red-500">{errors.product_code[0]}</p>
              )}
            </div>

            {/* Product Name */}
            <div className="sm:col-span-3">
              <label
                htmlFor="product_name"
                className="block text-sm font-medium text-primary"
              >
                Product Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="product_name"
                value={form.product_name}
                onChange={handleInputChange}
                className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900"
              />
              {errors.product_name && (
                <p className="text-red-500">{errors.product_name[0]}</p>
              )}
            </div>

           


            {/* Ratio */}
            <div className="sm:col-span-3">
              <label
                htmlFor="product_name"
                className="block text-sm font-medium text-primary"
              >
                Ratio <span className="text-red-600">*</span>
              </label>
              <input
               onChange={handleInputChange} 
                type="text"
                name="ratio"
                value={form.ratio}
                className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900 "
              />
           
            </div>

             {/* Unit Code*/}
            <div className="sm:col-span-3">
              <label
                htmlFor="product_name"
                className="block text-sm font-medium text-primary"
              >
                Unit <span className="text-red-600">*</span>
              </label>
              <input
               onChange={handleInputChange} 
                type="text"
                name="unit"
                value={form.unit}
                className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900 "
              />
           
            </div>

            {/* Quantity */}
            <div className="sm:col-span-3">
              <label
                htmlFor="qty"
                className="block text-sm font-medium text-primary"
              >
                Add Quantity <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="qty"
                min="0"
                value={form.qty}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "+")
                    e.preventDefault();
                }}
                className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900"
              />
              {errors.qty && <p className="text-red-500">{errors.qty[0]}</p>}
            </div>

            {/* Remark */}
            <div className="sm:col-span-3">
              <label
                htmlFor="remark"
                className="block text-sm font-medium text-primary"
              >
                Reason <span className="text-red-600">*</span>
              </label>
              <textarea
                name="remark"
                value={form.remark}
                onChange={handleInputChange}
                rows="5"
                className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900"
              />
              {errors.remark && (
                <p className="text-red-500">{errors.remark[0]}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-x-6 w-full">
              <button
                type="submit"
                className="rounded-md bg-primary px-10 py-3 text-md font-semibold text-white shadow hover:bg-[#6ac9c9]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
