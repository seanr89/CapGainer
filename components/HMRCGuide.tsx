import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Building2,
  CalendarClock,
  Scale,
  Receipt,
  ArrowRight,
  ShieldAlert,
  BookOpen
} from 'lucide-react';
import { CalculationResults, CalculationState } from '../types';
import { CURRENCY_FORMATTER } from '../constants';

interface HMRCGuideProps {
  inputs: CalculationState;
  results: CalculationResults;
}

interface ResourceLink {
  title: string;
  url: string;
  code?: string;
}

interface GuideStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  keyAction: string;
  icon: React.ReactNode;
  links: ResourceLink[];
  checklist: string[];
}

const GUIDE_STEPS: GuideStep[] = [
  {
    id: 1,
    title: 'Gather Contract Notes & Foreign Exchange Records',
    subtitle: 'Step 1 • Evidence & Currency Conversion',
    description:
      'HMRC requires all Capital Gains calculations to be reported in Pound Sterling (GBP). When selling US-listed or USD-denominated shares, you must convert both acquisition costs and disposal proceeds into GBP using the spot exchange rate in force on the exact date of each transaction.',
    keyAction: 'Download official broker contract notes and record the spot GBP/USD exchange rate used.',
    icon: <Receipt size={20} className="text-blue-600" />,
    links: [
      {
        title: 'HMRC Foreign Exchange Rates & Spot Rate Guidance',
        url: 'https://www.gov.uk/government/collections/exchange-rates-for-customs-and-vat',
        code: 'HMRC FX'
      },
      {
        title: 'CG78310 - Foreign Currency: Computation of Gains',
        url: 'https://www.gov.uk/hmrc-internal-manuals/capital-gains-manual/cg78310',
        code: 'CG78310'
      },
      {
        title: 'Records You Need to Keep for Capital Gains Tax',
        url: 'https://www.gov.uk/capital-gains-tax/records',
        code: 'GOV.UK'
      }
    ],
    checklist: [
      'Broker disposal contract note showing trade date, quantity, and gross USD proceeds',
      'Acquisition records (vesting statements for RSUs/ESPP, grant documents, or purchase notes)',
      'Brokerage dealing fees, commissions, or stamp duty receipts (allowable deductions)',
      'Daily spot GBP/USD exchange rate record for the transaction date'
    ]
  },
  {
    id: 2,
    title: 'Apply Share Matching & Section 104 Pooling Rules',
    subtitle: 'Step 2 • Cost Basis Calculation',
    description:
      'If you acquired shares of the same class in the same company across multiple dates (such as recurring RSU vests or dividend reinvestments), HMRC requires you to match disposals in a strict statutory order: Same-Day acquisitions first, "Bed and Breakfast" acquisitions (within the following 30 days) second, and your Section 104 Holding Pool third.',
    keyAction: 'Complete the HMRC working sheet in Help Sheet HS284 to verify your pooled cost basis.',
    icon: <Scale size={20} className="text-indigo-600" />,
    links: [
      {
        title: 'Tax when you sell shares (Share Matching Rules)',
        url: 'https://www.gov.uk/tax-sell-shares',
        code: 'GOV.UK'
      },
      {
        title: 'HS284: Shares and Capital Gains Tax (Self Assessment Helpsheet)',
        url: 'https://www.gov.uk/government/publications/shares-and-capital-gains-tax-hs284-self-assessment-helpsheet',
        code: 'HS284'
      },
      {
        title: 'Employment Related Securities (RSUs, Share Options & ESPP)',
        url: 'https://www.gov.uk/tax-employee-share-schemes',
        code: 'ERS Guide'
      }
    ],
    checklist: [
      'Check if any shares were bought on the exact same day as the sale',
      'Check if you repurchased the same class of shares within 30 days after the sale',
      'Calculate average pooled cost per share using the Section 104 pool working sheet'
    ]
  },
  {
    id: 3,
    title: 'Verify Your Annual Exempt Amount & Tax Band',
    subtitle: 'Step 3 • Allowance & Rate Determination (18% vs 24%)',
    description:
      'For the 2024/25 tax year, the Capital Gains Tax Annual Exempt Amount (AEA) is £3,000 for individuals. Any net gains above your allowance are added to your total taxable income to determine whether they fall into the Basic Rate band (18% for shares following the Autumn Budget) or the Higher/Additional Rate band (24%).',
    keyAction: 'Confirm your remaining basic rate income tax band and apply any brought-forward capital losses.',
    icon: <FileText size={20} className="text-emerald-600" />,
    links: [
      {
        title: 'Capital Gains Tax Rates and Allowances (Official Tables)',
        url: 'https://www.gov.uk/capital-gains-tax/rates',
        code: 'CGT Rates'
      },
      {
        title: 'Capital Gains Tax Allowances (Annual Exempt Amount)',
        url: 'https://www.gov.uk/capital-gains-tax/allowances',
        code: 'AEA Guide'
      },
      {
        title: 'Using Capital Losses to Reduce Your Gain',
        url: 'https://www.gov.uk/capital-gains-tax/losses',
        code: 'Losses'
      }
    ],
    checklist: [
      'Deduct current tax year capital losses before applying the £3,000 Annual Exempt Amount',
      'Check if you have registered unused capital losses from previous tax years to offset gains above £3,000',
      'Verify whether your combined taxable income and taxable gain exceeds the £37,700 basic rate threshold'
    ]
  },
  {
    id: 4,
    title: 'Report and Pay HMRC (Real-Time Service or SA108)',
    subtitle: 'Step 4 • Official Filing & Deadlines',
    description:
      'You can report share gains immediately online using the HMRC "Real Time" Capital Gains Tax service (up to 31 December after the tax year ends) if you do not normally file a tax return, or include the supplementary Capital Gains Summary pages (Form SA108) with your annual Self Assessment return by 31 January.',
    keyAction: 'Submit your calculation with supporting PDF summary and pay any CGT due by 31 January following the tax year.',
    icon: <CalendarClock size={20} className="text-amber-600" />,
    links: [
      {
        title: 'Report and Pay Capital Gains Tax (Real-Time CGT Service)',
        url: 'https://www.gov.uk/report-and-pay-your-capital-gains-tax',
        code: 'Real-Time Portal'
      },
      {
        title: 'SA108: Capital Gains Summary Form & Official Notes',
        url: 'https://www.gov.uk/government/publications/self-assessment-capital-gains-summary-sa108',
        code: 'Form SA108'
      },
      {
        title: 'Pay your Self Assessment or Capital Gains Tax Bill',
        url: 'https://www.gov.uk/pay-capital-gains-tax',
        code: 'Payments'
      }
    ],
    checklist: [
      'Attach or retain your computation breakdown showing GBP proceeds, costs, and FX rates (required for SA108)',
      'Register for Self Assessment by 5 October following the end of the tax year (if not using Real-Time CGT)',
      'File online and settle any tax payable by 31 January following the end of the tax year'
    ]
  }
];

