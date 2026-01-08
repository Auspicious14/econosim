'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  DollarSign, 
  Clock, 
  Target, 
  ArrowLeft, 
  ChevronRight,
  Info,
  ShieldCheck,
  Zap,
  Leaf
} from 'lucide-react';
import Image from 'next/image';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Scenario {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'policy' | 'investment';
  icon: React.ReactNode;
  color: string;
  parameters: ScenarioParameter[];
}

interface ScenarioParameter {
  name: string;
  label: string;
  type: 'number' | 'select';
  defaultValue: number | string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  suffix?: string;
}

interface SimulationResult {
  decisionSummary: string;
  economicPrinciples: string[];
  shortTermOutcome: Outcome;
  longTermOutcome: Outcome;
  keyInsight: string;
  calculations: CalculationDetail[];
}

interface Outcome {
  description: string;
  financialImpact: number;
  timeframe: string;
  factors: string[];
  type: 'positive' | 'negative' | 'neutral';
}

interface CalculationDetail {
  label: string;
  value: number;
  formatted: string;
  explanation: string;
}

// ============================================================================
// PREDEFINED SCENARIOS
// ============================================================================

const SCENARIOS: Scenario[] = [
  {
    id: 'phone-installment',
    title: 'Phone Purchase Strategy',
    description: 'Compare buying a flagship device on monthly installments versus paying full price upfront.',
    category: 'personal',
    icon: <DollarSign className="w-6 h-6" />,
    color: 'emerald',
    parameters: [
      { name: 'phonePrice', label: 'Phone Price', type: 'number', defaultValue: 850000, min: 100000, max: 3000000, suffix: '₦' },
      { name: 'installmentMonths', label: 'Installment Period', type: 'number', defaultValue: 12, min: 6, max: 24, suffix: 'months' },
      { name: 'interestRate', label: 'Monthly Interest Rate', type: 'number', defaultValue: 3.5, min: 0, max: 10, suffix: '%' },
      { name: 'investmentReturn', label: 'Alternative Investment Return', type: 'number', defaultValue: 15, min: 5, max: 30, suffix: '% p.a.' }
    ]
  },
  {
    id: 'food-delivery',
    title: 'The Delivery Dilemma',
    description: 'Analyze the long-term wealth impact of daily delivery habits versus home meal preparation.',
    category: 'personal',
    icon: <Zap className="w-6 h-6" />,
    color: 'violet',
    parameters: [
      { name: 'dailySpend', label: 'Average Delivery Spend', type: 'number', defaultValue: 5500, min: 1000, max: 15000, suffix: '₦' },
      { name: 'daysPerWeek', label: 'Days Per Week', type: 'number', defaultValue: 5, min: 1, max: 7, suffix: 'days' },
      { name: 'homeCookingCost', label: 'Home Cooking Cost/Day', type: 'number', defaultValue: 1800, min: 500, max: 8000, suffix: '₦' },
      { name: 'timeframe', label: 'Analysis Period', type: 'number', defaultValue: 36, min: 1, max: 120, suffix: 'months' }
    ]
  },
  {
    id: 'emergency-fund',
    title: 'The Safety Net Trade-off',
    description: 'Evaluate the opportunity cost of keeping liquid cash for emergencies versus high-yield investing.',
    category: 'investment',
    icon: <ShieldCheck className="w-6 h-6" />,
    color: 'blue',
    parameters: [
      { name: 'savingsAmount', label: 'Initial Savings', type: 'number', defaultValue: 2500000, min: 500000, max: 50000000, suffix: '₦' },
      { name: 'emergencyFundMonths', label: 'Emergency Fund Coverage', type: 'number', defaultValue: 6, min: 3, max: 12, suffix: 'months' },
      { name: 'monthlyExpenses', label: 'Monthly Living Expenses', type: 'number', defaultValue: 350000, min: 100000, max: 2000000, suffix: '₦' },
      { name: 'investmentReturn', label: 'Target Portfolio Return', type: 'number', defaultValue: 18, min: 5, max: 40, suffix: '% p.a.' }
    ]
  },
  // {
  //   id: 'minimum-wage',
  //   title: 'Minimum Wage Dynamics',
  //   description: 'Simulate the macroeconomic effects of raising minimum wage on employment and purchasing power.',
  //   category: 'policy',
  //   icon: <TrendingUp className="w-6 h-6" />,
  //   color: 'rose',
  //   parameters: [
  //     { name: 'currentWage', label: 'Current Base Wage', type: 'number', defaultValue: 70000, min: 30000, max: 150000, suffix: '₦' },
  //     { name: 'increasePercent', label: 'Proposed Increase', type: 'number', defaultValue: 50, min: 10, max: 200, suffix: '%' },
  //     { name: 'affectedWorkers', label: 'Target Workforce', type: 'number', defaultValue: 1000000, min: 100000, max: 10000000, suffix: 'people' },
  //     { name: 'employmentElasticity', label: 'Labor Demand Elasticity', type: 'number', defaultValue: -0.2, min: -1.0, max: 0, suffix: '' }
  //   ]
  // },
  // {
  //   id: 'student-loan',
  //   title: 'Education ROI Analysis',
  //   description: 'Compare taking a student loan for immediate study versus working to save for tuition later.',
  //   category: 'investment',
  //   icon: <Target className="w-6 h-6" />,
  //   color: 'amber',
  //   parameters: [
  //     { name: 'tuitionCost', label: 'Total Tuition', type: 'number', defaultValue: 4000000, min: 500000, max: 20000000, suffix: '₦' },
  //     { name: 'loanInterestRate', label: 'Loan Annual Interest', type: 'number', defaultValue: 12, min: 0, max: 25, suffix: '%' },
  //     { name: 'repaymentYears', label: 'Repayment Period', type: 'number', defaultValue: 10, min: 3, max: 20, suffix: 'years' },
  //     { name: 'workingSalary', label: 'Current Working Salary', type: 'number', defaultValue: 150000, min: 50000, max: 1000000, suffix: '₦/mo' }
  //   ]
  // }
];

