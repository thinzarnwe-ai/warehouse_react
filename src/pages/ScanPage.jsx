import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BARCODE_FORMATS = [
  "qr_code",
  "ean_13",
  "ean_8",
  "code_128",
  "code_39",
  "upc_a",
  "upc_e",
];

export default function ScanPage() {
  const { target } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [scanned, setScanned] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    let stream = null;
    let detectionInterval = null;

    const startScanner = async () => {
      if (!("BarcodeDetector" in window)) {
        setError("Barcode Detection API is not supported in this browser.");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const barcodeDetector = new window.BarcodeDetector({
          formats: BARCODE_FORMATS,
        });

        detectionInterval = setInterval(async () => {
          if (!videoRef.current || scanned) return;
          try {
            const video = videoRef.current;
            // Draw video frame to canvas
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const barcodes = await barcodeDetector.detect(canvas);
            if (barcodes.length > 0) {
              const scannedText = barcodes[0].rawValue;
              setScanned(true);
              sessionStorage.setItem("scannedData", scannedText);
              sessionStorage.setItem("scanTarget", target ?? "");
              navigate(-1); // Go back
            }
          } catch (e) {
            // Ignore frame errors
          }
        }, 200);
      } catch (e) {
        setError("Camera access error: " + e.message);
      }
    };

    startScanner();

    return () => {
      if (detectionInterval) clearInterval(detectionInterval);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line
  }, [navigate, scanned, target]);

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
        <div className="w-64 h-64 overflow-hidden rounded shadow bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            playsInline
            muted
          />
        </div>
        {error && <p className="mt-2 text-red-400">{error}</p>}
        <p className="mt-4 text-gray-300">
          Align QR / barcode within the frame
        </p>
      </div>
    </div>
  );
}
