"use client";

import { useState } from "react";
import Header from "@/components/Header";
import DenominationSelector from "@/components/DenominationSelector";
import SerialInput from "@/components/SerialInput";
import ValidationResult from "@/components/ValidationResult";
import ReferenceGuide from "@/components/ReferenceGuide";
import ScanDialog from "@/components/ScanDialog";
import BlacklistRanges from "@/components/BlacklistRanges";
import { ValidationResult as ValidationResultType } from "@/lib/types";

export default function Home() {
  const [denomination, setDenomination] = useState<10 | 20 | 50>(10);
  const [validationResult, setValidationResult] = useState<ValidationResultType | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input and Scanning */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <DenominationSelector
              value={denomination}
              onChange={setDenomination}
            />
            
            <SerialInput
              denomination={denomination}
              onValidation={setValidationResult}
              onOpenScanner={() => setShowScanner(true)}
            />

            {validationResult && (
              <ValidationResult result={validationResult} />
            )}

            <ReferenceGuide />
          </div>

          {/* Right Column: Ranges */}
          <div className="lg:col-span-5">
            <BlacklistRanges selectedDenomination={denomination} />
          </div>
        </div>
        {/* Validation Tips / Info Section */}
<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex gap-4 items-start">
<span className="material-symbols-outlined text-primary">verified_user</span>
<div>
<h5 className="text-sm font-bold text-primary">Base de Datos Actualizada</h5>
<p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Sincronizado hace 2 minutos con el Banco Central.</p>
</div>
</div>
<div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex gap-4 items-start">
<span className="material-symbols-outlined text-primary">security</span>
<div>
<h5 className="text-sm font-bold text-primary">Algoritmo IA v4.2</h5>
<p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Análisis por visión artificial y comparación de patrones.</p>
</div>
</div>
<div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex gap-4 items-start">
<span className="material-symbols-outlined text-primary">history_edu</span>
<div>
<h5 className="text-sm font-bold text-primary">Registro Legal</h5>
<p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Todas las validaciones fallidas se reportan automáticamente.</p>
</div>
</div>
</div>
      </main>

      <ScanDialog
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        denomination={denomination}
        onValidation={setValidationResult}
      />
    </div>
  );
}
