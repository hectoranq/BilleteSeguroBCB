"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { ValidationResult as ValidationResultType } from "@/lib/types";

interface ValidationResultProps {
  result: ValidationResultType;
}

export default function ValidationResult({ result }: ValidationResultProps) {
  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 p-3 rounded-full ${
            result.isValid
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-red-100 dark:bg-red-900/30"
          }`}
        >
          {result.isValid ? (
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3
                className={`text-2xl font-bold ${
                  result.isValid
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {result.isValid ? "✓ Billete Válido" : "✗ Billete No Válido"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-lg font-semibold text-slate-700 dark:text-slate-300">
                  {result.serial}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm font-medium text-slate-600 dark:text-slate-400">
                  {result.denomination} Bs
                </span>
              </div>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-400 mb-3">
            {result.reason}
          </p>

          {result.matchedRange && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Rango inhabilitado detectado:
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 font-mono">
                {result.matchedRange.inicio.toLocaleString('es-BO')} -{" "}
                {result.matchedRange.fin.toLocaleString('es-BO')}
              </p>
            </div>
          )}

          <div className="flex items-center gap-1 mt-3 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            <span>
              Verificado el{" "}
              {format(new Date(result.timestamp), "PPp", { locale: es })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