// ============================================================================
// ECONOMIC CALCULATION ENGINE
// ============================================================================

class EconomicEngine {
  static compoundInterest(principal: number, rate: number, years: number, frequency: number = 12): number {
    const r = rate / 100;
    const n = frequency;
    const t = years;
    return principal * Math.pow(1 + r / n, n * t);
  }

  static loanPayment(principal: number, annualRate: number, months: number): number {
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) return principal / months;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  static opportunityCost(amount: number, returnRate: number, years: number): number {
    return this.compoundInterest(amount, returnRate, years) - amount;
  }
}

// ============================================================================
// SIMULATION LOGIC
// ============================================================================

function simulateScenario(scenarioId: string, params: Record<string, number>): SimulationResult {
  switch (scenarioId) {
    case 'phone-installment': return simulatePhoneInstallment(params);
    case 'food-delivery': return simulateFoodDelivery(params);
    case 'emergency-fund': return simulateEmergencyFund(params);
    case 'minimum-wage': return simulateMinimumWage(params);
    case 'student-loan': return simulateStudentLoan(params);
    default: throw new Error('Unknown scenario');
  }
}

function simulatePhoneInstallment(params: Record<string, number>): SimulationResult {
  const { phonePrice, installmentMonths, interestRate, investmentReturn } = params;
  
  // Use monthly interest rate from UI
  const annualInterestRate = interestRate * 12;
  const monthlyPayment = EconomicEngine.loanPayment(phonePrice, annualInterestRate, installmentMonths);
  const totalPaid = monthlyPayment * installmentMonths;
  const interestCost = totalPaid - phonePrice;
  const upfrontOpportunityCost = EconomicEngine.opportunityCost(phonePrice, investmentReturn, installmentMonths / 12);
  const investmentGrowth = EconomicEngine.compoundInterest(phonePrice, investmentReturn, installmentMonths / 12);

  return {
    decisionSummary: `Comparing a ₦${phonePrice.toLocaleString()} device purchase over ${installmentMonths} months at ${interestRate}% monthly interest vs. payment in full.`,
    economicPrinciples: ['Time Value of Money', 'Opportunity Cost', 'Liquidity Preference', 'Interest Compounding'],
    shortTermOutcome: {
      description: 'Preserved liquidity at the cost of higher recurring expenses and debt burden.',
      financialImpact: -monthlyPayment,
      timeframe: `Monthly for ${installmentMonths} months`,
      type: 'negative',
      factors: [
        `Fixed monthly liability: ₦${Math.round(monthlyPayment).toLocaleString()}`,
        `Immediate cash liquidity maintained: ₦${phonePrice.toLocaleString()}`,
        'Ability to satisfy other immediate high-priority needs'
      ]
    },
    longTermOutcome: {
      description: 'The "convenience tax" results in significant wealth erosion through interest and lost returns.',
      financialImpact: -(interestCost + upfrontOpportunityCost),
      timeframe: `After ${installmentMonths} months`,
      type: 'negative',
      factors: [
        `Premium paid over cash price: ₦${Math.round(interestCost).toLocaleString()}`,
        `Lost capital gains from upfront amount: ₦${Math.round(upfrontOpportunityCost).toLocaleString()}`,
        `Net wealth reduction: ₦${Math.round(interestCost + upfrontOpportunityCost).toLocaleString()}`
      ]
    },
    keyInsight: `While the monthly payment seems affordable, you're paying a ₦${Math.round(interestCost).toLocaleString()} premium for immediate ownership. If you invested that same upfront ₦${phonePrice.toLocaleString()} at ${investmentReturn}% instead, you'd end up with ₦${Math.round(investmentGrowth).toLocaleString()}. The true cost of this "convenience" is your future financial freedom.`,
    calculations: [
      { label: 'Monthly Payment', value: monthlyPayment, formatted: `₦${Math.round(monthlyPayment).toLocaleString()}`, explanation: 'Principal + Monthly Interest' },
      { label: 'Total Financing Cost', value: interestCost, formatted: `₦${Math.round(interestCost).toLocaleString()}`, explanation: 'Total paid minus actual device price' },
      { label: 'Opportunity Cost', value: upfrontOpportunityCost, formatted: `₦${Math.round(upfrontOpportunityCost).toLocaleString()}`, explanation: 'Gains lost by choosing debt over investment' }
    ]
  };
}

