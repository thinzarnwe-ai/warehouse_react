import { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useStockForm } from "../custom_hooks/useStockForm";

export default function Create_StockOut() {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isActive, setIsActive] = useState(document.hasFocus());
  const [errors, setErrors] = useState({});
  const [isTyping, setIsTyping] = useState(false)
  const navigate = useNavigate();
  const SUGGESTIONS = [
    { value: "Promotion", label: "Promotion" },
    { value: "Display Area", label: "Display Area" },
    { value: "Other", label: "Other" },
  ];
  const [selectedOption, setSelectedOption] = useState(null);
  const [form, setForm] = useState({
    location_name: "",
    product_code: "",
    product_name: "",
    qty: "",
    reduce_qty: "",
    remark: "",
  });

  const {
    branches,
    loadingBranches,
    locationOptions,
    selectedLocation,
    nameSuggestions,
    setNameSuggestions,
    setSelectedLocation,
    startScan,
  } = useStockForm({ form, setForm, selectedBranch });

  const [buffer, setBuffer] = useState("");
  const [lastTime, setLastTime] = useState(0);

  useEffect(() => {
    const handleFocus = () => setIsActive(true);
    const handleBlur = () => setIsActive(false);

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentTime = new Date().getTime();

      if (currentTime - lastTime > 100) {
        setBuffer("");
      }

      if (e.key === "Enter") {
        console.log(buffer);

        // const isDecimal = /^\d+$/.test(buffer[0]);
        // if (isDecimal) {
          setForm((prev) => ({ ...prev, product_code: buffer }))
            .then(() => setBuffer(""));
        // } else {
        //   const fixedLocationName = buffer.replace(/Shift/g, '');
        //   setForm((prev) => ({ ...prev, location_name: fixedLocationName }))
        //     .then(() => setBuffer(""));
        // }

      } else {
        setBuffer((prev) => prev + e.key);
      }

      setLastTime(currentTime);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [buffer, lastTime]);

  //Scan QR // Bar Code
  useEffect(() => {

    const scannedData = sessionStorage.getItem("scannedData");
    const scanTarget = sessionStorage.getItem("scanTarget");

    if (scannedData && scanTarget) {
      setForm((prev) => ({
        ...prev,
        [scanTarget === "location" ? "location_name" : "product_code"]: scannedData,
      }));

      sessionStorage.removeItem("scannedData");
      sessionStorage.removeItem("scanTarget");
    }
  }, [location]);


  //branch selected
  useEffect(() => {
    if (branches.length > 0 && !selectedBranch) {
      setSelectedBranch(branches[0]);
    }
  }, [branches]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "product_name") {
      setIsTyping(true);
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // console.log(nameSuggestions);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/stock_tracking_out", {
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
      // console.log(result);
      if (res.ok) {
        toast.success("Stock Out saved successfully ");
        navigate("/stock_out_lists");
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        toast.error(result.message || "Validation failed.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An error occurred while saving form.");
    }
  };

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    if (!option) {
      setForm({ ...form, remark: "" });
    } else if (option.value === "Other") {
      setForm({ ...form, remark: "" });
    } else {
      setForm({ ...form, remark: option.value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="md:bg-gray-200 md:p-[20px]">
      <div className="space-y-12 pb-0 md:w-[75%] md:m-auto border-1 border-primary shadow rounded-3xl bg-primary">
        <div className="md:h-15 h-15 flex items-end justify-center rounded">
          <h2 className="text-2xl font-bold text-white">Stock Out Form</h2>
        </div>

        {!isActive && <div className="flex justify-end me-10" style={{ color: "white", marginBottom: 20 }}>Cursor ထွက်နေပါသဖြင့် scanner အားအသုံးပြု၍ရနိုင်မည်မဟုတ်ပါ</div>}

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
                  className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base  text-gray-900"
                />
                <button
                  type="button"
                  className="border-2 px-1 rounded border-primary"
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


            {isTyping && nameSuggestions.length > 0 && (
              <div className="sm:col-span-3 relative">
                <ul className="bg-white border rounded shadow-md max-h-40 overflow-auto z-50 absolute w-full">
                  {nameSuggestions.map((item) => (
                    <li
                      key={item.product_code}
                      className="px-3 py-1 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setIsTyping(false);
                        setNameSuggestions([]);
                        setForm((prev) => ({
                          ...prev,
                          product_name: item.product_name,
                          product_code: item.product_code,
                        }));
                      }}
                    >
                      {item.product_name} ({item.product_code})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Location */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-primary">
                From Location
              </label>
              <Select
                options={locationOptions}
                value={selectedLocation}
                onChange={(selected) => {
                  setSelectedLocation(selected);
                  setForm((prev) => ({
                    ...prev,
                    location_name: selected?.value || "",
                    qty: selected?.qty || "",
                  }));
                }}
                placeholder="Select location"
                className="border border-primary"
                isClearable
              />
              {errors.location_name && (
                <p className="text-red-500">{errors.location_name[0]}</p>
              )}
            </div>

            {/* Quantity */}
            <div className="sm:col-span-3">
              <label
                htmlFor="qty"
                className="block text-sm font-medium text-primary"
              >
                Total Quantity <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="qty"
                value={form.qty}
                onChange={handleInputChange}
                readOnly
                className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900 bg-gray-100"
              />
              {errors.qty && <p className="text-red-500">{errors.qty[0]}</p>}
            </div>

            {/* Quantity */}
            <div className="sm:col-span-3">
              <label
                htmlFor="reduce_qty"
                className="block text-sm font-medium text-primary"
              >
                Out Quantity <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="reduce_qty"
                min="0"
                value={form.reduce_qty}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "+")
                    e.preventDefault();
                }}
                className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900"
              />
              {errors.reduce_qty && (
                <p className="text-red-500">{errors.reduce_qty[0]}</p>
              )}
            </div>

            {/* Remark */}
            <div className="sm:col-span-3">
              <label
                htmlFor="remark"
                className="block text-sm font-medium text-primary"
              >
                Remark <span className="text-red-600">*</span>
              </label>
              <div className="mt-2">
                <Select
                  options={SUGGESTIONS}
                  value={selectedOption}
                  onChange={handleSelectChange}
                  placeholder="Select a remark"
                  className="text-sm w-full border border-primary"
                  classNamePrefix="react-select"
                  isClearable
                />
              </div>

              {selectedOption?.value === "Other" && (
                <input
                  type="text"
                  name="remark"
                  value={form.remark}
                  onChange={handleInputChange}
                  placeholder="Enter your remark"
                  className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900"
                />
              )}
              {errors?.remark && (
                <p className="text-red-500">{errors.remark[0]}</p>
              )}
            </div>
            {/* Submit Button */}
            <div className="flex items-center justify-end gap-x-6 w-full">
              <button
                type="submit"
                className="rounded-md bg-primary px-10 py-4 text-md font-semibold text-white shadow hover:bg-[#6ac9c9]"
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
