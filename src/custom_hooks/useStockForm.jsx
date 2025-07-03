import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useStockForm({
  form,
  setForm,
  selectedBranch,
  enableProductFetch = true,
}) {
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
   const navigate = useNavigate();

  // QR SCAN LOGIC
  const startScan = (field) => {
  sessionStorage.setItem("formDraft", JSON.stringify(form));
  navigate(`/scan/${field}`);
};


  // FETCH BRANCHES
  useEffect(() => {
    const fetchBranches = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("/api/user-branch", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();
        const formatted = json.data.map((branch) => ({
          value: branch.id,
          label: branch.name,
        }));

        setBranches(formatted);
      } catch (error) {
        console.error("Failed to fetch branches", error);
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);
  

  // FETCH PRODUCT DETAILS
  useEffect(() => {
    if (!enableProductFetch) return;
    const fetchProductDetails = async () => {
      const code = form.product_code?.trim();
      console.log(code,'p_code')
      const branch = selectedBranch?.value;
      if (!code || !branch) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/product/${code}/${branch}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();
        const results = json?.data?.[0] || [];
        console.log(!Array.isArray(results) || results.length === 0,'hii');
        if (!Array.isArray(results) || results.length === 0) {
          // toast.error("Product not found.");
          setForm((prev) => ({
            ...prev,
            product_name: "",
            location_name: "",
            qty: "",
          }));
          setLocationOptions([]);
          return;
        }

        const productName = results[0].product_name;
        const locations = results.map((item) => ({
          value: item.location_name,
          label: item.location_name,
          qty: item.total_qty,
        }));

        setForm((prev) => ({
          ...prev,
          product_name: productName,
          location_name: "",
          qty: "",
        }));
        setLocationOptions(locations);
        setSelectedLocation(null);
      } catch (err) {
        console.error("Fetch product error:", err);
        toast.error("Failed to fetch product data.");
      }
    };

    fetchProductDetails();
  }, [enableProductFetch, form.product_code, selectedBranch]);

  return {
    branches,
    loadingBranches,
    locationOptions,
    selectedLocation,
    setSelectedLocation,
    startScan,
  };
}