function simulateFoodDelivery(params: Record<string, number>): SimulationResult {
  const { dailySpend, daysPerWeek, homeCookingCost, timeframe } = params;
  
  const weeksInPeriod = (timeframe * 52) / 12;
  const totalDeliveryCost = dailySpend * daysPerWeek * weeksInPeriod;
  const totalHomeCookingCost = homeCookingCost * daysPerWeek * weeksInPeriod;
  const savings = totalDeliveryCost - totalHomeCookingCost;
  const yearsInPeriod = timeframe / 12;
  const monthlySavings = (dailySpend - homeCookingCost) * daysPerWeek * 4.33;
  const investedSavings = EconomicEngine.compoundInterest(monthlySavings, 12, yearsInPeriod, 12) * (timeframe); 
  // Simplified periodic investment growth
  const compoundValue = monthlySavings * ((Math.pow(1 + 0.12/12, timeframe) - 1) / (0.12/12));
  const investmentGains = compoundValue - (monthlySavings * timeframe);

  return {
    decisionSummary: `Evaluating the impact of spending ₦${dailySpend.toLocaleString()} on delivery ${daysPerWeek}x/week versus cooking for ₦${homeCookingCost.toLocaleString()}.`,
    economicPrinciples: ['Compound Growth', 'Lifestyle Inflation', 'Opportunity Cost', 'Utility vs Value'],
    shortTermOutcome: {
      description: 'Immediate gain in time and convenience at a steep marginal daily cost.',
      financialImpact: -monthlySavings,
      timeframe: 'Per Month',
      type: 'neutral',
      factors: [
        `Monthly delivery premium: ₦${Math.round(monthlySavings).toLocaleString()}`,
        'Save ~10-15 hours/month on meal preparation',
        'Increased reliance on external services'
      ]
    },
    longTermOutcome: {
      description: 'Substantial wealth accumulation through the reallocation of small daily savings.',
      financialImpact: compoundValue,
      timeframe: `${timeframe} Months`,
      type: 'positive',
      factors: [
        `Direct cash savings: ₦${Math.round(savings).toLocaleString()}`,
        `Projected investment value (12% APR): ₦${Math.round(compoundValue).toLocaleString()}`,
        `Wealth created from gains: ₦${Math.round(investmentGains).toLocaleString()}`
      ]
    },
    keyInsight: `The real cost of delivery isn't the ₦${dailySpend.toLocaleString()} today—it's the ₦${Math.round(compoundValue).toLocaleString()} you won't have in ${timeframe} months. By cooking at home, you aren't just saving money; you're building a "Convenience Fund" that yields massive compound returns.`,
    calculations: [
      { label: 'Monthly Saving Pot', value: monthlySavings, formatted: `₦${Math.round(monthlySavings).toLocaleString()}`, explanation: 'Extra spend available for investment' },
      { label: 'Cumulative Savings', value: savings, formatted: `₦${Math.round(savings).toLocaleString()}`, explanation: 'Total cost difference over period' },
      { label: 'Compound Value', value: compoundValue, formatted: `₦${Math.round(compoundValue).toLocaleString()}`, explanation: 'Projected value if saved monthly at 12% p.a.' }
    ]
  };
}

