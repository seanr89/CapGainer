import { jsPDF } from 'jspdf';
import { CalculationState, CalculationResults } from '../types';
import { CURRENCY_FORMATTER, USD_FORMATTER, NUMBER_FORMATTER } from '../constants';

export const downloadCSVSummary = (
  inputs: CalculationState,
  results: CalculationResults
): void => {
  const generatedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const rows: [string, string][] = [
    ['Report Title', 'UK Share & Capital Gains Tax Computation Summary'],
    ['Date Generated', generatedDate],
    ['Tax Year', '2024/25'],
    ['', ''],
    ['--- TRANSACTION INPUTS ---', ''],
    ['Number of Shares', inputs.quantity.toString()],
    ['Sell Price (USD)', USD_FORMATTER.format(inputs.sellPriceUSD)],
    ['Exchange Rate (USD per £1 GBP)', `$${inputs.exchangeRate.toFixed(4)}`],
    ['Ownership Split (%)', `${inputs.splitPercentage}%`],
    ['CGT Annual Exempt Amount (GBP)', CURRENCY_FORMATTER.format(inputs.allowance)],
    ['Selected CGT Rate Band (%)', `${inputs.taxRate}% (${inputs.taxRate === 18 ? 'Basic Rate' : 'Higher Rate'})`],
    ['', ''],
    ['--- CALCULATION BREAKDOWN & PROFIT METRICS ---', ''],
    ['Total Disposal Value (USD)', USD_FORMATTER.format(results.totalValueUSD)],
    ['Your Gross Share Proceeds (GBP)', CURRENCY_FORMATTER.format(results.grossSaleValue)],
    ['Acquisition / Base Cost (GBP)', CURRENCY_FORMATTER.format(results.totalBuyCost)],
    ['Total Capital Gain (GBP)', CURRENCY_FORMATTER.format(results.totalGain)],
    ['Less CGT Annual Allowance (GBP)', CURRENCY_FORMATTER.format(Math.min(results.totalGain, inputs.allowance))],
    ['Taxable Gain (GBP)', CURRENCY_FORMATTER.format(results.taxableGain)],
    [`Estimated Capital Gains Tax Due (${inputs.taxRate}%) (GBP)`, CURRENCY_FORMATTER.format(results.taxDue)],
    ['Estimated Net Profit After Tax (GBP)', CURRENCY_FORMATTER.format(results.netProfit)],
    [
      'Effective Tax Rate on Total Gain (%)',
      results.totalGain > 0 ? `${((results.taxDue / results.totalGain) * 100).toFixed(2)}%` : '0.00%',
    ],
  ];

  const escapeCsvCell = (cell: string) => {
    const cleaned = cell.replace(/"/g, '""');
    return `"${cleaned}"`;
  };

  const csvContent =
    'Metric,Value\n' +
    rows.map(([metric, val]) => `${escapeCsvCell(metric)},${escapeCsvCell(val)}`).join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStamp = new Date().toISOString().split('T')[0];
  link.href = url;
  link.setAttribute('download', `uk-cgt-summary-${dateStamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadPDFSummary = (
  inputs: CalculationState,
  results: CalculationResults
): void => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const generatedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Top Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('UK Share & Capital Gains Tax Summary', 16, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Tax Year 2024/25 Computation Sheet • Generated on ${generatedDate}`, 16, 26);

  let y = 48;

  // Helper to draw section header
  const drawSectionHeader = (title: string, currentY: number): number => {
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(16, currentY, pageWidth - 32, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text(title.toUpperCase(), 20, currentY + 6);
    return currentY + 14;
  };

  // Helper to draw key-value row
  const drawRow = (
    label: string,
    value: string,
    currentY: number,
    options?: { bold?: boolean; highlightColor?: [number, number, number] }
  ): number => {
    doc.setFont('helvetica', options?.bold ? 'bold' : 'normal');
    doc.setFontSize(10.5);
    if (options?.highlightColor) {
      doc.setTextColor(...options.highlightColor);
    } else {
      doc.setTextColor(51, 65, 85); // slate-700
    }
    doc.text(label, 20, currentY);

    doc.setFont('helvetica', 'bold');
    doc.text(value, pageWidth - 20, currentY, { align: 'right' });

    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(16, currentY + 3, pageWidth - 16, currentY + 3);
    return currentY + 9.5;
  };

  // Section 1: Transaction Inputs & Settings
  y = drawSectionHeader('1. Transaction Details & Tax Settings', y);
  y = drawRow('Number of Shares Sold', NUMBER_FORMATTER.format(inputs.quantity), y);
  y = drawRow('Share Sale Price (USD)', USD_FORMATTER.format(inputs.sellPriceUSD), y);
  y = drawRow('Total Gross Sale Value (USD)', USD_FORMATTER.format(results.totalValueUSD), y);
  y = drawRow('Spot Exchange Rate Used (USD per £1 GBP)', `$${inputs.exchangeRate.toFixed(4)}`, y);
  y = drawRow('Beneficial Ownership Split', `${inputs.splitPercentage}%`, y);
  y = drawRow(
    'Selected UK CGT Rate Band',
    `${inputs.taxRate}% (${inputs.taxRate === 18 ? 'Basic Rate Band' : 'Higher / Additional Rate Band'})`,
    y
  );
  y = drawRow('Annual Exempt Amount (CGT Allowance)', CURRENCY_FORMATTER.format(inputs.allowance), y);

  y += 6;

  // Section 2: Capital Gains & Tax Computation
  y = drawSectionHeader('2. Capital Gains Tax Breakdown (GBP)', y);
  y = drawRow('Gross Disposal Proceeds (Your GBP Share)', CURRENCY_FORMATTER.format(results.grossSaleValue), y);
  y = drawRow('Allowable Acquisition / Base Cost', CURRENCY_FORMATTER.format(results.totalBuyCost), y);
  y = drawRow('Total Realized Capital Gain', CURRENCY_FORMATTER.format(results.totalGain), y, {
    bold: true,
  });
  y = drawRow(
    'Less: Annual Exempt Amount Applied',
    `- ${CURRENCY_FORMATTER.format(Math.min(Math.max(0, results.totalGain), inputs.allowance))}`,
    y
  );
  y = drawRow('Net Taxable Capital Gain', CURRENCY_FORMATTER.format(results.taxableGain), y, {
    bold: true,
  });

  y += 6;

  // Section 3: Final Profit & Tax Summary Highlight Box
  y = drawSectionHeader('3. Estimated Tax Payable & Net Profit Metrics', y);

  const effectiveRate =
    results.totalGain > 0 ? ((results.taxDue / results.totalGain) * 100).toFixed(2) : '0.00';

  y = drawRow(
    `Estimated Capital Gains Tax Payable (at ${inputs.taxRate}%)`,
    CURRENCY_FORMATTER.format(results.taxDue),
    y,
    { bold: true, highlightColor: [220, 38, 38] } // red-600
  );
  y = drawRow('Effective Tax Rate on Total Gain', `${effectiveRate}%`, y);
  y = drawRow('Estimated Net Profit Retained (After Tax)', CURRENCY_FORMATTER.format(results.netProfit), y, {
    bold: true,
    highlightColor: [5, 150, 105], // emerald-600
  });

  // HMRC Reporting Note Box
  y += 10;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(16, y, pageWidth - 32, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text('HMRC Self Assessment (SA108) & Real-Time CGT Filing Note:', 21, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const noteLines = doc.splitTextToSize(
    'HMRC requires Capital Gains Tax computations to be reported in GBP using the spot exchange rate on the transaction date. Retain this computation sheet alongside your broker disposal contract notes and vesting/acquisition statements when submitting via the HMRC Real-Time Capital Gains Tax service or Self Assessment supplementary form SA108.',
    pageWidth - 42
  );
  doc.text(noteLines, 21, y + 15);

  const dateStamp = new Date().toISOString().split('T')[0];
  doc.save(`uk-cgt-summary-${dateStamp}.pdf`);
};
