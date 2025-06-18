import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-hot-toast";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  Html5QrcodeScanType,
} from "html5-qrcode";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningTarget, setScanningTarget] = useState(null);
  const qrRegionId = "qr-reader";
  const navigate = useNavigate();
  const [form, setForm] = useState({
    location_name: "",
    product_code: "",
    product_name: "",
    qty: "",
    remark: "",
  });

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
            // console.log(decodedText);
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
          (error) => {
            console.error("Failed to load data:", error);
          }
        );
      }
    }, 200);
  };

  useEffect(() => {
    const fetchProductName = async () => {
      const code = form.product_code?.trim();
      if (!code) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/product/${code}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();

        const productName = json?.data?.product_name?.product_name1 || "";
        // console.log(productName);

        setForm((prev) => ({
          ...prev,
          product_name: productName,
        }));
      } catch (err) {
        console.warn("Failed to fetch product name:", err);
        setForm((prev) => ({
          ...prev,
          product_name: "",
        }));
      }
    };

    fetchProductName();
  }, [form.product_code]);

  useEffect(() => {
    const fetchBranches = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("/api/user-branch", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        const formatted = data.data.map((branch) => ({
          value: branch.id,
          label: branch.name,
        }));

        setBranches(formatted);
      } catch (error) {
        console.error("Failed to fetch branches", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        toast.success("Stock In saved successfully ✅");
        navigate("/stock_in_lists");
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An error occurred while saving form.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="md:bg-gray-200 md:p-[20px]">
      <div className="space-y-12 pb-0 md:w-[75%] md:m-auto border-1 border-primary shadow rounded-3xl bg-primary">
        <div className="md:h-15 h-15 flex items-end justify-center rounded">
          <h2 className="text-2xl font-bold text-white">Stock In Form</h2>
        </div>
        {isScanning && (
          <div className="my-4">
            <p className="font-medium text-sm mb-2 text-gray-700">
              Scanning{" "}
              {scanningTarget === "location" ? "Location" : "Product Code"}...
            </p>
            <div
              id={qrRegionId}
              className="w-full max-w-xs mx-auto border rounded p-2"
            />
          </div>
        )}

        <div className="border-b border-gray-900/10 pb-12 bg-white w-full p-10 rounded-t-4xl">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Branch Select */}
            <div className="sm:col-span-3">
              <label
                htmlFor="branch"
                className="block text-sm font-medium text-gray-900"
              >
                Branch
              </label>
              <div className="mt-2">
                <Select
                  id="branch"
                  name="branch_name"
                  options={branches}
                  value={selectedBranch}
                  onChange={setSelectedBranch}
                  isLoading={loading}
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
                className="block text-sm font-medium text-gray-900"
              >
                Location
              </label>
              <div className="flex gap-5">
                <input
                  type="text"
                  name="location_name"
                  value={form.location_name}
                  onChange={handleInputChange}
                  className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900"
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
            </div>

            {/* Product Code */}
            <div className="sm:col-span-3">
              <label
                htmlFor="product_code"
                className="block text-sm font-medium text-gray-900"
              >
                Product Code
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
            </div>

            {/* Product Name */}
            <div className="sm:col-span-3">
              <label
                htmlFor="product_name"
                className="block text-sm font-medium text-gray-900"
              >
                Product Name
              </label>
              <input
                type="text"
                name="product_name"
                value={form.product_name}
                onChange={handleInputChange}
                className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900"
              />
            </div>

            {/* Quantity */}
            <div className="sm:col-span-3">
              <label
                htmlFor="qty"
                className="block text-sm font-medium text-gray-900"
              >
                Add Quantity
              </label>
              <input
                type="number"
                name="qty"
                value={form.qty}
                onChange={handleInputChange}
                className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900"
              />
            </div>

            {/* Remark */}
            <div className="sm:col-span-3">
              <label
                htmlFor="remark"
                className="block text-sm font-medium text-primary"
              >
                Remark
              </label>
              <textarea
                name="remark"
                value={form.remark}
                onChange={handleInputChange}
                rows="5"
                className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-x-6 w-full">
              <button
                type="submit"
                className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
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