function simulateEmergencyFund(params: Record<string, number>): SimulationResult {
  const { savingsAmount, emergencyFundMonths, monthlyExpenses, investmentReturn } = params;
  
  const targetFund = monthlyExpenses * emergencyFundMonths;
  const remainingInvestable = Math.max(0, savingsAmount - targetFund);
  const horizon = 5;
  const growthWithFund = EconomicEngine.compoundInterest(remainingInvestable, investmentReturn, horizon);
  const growthFullyInvested = EconomicEngine.compoundInterest(savingsAmount, investmentReturn, horizon);
  const opportunityCost = growthFullyInvested - (growthWithFund + targetFund);

  return {
    decisionSummary: `Allocating ₦${targetFund.toLocaleString()} for a ${emergencyFundMonths}-month safety net vs. full market exposure of ₦${savingsAmount.toLocaleString()}.`,
    economicPrinciples: ['Risk Premium', 'Liquidity Preference', 'Asset Allocation', 'Expected Value'],
    shortTermOutcome: {
      description: 'Elimination of financial fragility and protection against high-interest emergency debt.',
      financialImpact: targetFund,
      timeframe: 'Immediate',
      type: 'positive',
      factors: [
        'Psychological peace of mind (Priceless)',
        `Liquid liquidity: ₦${targetFund.toLocaleString()}`,
        'Avoidance of forced asset liquidation during market downturns'
      ]
    },
    longTermOutcome: {
      description: 'A "premium" paid for insurance in the form of foregone market returns.',
      financialImpact: -opportunityCost,
      timeframe: `${horizon} Years`,
      type: 'neutral',
      factors: [
        `Lost potential growth: ₦${Math.round(opportunityCost).toLocaleString()}`,
        `Portfolio value (with fund): ₦${Math.round(growthWithFund + targetFund).toLocaleString()}`,
        `Portfolio value (fully invested): ₦${Math.round(growthFullyInvested).toLocaleString()}`
      ]
    },
    keyInsight: `The ₦${Math.round(opportunityCost).toLocaleString()} in lost returns over 5 years is the "insurance premium" you pay for stability. While it reduces total wealth, it prevents "Game Over" scenarios where you're forced to sell assets at a loss or take 40%+ interest loans. Resilience is the foundation of long-term compounding.`,
    calculations: [
      { label: 'Emergency Fund Size', value: targetFund, formatted: `₦${Math.round(targetFund).toLocaleString()}`, explanation: 'Cash kept in low-yield liquid account' },
      { label: 'Growth Opportunity Cost', value: opportunityCost, formatted: `₦${Math.round(opportunityCost).toLocaleString()}`, explanation: 'Total returns sacrificed for liquidity' },
      { label: 'Stability Ratio', value: targetFund / monthlyExpenses, formatted: `${emergencyFundMonths} Months`, explanation: 'Survival duration without income' }
    ]
  };
}

