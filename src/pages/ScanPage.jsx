import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function ScanPage() {
  const { target } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const [error, setError] = useState("");

  const handleScan = (err, result) => {
    if (result) {
      const scannedText = result.text;
      setData(scannedText);
      sessionStorage.setItem("scannedData", scannedText);
      sessionStorage.setItem("scanTarget", target ?? "");
      navigate(-1); // Navigate back after successful scan
    }
    // if (err) {
      // setError("Scanning failed. Please try again.");
      // console.warn(err);
    // }
  };

  return (
    <div className="relative w-screen h-screen bg-black text-white flex flex-col">
      <div className="flex justify-between items-center px-4 py-3 bg-blue-500 text-white">
        <button onClick={() => navigate(-1)} className="text-md font-semibold">
          Cancel
        </button>
        <h2 className="text-lg font-bold">Scan QR / Barcode</h2>
        <div className="w-12" />
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="w-64 h-64 overflow-hidden rounded shadow">
          <BarcodeScannerComponent
            width={256}
            height={256}
            facingMode="environment"
            onUpdate={handleScan}
          />
        </div>
        {error && <p className="mt-2 text-red-400">{error}</p>}
        <p className="mt-4 text-gray-300">Align QR / barcode within the frame</p>
      </div>
    </div>
  );
}
