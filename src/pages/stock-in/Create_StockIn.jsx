import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useStockForm } from "../../custom_hooks/useStockForm";
import BranchSelect from "./BranchSelect";
import LocationScanner from "./LocationScanner";
import ProductSearch from "./ProductSearch";
import StockInFormFields from "./StockInFormFields";

export default function CreateStockIn() {
  const [form, setForm] = useState({
    location_name: "",
    product_code: "",
    product_name: "",
    qty: "",
    remark: "",
    ratio: "",
    unit_code: "",
  });

  const [isActive, setIsActive] = useState(document.hasFocus());
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [buffer, setBuffer] = useState("");
  const [lastTime, setLastTime] = useState(0);

  const { branches, loadingBranches, startScan } = useStockForm({
    form,
    setForm,
    selectedBranch,
    enableProductFetch: false,
  });

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

        const isDecimal = /^\d+$/.test(buffer[0]);
        if (isDecimal) {
          setForm((prev) => ({ ...prev, product_code: buffer }));
        } else {
          const fixedLocationName = buffer.replace(/Shift/g, "");
          setForm((prev) => ({
            ...prev,
            location_name: fixedLocationName,
          }));
        }
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

  useEffect(() => {
    if (branches.length && !selectedBranch) setSelectedBranch(branches[0]);
  }, [branches]);

  useEffect(() => {
    const draft = sessionStorage.getItem("formDraft");
    if (draft) setForm(JSON.parse(draft));

    const scannedData = sessionStorage.getItem("scannedData");
    const scanTarget = sessionStorage.getItem("scanTarget");
    console.log(scannedData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrors({});
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/stock_tracking_in", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, from_branch: selectedBranch?.value }),
      });
      const result = await res.json();

      if (res.ok) {
        toast.success("Stock In saved successfully.");
        navigate("/stock_in_lists");
        sessionStorage.removeItem("formDraft");
      } else {
        setErrors(result.errors || {});
        toast.error(result.message || "Validation failed.");
      }
    } catch (err) {
      toast.error("An error occurred while saving form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 bg-gray-100 ">
      <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-primary shadow rounded-3xl overflow-hidden">
        <div className="flex items-center justify-center py-4 md:py-6 bg-primary text-white">
          <h2 className="text-lg md:text-2xl font-bold text-center">
            Stock In Form
          </h2>
        </div>

        {!isActive && (
          <div className="px-4 md:px-8 py-2 text-center text-sm md:text-base bg-yellow-500 text-white font-medium">
            Cursor ထွက်နေပါသဖြင့် scanner အသုံးပြု၍ မရနိုင်ပါ။
          </div>
        )}

        <div className="grid grid-cols-2 md:w-3/4 mx-auto  gap-5 bg-white p-5 rounded-xl shadow">
          <BranchSelect
            branches={branches}
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
            loading={loadingBranches}
          />

          <LocationScanner
            form={form}
            setForm={setForm}
            startScan={startScan}
          />

          <ProductSearch
            form={form}
            setForm={setForm}
            selectedBranch={selectedBranch}
            startScan={startScan}
          />

          <StockInFormFields form={form} setForm={setForm} errors={errors} />

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-md bg-primary px-10 py-4 text-md font-semibold text-white shadow 
              ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#6ac9c9]"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