function simulateMinimumWage(params: Record<string, number>): SimulationResult {
  const { currentWage, increasePercent, affectedWorkers, employmentElasticity } = params;
  
  const newWage = currentWage * (1 + increasePercent / 100);
  const monthlyIncrease = newWage - currentWage;
  const employmentChangeRate = (increasePercent * employmentElasticity) / 100;
  const jobLossCount = Math.abs(Math.round(affectedWorkers * employmentChangeRate));
  const remainingWorkers = affectedWorkers - jobLossCount;
  
  const oldWageBill = currentWage * affectedWorkers;
  const newWageBill = newWage * remainingWorkers;
  const netInjection = newWageBill - oldWageBill;

  return {
    decisionSummary: `Proposing a ${increasePercent}% increase to ₦${newWage.toLocaleString()} for ${affectedWorkers.toLocaleString()} base-level workers.`,
    economicPrinciples: ['Price Elasticity of Demand', 'Purchasing Power', 'Marginal Cost of Labor', 'Aggregate Demand'],
    shortTermOutcome: {
      description: 'Significant boost in disposable income for the majority, offset by localized unemployment.',
      financialImpact: netInjection,
      timeframe: '6-12 Months',
      type: 'neutral',
      factors: [
        `Benefiting workers: ${remainingWorkers.toLocaleString()}`,
        `Individual monthly gain: ₦${Math.round(monthlyIncrease).toLocaleString()}`,
        `Estimated job displacement: ${jobLossCount.toLocaleString()} workers`
      ]
    },
    longTermOutcome: {
      description: 'Structural shifts in business operations including automation and potential price inflation.',
      financialImpact: netInjection * 12,
      timeframe: 'Post-2 Years',
      type: 'neutral',
      factors: [
        'Incentive for businesses to automate low-skill roles',
        'Increased velocity of money as low-earners spend more',
        'Potential upward pressure on general price levels (inflation)'
      ]
    },
    keyInsight: `Raising the wage floor is a transfer of value from business margins to worker consumption. With an elasticity of ${employmentElasticity}, for every 100 people getting a raise, about ${Math.abs(employmentElasticity * increasePercent).toFixed(1)} might lose their role. The policy success depends on whether the increased spending power of the ${remainingWorkers.toLocaleString()} outweighs the loss of the ${jobLossCount.toLocaleString()}.`,
    calculations: [
      { label: 'New Monthly Wage', value: newWage, formatted: `₦${Math.round(newWage).toLocaleString()}`, explanation: 'Proposed wage floor' },
      { label: 'Job Displacement', value: jobLossCount, formatted: `${jobLossCount.toLocaleString()} jobs`, explanation: 'Predicted layoffs based on elasticity' },
      { label: 'Net Market Injection', value: netInjection, formatted: `₦${Math.round(netInjection).toLocaleString()}`, explanation: 'Additional monthly liquidity in the economy' }
    ]
  };
}

