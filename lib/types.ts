export interface InvalidBillRange {
  inicio: number;
  fin: number;
}

export interface DenominationBlacklist {
  rangos: InvalidBillRange[];
  series_especificas?: string[];
}

export interface InvalidBillsData {
  10: DenominationBlacklist;
  20: DenominationBlacklist;
  50: DenominationBlacklist;
}

export interface ValidationResult {
  isValid: boolean;
  serial: string;
  denomination: number;
  reason?: string;
  matchedRange?: InvalidBillRange;
  timestamp: Date;
}

export interface HistoryEntry {
  id: string;
  serial: string;
  denomination: number;
  isValid: boolean;
  reason?: string;
  timestamp: Date;
}

export interface Statistics {
  totalValidations: number;
  validCount: number;
  invalidCount: number;
  byDenomination: {
    [key: number]: {
      total: number;
      valid: number;
      invalid: number;
    };
  };
}
