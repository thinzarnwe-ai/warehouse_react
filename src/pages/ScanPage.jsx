// src/pages/ScanPage.jsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ScanPage() {
  const { target } = useParams(); // 'product' or 'location'
  const navigate = useNavigate();

  useEffect(() => {
    const startScanning = async () => {
      // Initialize QR scanner here (example only)
      const scannedData = await mockScan(target); // Replace with real scanner logic

      // Send scanned data back to previous page via sessionStorage/localStorage or global state
      sessionStorage.setItem("scannedData", scannedData);
      sessionStorage.setItem("scanTarget", target);

      navigate(-1); // Go back to previous page
    };

    startScanning();
  }, [target, navigate]);

  const mockScan = (target) =>
    new Promise((resolve) => setTimeout(() => resolve(`${target}_123`), 1500));

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold">Scanning {target}...</h2>
      <div id="qr-reader" className="mt-5 border p-4" />
    </div>
  );
}
