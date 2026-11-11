import { CalculationState, CalculationResults } from '../types';

export const calculateResults = (values: CalculationState): CalculationResults => {
  const { quantity, sellPriceUSD, exchangeRate, splitPercentage, allowance, taxRate } = values;

  // 1. Calculate Total Value in USD
  const totalValueUSD = quantity * sellPriceUSD;

  // 2. Convert Total USD Value to GBP
  // Rate is USD per £1 (e.g., 1.27), so GBP = USD / Rate
  // Avoid division by zero
  const safeRate = exchangeRate === 0 ? 1 : exchangeRate;
  const totalValueGBP = totalValueUSD / safeRate;

  // 3. Calculate the user's share of the total GBP value
  const grossSaleValue = totalValueGBP * (splitPercentage / 100);
  
  // No disposal costs
  const netSaleValue = grossSaleValue;
  
  // Total cost is 0 as Buy Price and Acquisition Costs are removed
  const totalBuyCost = 0; 
  
  const totalGain = netSaleValue - totalBuyCost;
  
  // Taxable gain cannot be less than 0 for tax purposes
  const taxableGain = Math.max(0, totalGain - allowance);

  const taxDue = taxableGain * (taxRate / 100);
  const netProfit = totalGain - taxDue;

  return {
    totalBuyCost,
    grossSaleValue, // In GBP
    netSaleValue,   // In GBP
    totalGain,      // In GBP
    taxableGain,
    taxDue,
    netProfit,
    totalValueUSD
  };
};