export const HMRCGuide: React.FC<HMRCGuideProps> = ({ inputs, results }) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const toggleChecklist = (key: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const totalChecklistCount = GUIDE_STEPS.reduce((acc, s) => acc + s.checklist.length, 0);
  const completedCount = Object.values(completedItems).filter(Boolean).length;

  // HMRC reporting threshold: Gain > Annual Exempt Amount (£3,000) OR Total Disposal Proceeds > £50,000 (if registered for Self Assessment)
  const exceedsAllowance = results.totalGain > inputs.allowance;
  const exceedsProceedsLimit = results.grossSaleValue > 50000;
  const reportingRequired = exceedsAllowance || exceedsProceedsLimit;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Banner */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-500/20 border border-blue-400/30 rounded-xl text-blue-300 shrink-0 mt-0.5">
              <Building2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">HMRC Reporting Steps & Official Documentation</h2>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  GOV.UK Guidance
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-1">
                Step-by-step compliance checklist and direct links to HMRC forms, manuals, and filing portals for share disposals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-xl shrink-0">
            <ClipboardCheck size={16} className="text-emerald-400" />
            <span className="text-xs font-medium text-slate-300">
              Checklist: <strong className="text-white">{completedCount}/{totalChecklistCount}</strong> completed
            </span>
          </div>
        </div>

        {/* Dynamic Status Callout based on current calculation */}
        <div
          className={`mt-5 p-3.5 rounded-xl border flex items-start gap-3 text-xs sm:text-sm ${
            reportingRequired
              ? 'bg-amber-500/10 border-amber-400/30 text-amber-100'
              : 'bg-emerald-500/10 border-emerald-400/30 text-emerald-100'
          }`}
        >
          <ShieldAlert
            size={18}
            className={`shrink-0 mt-0.5 ${reportingRequired ? 'text-amber-300' : 'text-emerald-300'}`}
          />
          <div>
            <span className="font-semibold">
              {exceedsAllowance
                ? `HMRC Reporting Required: Your estimated gain (${CURRENCY_FORMATTER.format(results.totalGain)}) exceeds your ${CURRENCY_FORMATTER.format(inputs.allowance)} allowance.`
                : exceedsProceedsLimit
                ? `Check Self Assessment Rules: Your gross proceeds (${CURRENCY_FORMATTER.format(results.grossSaleValue)}) exceed the £50,000 disposal reporting threshold.`
                : `Below Reporting Threshold: Your gain (${CURRENCY_FORMATTER.format(results.totalGain)}) is within your ${CURRENCY_FORMATTER.format(inputs.allowance)} allowance and proceeds are under £50,000.`}
            </span>{' '}
            <span className="text-slate-300">
              {reportingRequired
                ? 'Follow the 4 steps below to prepare your computation worksheet and submit via the Real-Time CGT Service or Form SA108.'
                : 'You generally do not need to report this gain to HMRC, though you should still retain your contract notes and FX records for at least 12 months after the Self Assessment deadline.'}
            </span>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="p-6 divide-y divide-slate-200 space-y-6">
        {GUIDE_STEPS.map((step, index) => (
          <div key={step.id} className={index === 0 ? '' : 'pt-6'}>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left side: Step info & Checklist */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {step.subtitle}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <BookOpen size={13} className="text-blue-600" />
                    Required Documentation & Action Items:
                  </div>
                  <div className="space-y-2">
                    {step.checklist.map((item, i) => {
                      const itemKey = `${step.id}-${i}`;
                      const isDone = !!completedItems[itemKey];
                      return (
                        <button
                          key={itemKey}
                          type="button"
                          onClick={() => toggleChecklist(itemKey)}
                          className="w-full text-left flex items-start gap-2.5 text-xs text-slate-700 hover:text-slate-900 group py-0.5"
                        >
                          {isDone ? (
                            <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Circle
                              size={15}
                              className="text-slate-300 group-hover:text-blue-500 shrink-0 mt-0.5 transition-colors"
                            />
                          )}
                          <span className={isDone ? 'line-through text-slate-400' : ''}>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right side: Official HMRC Links */}
              <div className="lg:w-80 shrink-0 flex flex-col justify-between bg-slate-50/70 rounded-xl p-4 border border-slate-200/80">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Official HMRC Links</span>
                    <ExternalLink size={12} className="text-slate-400" />
                  </div>
                  <div className="space-y-2.5">
                    {step.links.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block p-2.5 bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">
                            {link.title}
                          </span>
                          <ArrowRight
                            size={14}
                            className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5"
                          />
                        </div>
                        {link.code && (
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                              {link.code}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate">gov.uk</span>
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[11px] text-slate-500">
                  <strong className="text-slate-700">Key Outcome:</strong> {step.keyAction}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
