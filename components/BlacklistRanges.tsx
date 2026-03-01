"use client";

import { useState } from "react";
import { getBlacklistRanges } from "@/lib/validation";
import { AlertCircle, FileDown } from "lucide-react";

interface BlacklistRangesProps {
  selectedDenomination?: 10 | 20 | 50;
}

export default function BlacklistRanges({
  selectedDenomination = 10,
}: BlacklistRangesProps) {
  const [denomination, setDenomination] = useState<10 | 20 | 50>(
    selectedDenomination
  );

  const data = getBlacklistRanges(denomination);
  const totalBills = data.rangos.reduce(
    (sum, range) => sum + (range.fin - range.inicio + 1),
    0
  );

  const exportRanges = () => {
    const csv = [
      "Denominación,Inicio,Fin,Cantidad",
      ...data.rangos.map(
        (range) =>
          `${denomination} Bs,${range.inicio},${range.fin},${
            range.fin - range.inicio + 1
          }`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rangos-inhabilitados-${denomination}bs.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Rangos Inhabilitados
          </h3>
        </div>
        <button
          onClick={exportRanges}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Exportar rangos"
        >
          <FileDown className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Denomination Tabs */}
      <div className="flex gap-2 mb-4">
        {([10, 20, 50] as const).map((denom) => (
          <button
            key={denom}
            onClick={() => setDenomination(denom)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              denomination === denom
                ? "bg-primary text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {denom} Bs
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-red-800 dark:text-red-200">
            Total billetes inhabilitados:
          </span>
          <span className="text-lg font-bold text-red-600 dark:text-red-400">
            {totalBills.toLocaleString('es-BO')}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-red-700 dark:text-red-300">
            Rangos en lista:
          </span>
          <span className="text-sm font-semibold text-red-600 dark:text-red-400">
            {data.rangos.length}
          </span>
        </div>
      </div>

      {/* Ranges List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {data.rangos.map((range, index) => (
          <div
            key={index}
            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Rango #{index + 1}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {(range.fin - range.inicio + 1).toLocaleString('es-BO')} billetes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-slate-700 dark:text-slate-300">
                {range.inicio.toLocaleString('es-BO')}
              </span>
              <span className="text-slate-400">→</span>
              <span className="font-mono text-sm text-slate-700 dark:text-slate-300">
                {range.fin.toLocaleString('es-BO')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
