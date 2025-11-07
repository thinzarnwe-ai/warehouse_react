import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useStockForm } from "../../custom_hooks/useStockForm";

import BranchSelect from "./BranchSelect";
import ProductSearchTransfer from "./ProductSearchTransfer";
import LocationSelectTransfer from "./LocationSelectTransfer";
import TransferQuantityFields from "./TransferQuantityFields";
import RemarkField from "./RemarkField";
import SubmitButton from "./SubmitButton";
import TransferFormFields from "./TransferFormField";
import TransferLocation from "./TransferLocation";

export default function Create_Transfer() {
  const [errors, setErrors] = useState({});
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isActive, setIsActive] = useState(document.hasFocus());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    location_name: "",
    product_code: "",
    product_name: "",
    qty: "",
    transfer_qty: "",
    transfer_location: "",
    remark: "",
  });

  const {
    branches,
    loadingBranches,
    locationOptions,
    selectedLocation,
    setSelectedLocation,
    startScan,
  } = useStockForm({ form, setForm, selectedBranch });

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
    if (branches.length > 0 && !selectedBranch) setSelectedBranch(branches[0]);
  }, [branches]);

 useEffect(() => {
    const scannedData = sessionStorage.getItem("scannedData");
    const scanTarget = sessionStorage.getItem("scanTarget");
    const savedDraft = sessionStorage.getItem("formDraft");

    if (scannedData && scanTarget) {
      let updatedForm = form;

      if (savedDraft) {
        try {
          updatedForm = JSON.parse(savedDraft);
        } catch (e) {
          console.error("Failed to parse saved draft:", e);
        }
      }

      if (scanTarget === "location") {
        const matchedOption = locationOptions.find(
          (opt) => opt.value === scannedData
        );
        // console.log(matchedOption);
        if (matchedOption) {
          setSelectedLocation(matchedOption);
          updatedForm = {
            ...updatedForm,
            location_name: matchedOption.value,
            qty: matchedOption.qty ?? "",
          };
        }
      } else if (scanTarget === "transfer_location") {
        updatedForm = {
          ...updatedForm,
          transfer_location: scannedData,
        };
      } else if (scanTarget === "product" || scanTarget === "product_code") {
        updatedForm = {
          ...updatedForm,
          product_code: scannedData,
        };
      }

      setForm(updatedForm);
      sessionStorage.setItem("formDraft", JSON.stringify(updatedForm));
      sessionStorage.removeItem("scannedData");
      sessionStorage.removeItem("scanTarget");
    }
  }, [locationOptions]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/stock_tracking_transfer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, from_branch: selectedBranch?.value }),
      });
      const result = await res.json();

      if (res.ok) {
        toast.success("Transfer saved successfully.");
        sessionStorage.clear();
        navigate("/transfer_lists");
      } else {
        if (result.errors) setErrors(result.errors);
        toast.error(result.message || "Validation failed.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Error saving form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="md:bg-gray-200 md:p-6">
      <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-primary shadow rounded-3xl overflow-hidden">
        <div className="flex items-center justify-center py-4 md:py-6 bg-primary text-white">
          <h2 className="text-lg md:text-2xl font-bold text-center">
            Change Location
          </h2>
        </div>
        {!isActive && (
          <div className="px-4 md:px-8 py-2 text-center text-sm md:text-base bg-yellow-500 text-white font-medium">
            Cursor ထွက်နေပါသဖြင့် scanner အသုံးပြု၍ မရနိုင်ပါ။
          </div>
        )}

        <div className="border-t border-gray-300 bg-white rounded-b-3xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <BranchSelect
              branches={branches}
              loadingBranches={loadingBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
            />

            <ProductSearchTransfer
              form={form}
              setForm={setForm}
              selectedBranch={selectedBranch}
              startScan={startScan}
            />

            <TransferFormFields form={form} setForm={setForm} errors={errors} />
            <LocationSelectTransfer
              form={form}
              setForm={setForm}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              locationOptions={locationOptions}
              errors={errors}
            />

            <TransferQuantityFields form={form} setForm={setForm} errors={errors} />

            <TransferLocation form={form} setForm={setForm} errors={errors} startScan={startScan} />
            <RemarkField form={form} setForm={setForm} errors={errors} />

            <SubmitButton isSubmitting={isSubmitting} />
          </div>
        </div>
      </div>
    </form>
  );
}
