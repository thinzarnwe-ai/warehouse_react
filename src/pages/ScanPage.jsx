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
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Show hint if not scanned in 3 seconds
        hintTimeout = setTimeout(() => setShowHint(true), 3000);

        const barcodeDetector = new window.BarcodeDetector({
          formats: BARCODE_FORMATS,
        });

        detectionInterval = setInterval(async () => {
          if (!videoRef.current || scanned) return;
          try {
            const video = videoRef.current;
            // Crop the middle 1/3 of the frame (good for 1D barcodes)
            const cropY = video.videoHeight / 3;
            const cropHeight = video.videoHeight / 3;
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = cropHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(
              video,
              0, cropY, video.videoWidth, cropHeight, // src: x, y, w, h
              0, 0, video.videoWidth, cropHeight      // dest: x, y, w, h
            );

            const barcodes = await barcodeDetector.detect(canvas);
            if (barcodes.length > 0) {
              const scannedText = barcodes[0].rawValue;
              if (scannedText.startsWith(']C')) {
                scannedText = scannedText.slice(3);
              }
              setScanned(true);
              setShowHint(false);
              sessionStorage.setItem("scannedData", scannedText);
              sessionStorage.setItem("scanTarget", target ?? "");
              navigate(-1); // Go back
            }
          } catch (e) {
            // Ignore detection errors per frame
          }
        }, 200);
      } catch (e) {
        setError("Camera access error: " + e.message);
      }
    };

    startScanner();

    return () => {
      if (detectionInterval) clearInterval(detectionInterval);
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (hintTimeout) clearTimeout(hintTimeout);
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
        <div className="w-64 h-64 overflow-hidden rounded shadow bg-black flex items-center justify-center relative">
          {/* Show overlay for center scan area */}
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