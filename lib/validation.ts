import invalidBillsData from "./data/billetes-invalidos.json";
import { ValidationResult, InvalidBillsData } from "./types";

const INVALID_BILLS: InvalidBillsData = invalidBillsData as InvalidBillsData;

/**
 * Validates the format of a serial number based on denomination
 * Format: 9 digits followed by space and class letter (e.g., 295095770 A)
 */
export function validateSerialFormat(serial: string, denomination: number): boolean {
  if (!serial) return false;
  
  // Format: 9 digits + space + class (A or B)
  const formatRegex = /^\d{9}\s[AB]$/;
  
  return formatRegex.test(serial.trim().toUpperCase());
}

/**
 * Parses a serial number into numeric part and class
 */
export function parseSerial(serial: string): { number: number; class: string } | null {
  const cleanSerial = serial.trim().toUpperCase();
  const match = cleanSerial.match(/^(\d{9})\s([AB])$/);
  
  if (!match) return null;
  
  return {
    number: parseInt(match[1], 10),
    class: match[2],
  };
}

/**
 * Checks if a bill serial number is in the blacklist
 */
export function checkBlacklist(
  serial: string,
  denomination: 10 | 20 | 50
): ValidationResult {
  const cleanSerial = serial.trim().toUpperCase();
  const timestamp = new Date();

  // Validate format first
  if (!validateSerialFormat(cleanSerial, denomination)) {
    return {
      isValid: false,
      serial: cleanSerial,
      denomination,
      reason: "Formato de número de serie inválido. Debe ser 9 dígitos + espacio + clase (A o B).",
      timestamp,
    };
  }

  // Parse the serial number
  const parsed = parseSerial(cleanSerial);
  if (!parsed) {
    return {
      isValid: false,
      serial: cleanSerial,
      denomination,
      reason: "No se pudo procesar el número de serie.",
      timestamp,
    };
  }

  const { number, class: billClass } = parsed;

  // Los billetes de clase A son siempre válidos
  if (billClass === 'A') {
    return {
      isValid: true,
      serial: cleanSerial,
      denomination,
      reason: "Billete clase A - válido.",
      timestamp,
    };
  }

  // Solo validar rangos para billetes de clase B
  const denominationData = INVALID_BILLS[denomination];

  // Check if in specific series list
  if (
    denominationData.series_especificas &&
    denominationData.series_especificas.includes(cleanSerial)
  ) {
    return {
      isValid: false,
      serial: cleanSerial,
      denomination,
      reason: "Este billete está en la lista negra (serie específica).",
      timestamp,
    };
  }

  // Check if in any range
  for (const range of denominationData.rangos) {
    if (number >= range.inicio && number <= range.fin) {
      return {
        isValid: false,
        serial: cleanSerial,
        denomination,
        reason: `Este billete está en el rango inhabilitado: ${range.inicio.toLocaleString('es-BO')} - ${range.fin.toLocaleString('es-BO')}`,
        matchedRange: range,
        timestamp,
      };
    }
  }

  // Valid bill
  return {
    isValid: true,
    serial: cleanSerial,
    denomination,
    reason: "El billete es válido y no está en la lista negra.",
    timestamp,
  };
}

/**
 * Gets all blacklist ranges for a specific denomination
 */
export function getBlacklistRanges(denomination: 10 | 20 | 50) {
  return INVALID_BILLS[denomination];
}

/**
 * Gets statistics about blacklisted bills
 */
export function getBlacklistStatistics() {
  const stats = {
    10: { ranges: 0, totalBills: 0 },
    20: { ranges: 0, totalBills: 0 },
    50: { ranges: 0, totalBills: 0 },
  };

  ([10, 20, 50] as const).forEach((denom) => {
    const data = INVALID_BILLS[denom];
    stats[denom].ranges = data.rangos.length;
    stats[denom].totalBills = data.rangos.reduce(
      (sum, range) => sum + (range.fin - range.inicio + 1),
      0
    );
  });

  return stats;
}
