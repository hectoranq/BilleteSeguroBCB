"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { History, Settings, Sun, Moon } from "lucide-react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 lg:px-20">
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="bg-primary p-2 rounded-lg text-white">
          <span className="material-symbols-outlined text-2xl">payments</span>
        </div>
        <div>
          <h2 className="text-xl font-bold leading-tight tracking-tight">
            Validador de Billetes
          </h2>
          
        </div>
      </Link>
      <div className="flex items-center gap-4">
        <Link
          href="/historial"
          className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Ver historial"
        >
          <History className="h-5 w-5" />
        </Link>
        <Link
          href="/estadisticas"
          className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Estadísticas"
        >
          <Settings className="h-5 w-5" />
        </Link>
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Cambiar tema"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}
