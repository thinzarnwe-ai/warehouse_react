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
  const [showHint, setShowHint] = useState(false);
  const videoRef = useRef(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    let stream = null;
    let detectionInterval = null;
    let hintTimeout = null;

    const startScanner = async () => {
      if (!("BarcodeDetector" in window)) {
        setError("Barcode Detection API is not supported in this browser.");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: 1920, height: 1080 },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        hintTimeout = setTimeout(() => setShowHint(true), 3000);

        const barcodeDetector = new window.BarcodeDetector({ formats: BARCODE_FORMATS });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const detectFrame = async () => {
          if (!videoRef.current || scannedRef.current) return;

          try {
            const video = videoRef.current;
            const cropY = video.videoHeight / 3;
            const cropHeight = video.videoHeight / 3;
            canvas.width = video.videoWidth;
            canvas.height = cropHeight;
            ctx.drawImage(video, 0, cropY, video.videoWidth, cropHeight, 0, 0, video.videoWidth, cropHeight);

            const barcodes = await barcodeDetector.detect(canvas);
            if (barcodes.length > 0 && !scannedRef.current) {
              scannedRef.current = true;
              setScanned(true);
              setShowHint(false);

              let scannedText = barcodes[0].rawValue;
              if (scannedText.startsWith("]C")) scannedText = scannedText.slice(3);

              sessionStorage.setItem("scanData", scannedText);
              sessionStorage.setItem("scanKeyword", target ?? "");

              if (navigator.vibrate) navigator.vibrate(100);
              setTimeout(() => navigate(-1), 100);
            }
          } catch {}
        };

        detectionInterval = setInterval(detectFrame, 350);
      } catch (e) {
        setError("Camera access error: " + e.message);
      }
    };

    startScanner();

    return () => {
      if (detectionInterval) clearInterval(detectionInterval);
      if (hintTimeout) clearTimeout(hintTimeout);
      if (stream) {
        try {
          stream.getTracks().forEach((track) => track.stop());
        } catch {}
      }
    };
  }, [navigate, target]);

  useEffect(() => {
    scannedRef.current = scanned;
  }, [scanned]);

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
        <div className="w-64 h-64 overflow-hidden rounded shadow bg-black flex items-center justify-center relative">
          <video
            ref={videoRef}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            playsInline
            muted
          />
          <div
            style={{
              position: "absolute",
              top: "33.3%",
              left: 0,
              width: "100%",
              height: "33.4%",
              border: "2px dashed #42c8f4",
              borderRadius: "8px",
              pointerEvents: "none",
            }}
          />
        </div>

        {error && <p className="mt-2 text-red-400">{error}</p>}
        <p className="mt-4 text-gray-300">
          ဘောင်အတွင်း ဘားကုဒ် သို့မဟုတ် QR ကုဒ်ကို ချိန်ညှိပါ။
        </p>
        {showHint && !scanned && (
          <p className="mt-2 text-yellow-400 text-center">
            အကြံပြုချက်- သင့်ဖုန်းကို သေချာစွာ ကိုင်ထားပါ၊ ဘားကုဒ်သည် ပြတ်သားပြီး အလင်းရောင်ကောင်းမွန်သော နေရာတွင်ထားပါ။
          </p>
        )}
      </div>
    </div>
  );
}
