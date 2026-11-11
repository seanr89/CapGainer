import { CalculationState, ExchangeRateOption } from './types';

export const DEFAULT_VALUES: CalculationState = {
  quantity: 1000,
  sellPriceUSD: 65.00, // Example USD price
  exchangeRate: 1.2742, // Default recent rate
  splitPercentage: 100,
  allowance: 3000,
  taxRate: 24, // Default to higher rate
};

export const MODEL_NAME = 'gemini-3-flash-preview';

export const CURRENCY_FORMATTER = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const NUMBER_FORMATTER = new Intl.NumberFormat('en-GB', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const getRecentExchangeRates = (): ExchangeRateOption[] => {
  const rates: ExchangeRateOption[] = [];
  const today = new Date();
  // Simulating a realistic trend around 1.27
  const baseRate = 1.27; 
  
  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Create a deterministic pseudo-random fluctuation based on the date
    const seed = date.getDate() + date.getMonth();
    const fluctuation = Math.sin(seed) * 0.015;
    const rate = Number((baseRate + fluctuation).toFixed(4));
    
    const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    
    rates.push({
      date: dateStr,
      rate: rate,
      label: `${dateStr} - $${rate}`
    });
  }
  return rates;
};