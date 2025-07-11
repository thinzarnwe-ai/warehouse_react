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
  const [nameSuggestions, setNameSuggestions] = useState([]);

  const navigate = useNavigate();

  // QR SCAN navigate page
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

  const code = form.product_code?.trim();
  const branch = selectedBranch?.value;

  if (!code || !branch) return;

  const debounceTimeout = setTimeout(async () => {
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/product/${code}/${branch}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();
        const results = json?.data || [];
        console.log(results);
        if (!Array.isArray(results) || results.length === 0) {
          toast.error("Product code ရှာမတွေ့ပါ");
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
  }, 500); 

  return () => clearTimeout(debounceTimeout); 
}, [enableProductFetch, form.product_code, selectedBranch]);

// search by product name
useEffect(() => {
    const name = form.product_name?.trim();
    const branch = selectedBranch?.value;
    // console.log(branch);
    if (!name) {
      setNameSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/product_name/${name}/${branch}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const json = await res.json();
        // console.log(json);
        setNameSuggestions(json?.data?.product_name || []);
      } catch (err) {
        setNameSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [form.product_name]);

  return {
    branches,
    loadingBranches,
    locationOptions,
    selectedLocation,
    setSelectedLocation,
    startScan,
    nameSuggestions,
    setNameSuggestions,
  };
}
