import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { CalculationState, CalculationResults } from '../types';
import { MODEL_NAME, CURRENCY_FORMATTER, USD_FORMATTER } from '../constants';

interface GeminiAdvisorProps {
  inputs: CalculationState;
  results: CalculationResults;
}

export const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ inputs, results }) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsight = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key not found");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        Act as a UK financial tax expert. Analyze the following Capital Gains Tax scenario involving a US Share Sale (Zero Cost Basis assumed):
        
        Input Data:
        - Shares Sold: ${inputs.quantity}
        - Sell Price (USD): ${USD_FORMATTER.format(inputs.sellPriceUSD)}
        - Exchange Rate: $${inputs.exchangeRate} per £1
        - Total Sale (USD): ${USD_FORMATTER.format(results.totalValueUSD)}
        - Ownership Split: ${inputs.splitPercentage}%
        - User's Gross Share (GBP): ${CURRENCY_FORMATTER.format(results.grossSaleValue)}
        - Selected Tax Rate: ${inputs.taxRate}%
        - Allowance Used: ${CURRENCY_FORMATTER.format(inputs.allowance)}
        
        Results:
        - Total Gain (GBP): ${CURRENCY_FORMATTER.format(results.totalGain)}
        - Taxable Gain: ${CURRENCY_FORMATTER.format(results.taxableGain)}
        - Estimated Tax Due: ${CURRENCY_FORMATTER.format(results.taxDue)}
        - Net Profit: ${CURRENCY_FORMATTER.format(results.netProfit)}

        Please provide a brief, friendly, and professional 3-bullet point summary of this scenario. 
        Focus on:
        1. The effect of the exchange rate on the final GBP value.
        2. The tax efficiency and rate (${inputs.taxRate}%).
        3. A specific tip (e.g., impact of currency fluctuations or holding in a US-denominated account).
        Keep it under 150 words.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });

      setAnalysis(response.text || "No analysis generated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate insight");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Sparkles size={120} />
      </div>
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-200">
          <Sparkles size={20} />
        </div>
        <h3 className="text-lg font-bold text-indigo-900">AI Financial Insights</h3>
      </div>

      <p className="text-indigo-700/80 mb-6 text-sm leading-relaxed max-w-2xl">
        Get an instant analysis of your potential tax liability and tips on how to optimize your position using the latest Gemini models.
      </p>

      {analysis ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
           <div className="prose prose-sm prose-indigo max-w-none text-slate-700">
            <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
           </div>
           <button 
             onClick={() => setAnalysis("")}
             className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
           >
             Clear Analysis
           </button>
        </div>
      ) : (
        <button
          onClick={generateInsight}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <MessageSquare size={18} />
              Analyze with Gemini
            </>
          )}
        </button>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
};