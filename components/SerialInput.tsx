"use client";

import { useState } from "react";
import { Camera, HelpCircle, Search } from "lucide-react";
import { checkBlacklist } from "@/lib/validation";
import { saveToHistory } from "@/lib/storage";
import { ValidationResult as ValidationResultType } from "@/lib/types";

interface SerialInputProps {
  denomination: 10 | 20 | 50;
  onValidation: (result: ValidationResultType) => void;
  onOpenScanner: () => void;
}

export default function SerialInput({
  denomination,
  onValidation,
  onOpenScanner,
}: SerialInputProps) {
  const [serial, setSerial] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const handleValidate = () => {
    if (!serial.trim()) return;

    // Agregar automáticamente " B" al final si es ingreso manual
    const serialWithClass = serial.trim() + " B";
    
    const result = checkBlacklist(serialWithClass, denomination);
    onValidation(result);

    // Save to history
    saveToHistory({
      serial: result.serial,
      denomination: result.denomination,
      isValid: result.isValid,
      reason: result.reason,
      timestamp: result.timestamp,
    });

    // Clear input
    setSerial("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleValidate();
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Ingreso Manual de Serie
        </label>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
        >
          <HelpCircle className="h-3 w-3" />
          ¿Dónde está el número de serie?
        </button>
      </div>

      {showHelp && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-200">
          El número de serie se encuentra en la parte superior derecha del billete.
          Formato: Solo 9 dígitos (ejemplo: 295095770). La clase B se asigna automáticamente.
        </div>
      )}

      <div className="mb-3 space-y-2 md:space-y-0">
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">
            barcode_scanner
          </span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={serial}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setSerial(value);
            }}
            onKeyPress={handleKeyPress}
            className="w-full pl-12 pr-4 md:pr-28 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-primary dark:focus:border-primary focus:ring-0 focus:outline-none transition-all text-lg font-mono tracking-widest"
            placeholder="Ej: 295095770"
            maxLength={9}
          />
          <button
            onClick={handleValidate}
            disabled={!serial.trim()}
            className="w-full md:w-auto md:absolute md:right-3 md:top-1/2 md:-translate-y-1/2 bg-primary text-white px-6 py-3 md:py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            Validar
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-slate-400">
          Ingrese solo los 9 dígitos del número de serie. Los billetes ingresados manualmente se validan como clase B.
        </p>
        <button
          onClick={onOpenScanner}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 text-base font-bold bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 rounded-xl transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transform hover:scale-[1.02]"
        >
          <Camera className="h-5 w-5" />
          Escanear con Cámara
        </button>
      </div>
    </section>
  );
}