function simulateStudentLoan(params: Record<string, number>): SimulationResult {
  const { tuitionCost, loanInterestRate, repaymentYears, workingSalary } = params;
  
  const monthlyPayment = EconomicEngine.loanPayment(tuitionCost, loanInterestRate, repaymentYears * 12);
  const totalRepaid = monthlyPayment * repaymentYears * 12;
  const interestCost = totalRepaid - tuitionCost;
  
  // Opportunity cost of not working for 4 years
  const lostEarnings = workingSalary * 12 * 4;
  const totalInvestment = tuitionCost + lostEarnings;

  return {
    decisionSummary: `Analyzing a ₦${tuitionCost.toLocaleString()} degree financed at ${loanInterestRate}% vs. the opportunity cost of 4 years lost wages.`,
    economicPrinciples: ['Human Capital Investment', 'Time Value of Money', 'Opportunity Cost', 'Internal Rate of Return'],
    shortTermOutcome: {
      description: 'Immediate debt accumulation and zero income during study period.',
      financialImpact: -totalInvestment,
      timeframe: '4-Year Study Period',
      type: 'negative',
      factors: [
        `Debt principal: ₦${tuitionCost.toLocaleString()}`,
        `Foregone salary: ₦${lostEarnings.toLocaleString()}`,
        'High financial fragility during transition'
      ]
    },
    longTermOutcome: {
      description: 'Exponential increase in lifetime earnings potential if career trajectory is elevated.',
      financialImpact: -interestCost,
      timeframe: `${repaymentYears} Years Post-Grad`,
      type: 'positive',
      factors: [
        `Total interest "Tax": ₦${Math.round(interestCost).toLocaleString()}`,
        'Access to higher-tier labor markets',
        'Earlier entry into specialized career paths'
      ]
    },
    keyInsight: `A degree isn't just tuition—it's the ₦${lostEarnings.toLocaleString()} you didn't earn while studying. To break even, your post-grad salary must not only cover the ₦${Math.round(monthlyPayment).toLocaleString()} monthly payment but also recoup the 4 years of "lost time." If the degree doesn't increase your earning power by at least 50-70%, the numbers suggest working might be more efficient.`,
    calculations: [
      { label: 'Monthly Repayment', value: monthlyPayment, formatted: `₦${Math.round(monthlyPayment).toLocaleString()}`, explanation: 'Payment for 10 years after grad' },
      { label: 'Lifetime Interest', value: interestCost, formatted: `₦${Math.round(interestCost).toLocaleString()}`, explanation: 'Extra cost of financing the education' },
      { label: 'Total Invested Value', value: totalInvestment, formatted: `₦${Math.round(totalInvestment).toLocaleString()}`, explanation: 'Tuition + 4 years of lost salary' }
    ]
  };
}

// ============================================================================
// COMPONENTS
// ============================================================================

const Card = ({ children, className = '', onClick }: { children: React.ReactNode; className?: string, onClick?: () => void }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`glass-morphism rounded-2xl overflow-hidden cursor-pointer ${className}`}
  >
    {children}
  </motion.div>
);

