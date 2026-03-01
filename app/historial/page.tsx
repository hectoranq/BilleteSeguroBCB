"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Header from "@/components/Header";
import {
  getHistory,
  clearHistory,
  exportHistoryToCSV,
} from "@/lib/storage";
import { HistoryEntry } from "@/lib/types";
import {
  Trash2,
  FileDown,
  Search,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";

export default function HistorialPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "valid" | "invalid">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setHistory(getHistory());
  };

  const handleClearHistory = () => {
    if (
      confirm(
        "¿Estás seguro de que deseas eliminar todo el historial de validaciones?"
      )
    ) {
      clearHistory();
      loadHistory();
    }
  };

  const handleExport = () => {
    const csv = exportHistoryToCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `historial-billetes-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredHistory = history.filter((entry) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "valid" && entry.isValid) ||
      (filter === "invalid" && !entry.isValid);

    const matchesSearch =
      searchTerm === "" ||
      entry.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.denomination.toString().includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="max-w-6xl mx-auto p-6 lg:p-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Historial de Validaciones</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Listado completo de todas las validaciones realizadas
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por número de serie o denominación..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:border-primary focus:ring-0 focus:outline-none"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === "all"
                    ? "bg-primary text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Todos ({history.length})
              </button>
              <button
                onClick={() => setFilter("valid")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === "valid"
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Válidos ({history.filter((e) => e.isValid).length})
              </button>
              <button
                onClick={() => setFilter("invalid")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === "invalid"
                    ? "bg-red-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                No Válidos ({history.filter((e) => !e.isValid).length})
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                disabled={history.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Exportar
              </button>
              <button
                onClick={handleClearHistory}
                disabled={history.length === 0}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-slate-400 dark:text-slate-600 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No hay resultados
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm || filter !== "all"
                ? "No se encontraron validaciones que coincidan con los filtros aplicados"
                : "Aún no has realizado ninguna validación de billetes"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((entry) => (
              <div
                key={entry.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 p-2 rounded-full ${
                      entry.isValid
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}
                  >
                    {entry.isValid ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <span className="font-mono text-lg font-semibold text-slate-700 dark:text-slate-300">
                          {entry.serial}
                        </span>
                        <span className="ml-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm font-medium text-slate-600 dark:text-slate-400">
                          {entry.denomination} Bs
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          entry.isValid
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {entry.isValid ? "Válido" : "No Válido"}
                      </span>
                    </div>
                    {entry.reason && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {entry.reason}
                      </p>
                    )}
                    <p className="text-xs text-slate-500">
                      {format(new Date(entry.timestamp), "PPp", { locale: es })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
