"use client";

import { useRef, useState, useEffect } from "react";
import { X, Camera, RotateCcw, CheckCircle } from "lucide-react";
import { extractSerialFromImage } from "@/lib/ocr";
import { checkBlacklist } from "@/lib/validation";
import { saveToHistory } from "@/lib/storage";
import { ValidationResult } from "@/lib/types";

interface ScanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  denomination: 10 | 20 | 50;
  onValidation: (result: ValidationResult) => void;
}

type ScanStep = "camera" | "processing" | "review";

export default function ScanDialog({
  isOpen,
  onClose,
  denomination,
  onValidation,
}: ScanDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [step, setStep] = useState<ScanStep>("camera");
  const [detectedSerial, setDetectedSerial] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen && step === "camera") {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, step]);

  const startCamera = async () => {
    try {
      setError("");
      
      // Verificar si la API está disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError(
          "Tu navegador no soporta acceso a la cámara. Usa Chrome, Firefox o Safari actualizado."
        );
        return;
      }

      // Verificar si estamos en HTTPS o localhost
      const isSecure = window.location.protocol === 'https:' || 
                       window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1';
      
      if (!isSecure) {
        setError(
          "La cámara solo funciona en conexiones seguras (HTTPS). Por favor, accede a través de HTTPS."
        );
        return;
      }

      let mediaStream: MediaStream | null = null;

      // Intentar primero con cámara trasera (móviles)
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
      } catch (err) {
        console.log("No se pudo acceder a cámara trasera, intentando con cualquier cámara...");
        // Si falla, intentar con cualquier cámara disponible
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
      }

      setStream(mediaStream);
      if (videoRef.current && mediaStream) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      
      // Mensajes de error más específicos
      let errorMessage = "No se pudo acceder a la cámara.";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage = "Permiso de cámara denegado. Por favor, permite el acceso a la cámara en la configuración de tu navegador.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMessage = "No se encontró ninguna cámara en tu dispositivo.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage = "La cámara está siendo usada por otra aplicación. Cierra otras aplicaciones y vuelve a intentar.";
      } else if (err.name === "OverconstrainedError") {
        errorMessage = "La configuración de la cámara no es compatible. Intenta con otra cámara.";
      } else if (err.name === "SecurityError") {
        errorMessage = "Error de seguridad. Asegúrate de estar usando HTTPS o localhost.";
      }
      
      setError(errorMessage + " Error: " + err.name);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageDataUrl);
    processImage(imageDataUrl);
  };

  const processImage = async (imageDataUrl: string) => {
    setStep("processing");
    setIsProcessing(true);
    setProgress(0);
    setError("");

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const serial = await extractSerialFromImage(imageDataUrl);
      clearInterval(progressInterval);
      setProgress(100);
      setDetectedSerial(serial);
      setStep("review");
    } catch (err) {
      clearInterval(progressInterval);
      console.error("OCR processing error:", err);
      setError(
        "No se pudo detectar el número de serie. Por favor, intenta tomar otra foto con mejor iluminación."
      );
      setStep("camera");
      setCapturedImage(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleValidate = () => {
    const result = checkBlacklist(detectedSerial, denomination);
    onValidation(result);

    // Save to history
    saveToHistory({
      serial: result.serial,
      denomination: result.denomination,
      isValid: result.isValid,
      reason: result.reason,
      timestamp: result.timestamp,
    });

    handleClose();
  };

  const handleRetry = () => {
    setCapturedImage(null);
    setDetectedSerial("");
    setStep("camera");
    setError("");
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setDetectedSerial("");
    setStep("camera");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold">Escanear Billete</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
              {error}
            </div>
          )}

          {step === "camera" && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Overlay guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-4 border-white/50 rounded-lg w-3/4 h-3/4 flex items-center justify-center">
                    <p className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">
                      Alinea el número de serie aquí
                    </p>
                  </div>
                </div>
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <button
                onClick={captureImage}
                disabled={!stream}
                className="w-full py-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Camera className="h-5 w-5" />
                Capturar Foto
              </button>
              <p className="text-xs text-center text-slate-500">
                Asegúrate de que el número de serie esté visible y enfocado
              </p>
            </div>
          )}

          {step === "processing" && (
            <div className="space-y-4 py-8">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">Procesando imagen...</p>
                <p className="text-sm text-slate-500">
                  Extrayendo número de serie con OCR
                </p>
                <div className="w-full max-w-xs mx-auto">
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{progress}%</p>
                </div>
              </div>
            </div>
          )}

          {step === "review" && capturedImage && (
            <div className="space-y-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <img
                  src={capturedImage}
                  alt="Captured bill"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                    Número de serie detectado:
                  </p>
                </div>
                <input
                  type="text"
                  value={detectedSerial}
                  onChange={(e) => setDetectedSerial(e.target.value.toUpperCase())}
                  className="w-full text-2xl font-mono font-bold text-green-700 dark:text-green-300 bg-white dark:bg-slate-800 border-2 border-green-300 dark:border-green-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="295095770 A"
                  maxLength={11}
                />
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  💡 Puedes editar el número si es necesario
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Denominación: {denomination} Bs
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 py-3 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reintentar
                </button>
                <button
                  onClick={handleValidate}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Validar Billete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
