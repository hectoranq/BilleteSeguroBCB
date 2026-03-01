"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { getStatistics } from "@/lib/storage";
import { getBlacklistStatistics } from "@/lib/validation";
import { Statistics } from "@/lib/types";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Database,
} from "lucide-react";

export default function EstadisticasPage() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [blacklistStats, setBlacklistStats] = useState<any>(null);

  useEffect(() => {
    setStats(getStatistics());
    setBlacklistStats(getBlacklistStatistics());
  }, []);

  if (!stats || !blacklistStats) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header />
        <main className="max-w-6xl mx-auto p-6 lg:p-10">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        </main>
      </div>
    );
  }

  const validPercentage =
    stats.totalValidations > 0
      ? (stats.validCount / stats.totalValidations) * 100
      : 0;
  const invalidPercentage =
    stats.totalValidations > 0
      ? (stats.invalidCount / stats.totalValidations) * 100
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="max-w-6xl mx-auto p-6 lg:p-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Estadísticas y Reportes</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Análisis de validaciones y rangos de billetes inhabilitados
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Total Validaciones
            </h3>
            <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">
              {stats.totalValidations.toLocaleString('es-BO')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Billetes Válidos
            </h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.validCount.toLocaleString('es-BO')}
              </p>
              <p className="text-sm text-slate-500">
                ({validPercentage.toFixed(1)}%)
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Billetes No Válidos
            </h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.invalidCount.toLocaleString('es-BO')}
              </p>
              <p className="text-sm text-slate-500">
                ({invalidPercentage.toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Validations by Denomination */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">
                Validaciones por Denominación
              </h3>
            </div>
            <div className="space-y-4">
              {([10, 20, 50] as const).map((denom) => {
                const denomStats = stats.byDenomination[denom];
                const maxTotal = Math.max(
                  ...([10, 20, 50] as const).map(
                    (d) => stats.byDenomination[d].total
                  )
                );
                const percentage =
                  maxTotal > 0 ? (denomStats.total / maxTotal) * 100 : 0;

                return (
                  <div key={denom}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{denom} Bs</span>
                      <span className="text-sm text-slate-500">
                        {denomStats.total} validaciones
                      </span>
                    </div>
                    <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/70 flex items-center px-3"
                        style={{ width: `${percentage}%` }}
                      >
                        {denomStats.total > 0 && (
                          <div className="flex gap-3 text-xs text-white font-medium">
                            <span>
                              ✓ {denomStats.valid}
                            </span>
                            <span>
                              ✗ {denomStats.invalid}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Blacklist Statistics */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">
                Estadísticas de Lista Negra
              </h3>
            </div>
            <div className="space-y-4">
              {([10, 20, 50] as const).map((denom) => {
                const stats = blacklistStats[denom];
                return (
                  <div
                    key={denom}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-red-800 dark:text-red-200">
                        {denom} Bs
                      </span>
                      <span className="px-2 py-0.5 bg-red-200 dark:bg-red-900 rounded text-xs font-medium text-red-800 dark:text-red-200">
                        {stats.ranges} rangos
                      </span>
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      Total billetes inhabilitados:{" "}
                      <span className="font-bold">
                        {stats.totalBills.toLocaleString('es-BO')}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Total billetes inhabilitados:
                </span>
                <span className="text-xl font-bold text-red-600 dark:text-red-400">
                  {Object.values(blacklistStats)
                    .reduce((sum: number, stat: any) => sum + stat.totalBills, 0)
                    .toLocaleString('es-BO')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-6 rounded-xl border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Sistema de Validación BCB
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Este sistema valida billetes contra los rangos de series
                inhabilitadas del Banco Central de Bolivia. Las estadísticas se
                actualizan en tiempo real basándose en las validaciones realizadas.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Última actualización:</span>
                  <span className="ml-2 font-semibold">
                    {new Date().toLocaleDateString("es-BO")}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Rangos activos:</span>
                  <span className="ml-2 font-semibold">
                    {Object.values(blacklistStats).reduce(
                      (sum: number, stat: any) => sum + stat.ranges,
                      0
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
