import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

export default function ScanPage() {
  const { target } = useParams();
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const qrRegionId = "qr-reader";
  const [error, setError] = useState("");

  useEffect(() => {
    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode(qrRegionId);
        scannerRef.current = scanner;

        const cameras = await Html5Qrcode.getCameras();
        if (!cameras.length) throw new Error("No camera found");

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 250,
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
            ],
          },
          (decodedText) => {
            sessionStorage.setItem("scannedData", decodedText);
            sessionStorage.setItem("scanTarget", target);
            stopAndGoBack();
          },
          (errorMsg) => {
            console.warn("Scan Error:", errorMsg);
          }
        );
      } catch (err) {
        setError(err.message);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current?.getState?.() === 2) {
        scannerRef.current.stop().then(() => scannerRef.current.clear());
      }
    };
  }, [target]);

  const stopAndGoBack = async () => {
    try {
      if (scannerRef.current?.getState?.() === 2) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
    } catch {}
    navigate(-1);
  };

  return (
    <div className="relative w-screen h-screen bg-black text-white flex flex-col">
      <div className="flex justify-between items-center px-4 py-3 bg-blue-500 text-white">
        <button onClick={stopAndGoBack} className="text-md font-semibold">
          Cancel
        </button>
        <h2 className="text-lg font-bold">Scan QR Code</h2>
        <div className="w-12" />
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <div id={qrRegionId} className="w-64 h-64 relative" />

        <p className="mt-4 text-gray-300">
          Align QR code or barcode within frame to scan
        </p>
      </div>
    </div>
  );
}
