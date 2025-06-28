import { useEffect, useState } from "react";
import {
  Html5Qrcode,
  Html5QrcodeScanType,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import { toast } from "react-hot-toast";

export function useStockForm({
  form,
  setForm,
  selectedBranch,
  qrRegionId = "qr-reader",
  enableProductFetch = true,
}) {
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningTarget, setScanningTarget] = useState(null);

  // QR SCAN LOGIC
  const startScan = async (field) => {
    setScanningTarget(field);
    setIsScanning(true);

    setTimeout(async () => {
      const html5QrCode = new Html5Qrcode(qrRegionId);
      const cameras = await Html5Qrcode.getCameras();

      if (cameras && cameras.length) {
        html5QrCode.start(
          cameras[0].id,
          {
            fps: 10,
            qrbox: 300,
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.ITF,
            ],
          },
          (decodedText) => {
            setForm((prev) => ({
              ...prev,
              [field === "location" ? "location_name" : "product_code"]:
                decodedText,
            }));
            html5QrCode.stop().then(() => {
              html5QrCode.clear();
              setIsScanning(false);
            });
          },
          (err) => {
            console.error("QR Scan Error", err);
          }
        );
      }
    }, 200);
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

        if (!Array.isArray(results) || results.length === 0) {
          toast.error("Product not found.");
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
    isScanning,
    scanningTarget,
    startScan,
  };
}
