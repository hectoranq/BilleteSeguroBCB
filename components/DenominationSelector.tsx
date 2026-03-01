"use client";

interface DenominationSelectorProps {
  value: 10 | 20 | 50;
  onChange: (value: 10 | 20 | 50) => void;
}

export default function DenominationSelector({
  value,
  onChange,
}: DenominationSelectorProps) {
  const denominations = [10, 20, 50] as const;

  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Seleccione Denominación
      </h3>
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl gap-1">
        {denominations.map((denom) => (
          <button
            key={denom}
            onClick={() => onChange(denom)}
            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
              value === denom
                ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <span className="material-symbols-outlined text-lg block">
              payments
            </span>
            {denom} Bs
          </button>
        ))}
      </div>
    </section>
  );
}
