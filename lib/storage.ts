import { HistoryEntry, Statistics } from "./types";

const HISTORY_KEY = "billetes_history";
const MAX_HISTORY_ITEMS = 100;

/**
 * Save a validation result to history
 */
export function saveToHistory(entry: Omit<HistoryEntry, "id">): void {
  if (typeof window === "undefined") return;

  const history = getHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };

  // Add to beginning of array
  history.unshift(newEntry);

  // Keep only the most recent items
  const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

/**
 * Get validation history
 */
export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    // Convert timestamp strings back to Date objects
    return parsed.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
}

/**
 * Clear all history
 */
export function clearHistory(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

/**
 * Get statistics from history
 */
export function getStatistics(): Statistics {
  const history = getHistory();

  const stats: Statistics = {
    totalValidations: history.length,
    validCount: 0,
    invalidCount: 0,
    byDenomination: {
      10: { total: 0, valid: 0, invalid: 0 },
      20: { total: 0, valid: 0, invalid: 0 },
      50: { total: 0, valid: 0, invalid: 0 },
    },
  };

  history.forEach((entry) => {
    if (entry.isValid) {
      stats.validCount++;
    } else {
      stats.invalidCount++;
    }

    const denomStats = stats.byDenomination[entry.denomination];
    if (denomStats) {
      denomStats.total++;
      if (entry.isValid) {
        denomStats.valid++;
      } else {
        denomStats.invalid++;
      }
    }
  });

  return stats;
}

/**
 * Export history to CSV format
 */
export function exportHistoryToCSV(): string {
  const history = getHistory();
  
  const headers = ["Fecha y Hora", "Número de Serie", "Denominación", "Estado", "Motivo"];
  const rows = history.map((entry) => [
    new Date(entry.timestamp).toLocaleString("es-BO"),
    entry.serial,
    `${entry.denomination} Bs`,
    entry.isValid ? "Válido" : "No Válido",
    entry.reason || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}