const Badge = ({ children, color = 'purple' }: { children: React.ReactNode; color?: string }) => {
  const colors: Record<string, string> = {
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[color] || colors.purple}`}>
      {children}
    </span>
  );
};

export default function EconoSim() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [parameters, setParameters] = useState<Record<string, number>>({});
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedScenario, result]);

  const handleScenarioSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setResult(null);
    const defaults: Record<string, number> = {};
    scenario.parameters.forEach(p => defaults[p.name] = p.defaultValue as number);
    setParameters(defaults);
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setResult(simulateScenario(selectedScenario!.id, parameters));
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-purple-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="max-w-6xl mx-auto px-6">
        {/* Navigation */}
        <nav className="py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="EconoSim" width={40} height={40} />
            <span className="text-2xl font-black tracking-tighter text-white">ECONO<span className="text-purple-400">SIM</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Framework</a>
            <a href="#" className="hover:text-white transition-colors">Methodology</a>
            <button className="px-5 py-2 glass rounded-full text-white hover:bg-white/10 transition-all">
              Documentation
            </button>
          </div>
        </nav>

        <AnimatePresence mode="wait">
          {!selectedScenario ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-12 md:mt-24 space-y-16"
            >
              {/* Hero */}
              <div className="max-w-3xl space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge color="purple">Next-Gen Simulation</Badge>
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                  Visualize the <br /> 
                  <span className="text-gradient-purple underline decoration-purple-500/30 underline-offset-8">Hidden Math</span> of Life.
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                  Most financial mistakes are invisible because humans aren't wired to calculate opportunity cost and compounding in real-time. EconoSim makes the invisible, visible.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-purple-600/20 flex items-center gap-2 group">
                    Explore Scenarios <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="px-8 py-4 glass text-white rounded-2xl font-bold hover:bg-white/10 transition-all">
                    How it Works
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div className="space-y-8">
                <div className="flex items-end justify-between">
                  <h2 className="text-2xl font-bold text-white">Select a Simulation</h2>
                  <span className="text-sm text-slate-500">3 High Impact Models Available</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {SCENARIOS.map((s, i) => (
                    <Card key={s.id} onClick={() => handleScenarioSelect(s)} className="p-8 h-full flex flex-col justify-between group">
                      <div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-${s.color}-500/10 text-${s.color}-400 group-hover:scale-110 transition-transform`}>
                          {s.icon}
                        </div>
                        <Badge color={s.color as any}>{s.category}</Badge>
                        <h3 className="text-2xl font-bold text-white mt-4 mb-2">{s.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{s.description}</p>
                      </div>
                      <div className="mt-8 flex items-center justify-between text-xs font-bold text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2 Min Read</span>
                        <span className="text-purple-400 group-hover:translate-x-1 transition-transform">Run Simulation →</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="simulator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-12 space-y-10"
            >
              {/* Back Button */}
              <button 
                onClick={() => setSelectedScenario(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Inputs */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${selectedScenario.color}-500/10 text-${selectedScenario.color}-400`}>
                        {selectedScenario.icon}
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-white">{selectedScenario.title}</h1>
                        <p className="text-slate-400 text-sm">{selectedScenario.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-morphism p-8 rounded-3xl space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Configure Parameters</h3>
                    <div className="space-y-6">
                      {selectedScenario.parameters.map(p => (
                        <div key={p.name} className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <label className="text-slate-300 font-medium">{p.label}</label>
                            <span className="text-purple-400 font-mono">
                              {parameters[p.name]?.toLocaleString()} {p.suffix}
                            </span>
                          </div>
                          <input 
                            type="range"
                            min={p.min}
                            max={p.max}
                            value={parameters[p.name]}
                            step={p.type === 'number' && (p.max! - p.min!) > 1000 ? 500 : 1}
                            onChange={(e) => setParameters(prev => ({...prev, [p.name]: parseFloat(e.target.value)}))}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                          />
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={handleSimulate}
                      disabled={isSimulating}
                      className="w-full py-5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 overflow-hidden relative"
                    >
                      {isSimulating ? (
                        <>
                          <Clock className="w-5 h-5 animate-spin" />
                          Processing Simulation...
                        </>
                      ) : (
                        <>
                          Run Economic Engine <Zap className="w-5 h-5 fill-current" />
                        </>
                      )}
                      {isSimulating && (
                        <motion.div 
                          className="absolute inset-x-0 bottom-0 h-1 bg-white/20"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1.2 }}
                        />
                      )}
                    </button>
                  </div>

                  {/* Principle Sidebar */}
                  <div className="p-8 border border-white/5 rounded-3xl bg-white/[0.01]">
                    <div className="flex items-center gap-2 mb-4 text-slate-400">
                      <Info className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Theoretical Basis</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedScenario.parameters.slice(0, 3).map((_, i) => (
                        <div key={i} className="px-3 py-1.5 bg-slate-900/50 rounded-lg text-xs text-slate-500">
                          Principle {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results View */}
                <div className="lg:col-span-7">
                  <AnimatePresence mode="wait">
                    {result ? (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        {/* Summary Header */}
                        <div className="glass-morphism p-8 rounded-3xl border-l-4 border-l-purple-500">
                          <h3 className="text-sm font-bold text-purple-400 mb-2 uppercase tracking-wider">Executive Summary</h3>
                          <p className="text-xl text-white font-medium leading-relaxed">
                            {result.decisionSummary}
                          </p>
                        </div>

                        {/* Outcomes Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Short Term */}
                          <div className="glass-morphism p-8 rounded-3xl space-y-6">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black uppercase text-slate-500 tracking-widest">Short-Term</span>
                              <div className={`p-2 rounded-lg ${result.shortTermOutcome.type === 'negative' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                <Clock className="w-4 h-4" />
                              </div>
                            </div>
                            <h4 className="text-lg font-bold text-white">{result.shortTermOutcome.description}</h4>
                            <div className="space-y-1">
                              <div className="text-3xl font-black text-white">
                                {result.shortTermOutcome.financialImpact < 0 ? '-' : '+'}₦{Math.abs(Math.round(result.shortTermOutcome.financialImpact)).toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-500 font-medium">{result.shortTermOutcome.timeframe}</div>
                            </div>
                            <ul className="space-y-3 pt-4 border-t border-white/5">
                              {result.shortTermOutcome.factors.map((f, i) => (
                                <li key={i} className="text-xs text-slate-400 flex items-start gap-3 italic">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1" />
                                  {f}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Long Term */}
                          <div className={`glass-morphism p-8 rounded-3xl space-y-6 border-2 ${result.longTermOutcome.type === 'positive' ? 'border-emerald-500/20' : 'border-rose-500/20'}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black uppercase text-slate-500 tracking-widest">Long-Term Impact</span>
                              <div className={`p-2 rounded-lg ${result.longTermOutcome.type === 'negative' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                <TrendingUp className="w-4 h-4" />
                              </div>
                            </div>
                            <h4 className="text-lg font-bold text-white">{result.longTermOutcome.description}</h4>
                            <div className="space-y-1">
                              <div className={`text-3xl font-black ${result.longTermOutcome.type === 'positive' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {result.longTermOutcome.financialImpact < 0 ? '-' : '+'}₦{Math.abs(Math.round(result.longTermOutcome.financialImpact)).toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-500 font-medium">{result.longTermOutcome.timeframe}</div>
                            </div>
                            <ul className="space-y-3 pt-4 border-t border-white/5">
                              {result.longTermOutcome.factors.map((f, i) => (
                                <li key={i} className="text-xs text-slate-400 flex items-start gap-3 italic">
                                  <div className={`w-1.5 h-1.5 rounded-full ${result.longTermOutcome.type === 'positive' ? 'bg-emerald-600' : 'bg-rose-600'} mt-1`} />
                                  {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Calculations Breakdown */}
                        <div className="glass-morphism p-8 rounded-3xl space-y-6">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">The Mathematics</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {result.calculations.map((c, i) => (
                              <div key={i} className="space-y-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{c.label}</div>
                                <div className="text-lg font-black text-white">{c.formatted}</div>
                                <p className="text-[10px] text-slate-500 leading-tight">{c.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Final Insight */}
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white shadow-2xl shadow-indigo-600/20">
                          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur">
                              <Target className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-xl font-bold">The Strategic Pivot</h3>
                              <p className="text-indigo-100 italic font-medium leading-relaxed">
                                "{result.keyInsight}"
                              </p>
                            </div>
                          </div>
                          {/* Decorative element */}
                          <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px]" />
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-6 glass-morphism rounded-3xl border-dashed border-2 border-white/10 opacity-60">
                        <div className="animate-float">
                          <Leaf className="w-16 h-16 text-slate-600" />
                        </div>
                        <div className="max-w-xs">
                          <h3 className="text-white font-bold text-lg">Engine Standby</h3>
                          <p className="text-sm text-slate-500">Configure the parameters and hit 'Run' to see the economic projection.</p>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-sm">
        <div className="flex items-center gap-2 grayscale brightness-50">
          <Image src="/logo.png" alt="EconoSim" width={40} height={40} />
          <span className="font-bold tracking-tighter text-white">ECONOSIM</span>
        </div>
        <div>© 2026 EconoSim Intelligence Lab. Educational purposes only.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
