import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useStockForm } from "../../custom_hooks/useStockForm"
import BranchSelect from "./BranchSelect";
import ProductSearchOut from "../stock-out/ProductSearchOut";
import LocationSelectOut from "./LocationSelectOut";
import QuantityFieldsOut from "./QuantityFieldsOut";
import RemarkSelectOut from "./RemarkSelectOut";
import StockOutFormFields from "./StockOutFormField";

export default function CreateStockOut() {
  const [form, setForm] = useState({
    location_name: "",
    product_code: "",
    product_name: "",
    qty: "",
    reduce_qty: "",
    remark: "",
  });

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [errors, setErrors] = useState({});
  const [isActive, setIsActive] = useState(document.hasFocus());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    branches,
    loadingBranches,
    locationOptions,
    selectedLocation,
    setSelectedLocation,
    startScan,
  } = useStockForm({ form, setForm, selectedBranch });

  useEffect(() => {
    if (branches.length > 0 && !selectedBranch) {
      setSelectedBranch(branches[0]);
    }
  }, [branches]);

  useEffect(() => {
    if (branches.length && !selectedBranch) setSelectedBranch(branches[0]);
  }, [branches]);

  useEffect(() => {
    const draft = sessionStorage.getItem("formDraft");
    if (draft) setForm(JSON.parse(draft));

    const scannedData = sessionStorage.getItem("scannedData");
    const scanTarget = sessionStorage.getItem("scanTarget");
    // console.log(scannedData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
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
      if (res.ok) {
        toast.success("Stock Out saved successfully.");
        navigate("/stock_out_lists");
      } else {
        if (result.errors) setErrors(result.errors);
        toast.error(result.message || "Validation failed.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An error occurred while saving form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-5 "
    >
      <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-primary shadow rounded-3xl overflow-hidden">

        <div className="flex items-center justify-center py-4 md:py-6 bg-primary text-white">
          <h2 className="text-lg md:text-2xl font-bold text-center">
            Stock Out Form
          </h2>
        </div>


        {!isActive && (
          <div className="px-4 md:px-8 py-2 text-center text-sm md:text-base bg-yellow-500 text-white font-medium">
            Cursor ထွက်နေပါသဖြင့် scanner အသုံးပြု၍ မရနိုင်ပါ။
          </div>
        )}


        <div className="grid grid-cols-2 md:w-3/4 mx-auto  gap-5 bg-white p-5 rounded-xl shadow">
          {/* <div className="grid grid-cols-1 md:w-3/4 mx-auto gap-4 md:gap-6"> */}

            <BranchSelect
              branches={branches}
              loadingBranches={loadingBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
            />


            <ProductSearchOut form={form} setForm={setForm} selectedBranch={selectedBranch} startScan={startScan} />

            <StockOutFormFields form={form} setForm={setForm} errors={errors} />

            <LocationSelectOut
              form={form}
              setForm={setForm}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              locationOptions={locationOptions}
              errors={errors}
            />


            <QuantityFieldsOut form={form} setForm={setForm} errors={errors} />

            <RemarkSelectOut form={form} setForm={setForm} errors={errors} />
          {/* </div> */}

          <div className="flex justify-end col-span-2 mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-md bg-primary px-8 py-3 md:px-10 md:py-4 text-base md:text-md font-semibold text-white shadow transition-all duration-300 
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#6ac9c9]"}`}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </form>

  );
}
