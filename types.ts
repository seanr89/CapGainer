export interface CalculationState {
  quantity: number;
  sellPriceUSD: number;
  exchangeRate: number;
  splitPercentage: number;
  allowance: number;
  taxRate: 18 | 24;
}

export interface CalculationResults {
  totalBuyCost: number;
  grossSaleValue: number;
  netSaleValue: number;
  totalGain: number;
  taxableGain: number;
  taxDue: number;
  netProfit: number;
  totalValueUSD: number;
}

export interface AIResponse {
  text: string;
  loading: boolean;
  error: string | null;
}

export interface ExchangeRateOption {
  date: string;
  rate: number;
  label: string;
}