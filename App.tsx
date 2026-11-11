import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  PoundSterling, 
  PieChart, 
  Briefcase, 
  Settings2,
  AlertTriangle,
  Info,
  Percent,
  CheckCircle2,
  RefreshCw,
  DollarSign,
  CalendarDays,
  Download,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts';
import { InputCard } from './components/InputCard';
import { GeminiAdvisor } from './components/GeminiAdvisor';
import { HMRCGuide } from './components/HMRCGuide';
import { calculateResults } from './utils/calculations';
import { downloadPDFSummary, downloadCSVSummary } from './utils/exportReport';
import { DEFAULT_VALUES, CURRENCY_FORMATTER, USD_FORMATTER, getRecentExchangeRates } from './constants';
import { CalculationState } from './types';

export default function App() {
  const [values, setValues] = useState<CalculationState>(DEFAULT_VALUES);

  const results = useMemo(() => calculateResults(values), [values]);
  const recentRates = useMemo(() => getRecentExchangeRates(), []);

  const updateValue = (key: keyof CalculationState) => (val: number) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const chartData = [
    { name: 'Net Profit', value: results.netProfit, fill: '#10b981' },
    { name: 'Tax Due', value: results.taxDue, fill: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Calculator size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              UK Share & CGT Calculator
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              <Info size={14} />
              <span>Tax Year 2024/25 Ready</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-600 pl-2.5 pr-1">
                <Download size={13} className="text-blue-600" />
                Download Summary:
              </span>
              <button
                type="button"
                onClick={() => downloadPDFSummary(values, results)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 hover:border-blue-200 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                title="Download PDF Computation Report"
              >
                <FileText size={13} className="text-red-500" />
                <span>PDF</span>
              </button>
              <button
                type="button"
                onClick={() => downloadCSVSummary(values, results)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-200 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                title="Download CSV Spreadsheet Summary"
              >
                <FileSpreadsheet size={13} className="text-emerald-600" />
                <span>CSV</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="text-blue-600" size={20} />
                <h2 className="text-lg font-bold text-slate-900">Transaction Details</h2>
              </div>
              
              <div className="space-y-4">
                <InputCard
                  label="Number of Shares"
                  value={values.quantity}
                  onChange={updateValue('quantity')}
                  prefix=""
                  step={1}
                  icon={<PieChart size={14} />}
                />
                
                <InputCard
                  label="Sell Price (USD)"
                  value={values.sellPriceUSD}
                  onChange={updateValue('sellPriceUSD')}
                  prefix="$"
                  icon={<DollarSign size={14} />}
                />

                {/* Exchange Rate Section */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                       <span className="text-slate-400"><RefreshCw size={14} /></span>
                       Exchange Rate
                     </div>
                     <span className="text-xs font-semibold text-slate-400">USD per £1</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="relative">
                      <select 
                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                        onChange={(e) => updateValue('exchangeRate')(parseFloat(e.target.value))}
                        value={recentRates.find(r => Math.abs(r.rate - values.exchangeRate) < 0.0001)?.rate || ""}
                      >
                        <option value="" disabled>Select from last 10 days...</option>
                        {recentRates.map((rate) => (
                          <option key={rate.date} value={rate.rate}>
                            {rate.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <CalendarDays size={14} />
                      </div>
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                        $
                      </span>
                      <input
                        type="number"
                        value={values.exchangeRate}
                        onChange={(e) => updateValue('exchangeRate')(parseFloat(e.target.value) || 0)}
                        step={0.0001}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-8 pr-4 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                   <InputCard
                    label="Ownership Split (%)"
                    value={values.splitPercentage}
                    onChange={updateValue('splitPercentage')}
                    prefix=""
                    step={1}
                    icon={<Percent size={14} />}
                   />
                   <div className="absolute top-[42px] right-4 text-slate-400 font-semibold pointer-events-none">%</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings2 className="text-emerald-600" size={20} />
                <h2 className="text-lg font-bold text-slate-900">Tax Settings</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-3">Tax Band</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setValues(prev => ({...prev, taxRate: 18}))}
                      className={`relative p-3 rounded-xl border transition-all ${
                        values.taxRate === 18 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'bg-slate-50 border-transparent hover:bg-slate-100'
                      }`}
                    >
                      {values.taxRate === 18 && (
                        <div className="absolute top-2 right-2 text-blue-600">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                      <div className={`text-lg font-bold mb-1 ${values.taxRate === 18 ? 'text-blue-700' : 'text-slate-700'}`}>18%</div>
                      <div className={`text-xs ${values.taxRate === 18 ? 'text-blue-600' : 'text-slate-500'}`}>Basic Rate</div>
                    </button>

                    <button
                      onClick={() => setValues(prev => ({...prev, taxRate: 24}))}
                      className={`relative p-3 rounded-xl border transition-all ${
                        values.taxRate === 24 
                          ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                          : 'bg-slate-50 border-transparent hover:bg-slate-100'
                      }`}
                    >
                      {values.taxRate === 24 && (
                        <div className="absolute top-2 right-2 text-indigo-600">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                      <div className={`text-lg font-bold mb-1 ${values.taxRate === 24 ? 'text-indigo-700' : 'text-slate-700'}`}>24%</div>
                      <div className={`text-xs ${values.taxRate === 24 ? 'text-indigo-600' : 'text-slate-500'}`}>Higher Rate</div>
                    </button>
                  </div>
                </div>

                <InputCard
                  label="CGT Allowance"
                  value={values.allowance}
                  onChange={updateValue('allowance')}
                  icon={<PoundSterling size={14} />}
                />
                
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-800 flex gap-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <p>
                    Default allowance is £3,000 for the 2024/25 tax year.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`rounded-xl p-6 border ${results.totalGain >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                <div className="text-sm font-medium text-slate-500 mb-1">Total Gain (GBP)</div>
                <div className={`text-2xl font-bold ${results.totalGain >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {CURRENCY_FORMATTER.format(results.totalGain)}
                </div>
                <div className={`text-xs mt-2 font-medium ${results.totalGain >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {results.totalGain >= 0 ? 'Profit realized' : 'Loss incurred'}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="text-sm font-medium text-slate-500 mb-1">Your Share (GBP)</div>
                <div className="text-2xl font-bold text-slate-900">
                  {CURRENCY_FORMATTER.format(results.grossSaleValue)}
                </div>
                <div className="text-xs mt-2 text-slate-400">
                  {USD_FORMATTER.format(results.totalValueUSD)} Total USD
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                 <div className="text-sm font-medium text-slate-500 mb-1">Taxable Amount</div>
                 <div className="text-2xl font-bold text-slate-900">
                   {CURRENCY_FORMATTER.format(results.taxableGain)}
                 </div>
                 <div className="text-xs mt-2 text-slate-400">
                   After £{values.allowance} Allowance
                 </div>
              </div>
            </div>

            {/* Tax Liability & Net Profit */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Estimated Outcome</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    values.taxRate === 24 ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    Based on {values.taxRate}% Rate
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => downloadPDFSummary(values, results)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <FileText size={14} />
                    <span>Download PDF Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadCSVSummary(values, results)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet size={14} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                 {/* Stats */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                          <TrendingDown size={20} />
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 font-medium">Tax Payable</div>
                          <div className="text-xl font-bold text-slate-900">{CURRENCY_FORMATTER.format(results.taxDue)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                          <TrendingUp size={20} />
                        </div>
                        <div>
                          <div className="text-sm text-emerald-800 font-medium">Net Profit</div>
                          <div className="text-2xl font-bold text-emerald-700">{CURRENCY_FORMATTER.format(results.netProfit)}</div>
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* Chart */}
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{fill: 'transparent'}}
                          formatter={(value: number) => CURRENCY_FORMATTER.format(value)}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                 </div>
              </div>
            </div>

            {/* HMRC Step-by-Step Documentation & Links */}
            <HMRCGuide inputs={values} results={results} />

            {/* AI Advisor */}
            <GeminiAdvisor inputs={values} results={results} />

          </div>
        </div>
      </main>
    </div>
  );
}