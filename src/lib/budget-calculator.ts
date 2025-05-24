/**
 * Calculate net available income
 * @param monthlyIncome Monthly income in SAR
 * @param monthlyObligations Monthly obligations in SAR
 * @returns Net income in SAR
 */
export const calculateNetIncome = (
  monthlyIncome: number,
  monthlyObligations: number,
): number => {
  return Math.max(0, monthlyIncome - monthlyObligations);
};

/**
 * Calculate retirement impact on budget
 * @param age Current age
 * @param netMonthlyIncome Net monthly income
 * @param expectedSalaryIncrease Annual expected salary increase (percentage)
 * @returns Object with time until retirement, pre and post retirement income
 */
export const calculateRetirementImpact = (
  age: number,
  netMonthlyIncome: number,
  expectedSalaryIncrease: number,
): {
  yearsUntilRetirement: number;
  preRetirementIncome: number;
  postRetirementIncome: number;
  totalPreRetirementIncome: number;
} => {
  const retirementAge = 65;
  const yearsUntilRetirement = Math.max(0, retirementAge - age);

  // Calculate income growth until retirement (compound growth)
  let preRetirementIncome = netMonthlyIncome;
  if (yearsUntilRetirement > 0 && expectedSalaryIncrease > 0) {
    // Apply compound growth
    preRetirementIncome =
      netMonthlyIncome *
      Math.pow(1 + expectedSalaryIncrease / 100, yearsUntilRetirement);
  }

  // Post-retirement income is 60% of pre-retirement
  const postRetirementIncome = preRetirementIncome * 0.6;

  // Calculate total income until retirement (monthly to yearly, accounting for growth)
  // This is a simplification - real calculation would use an actual sum of the geometric series
  const avgPreRetirementMonthlyIncome =
    (netMonthlyIncome + preRetirementIncome) / 2;
  const totalPreRetirementIncome =
    avgPreRetirementMonthlyIncome * 12 * yearsUntilRetirement;

  return {
    yearsUntilRetirement,
    preRetirementIncome,
    postRetirementIncome,
    totalPreRetirementIncome,
  };
};

/**
 * Calculate monthly mortgage payment
 * @param loanAmount Total loan amount
 * @param annualInterestRate Annual interest rate (as a percentage, e.g. 4.0)
 * @param loanTermYears Loan term in years
 * @returns Monthly payment
 */
export const calculateMortgagePayment = (
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number,
): number => {
  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  // If interest rate is 0, just divide the loan amount by number of payments
  if (annualInterestRate === 0) {
    return loanAmount / numberOfPayments;
  }

  // Otherwise use the standard mortgage payment formula
  return (
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
};

/**
 * Calculate maximum budget based on income, retirement, and financial parameters
 * @param netIncome Net monthly income in SAR
 * @param age Current age
 * @param expectedSalaryIncrease Expected annual salary increase in percentage
 * @param mortgageInterestRate Mortgage interest rate in percentage
 * @returns Budget information including maximum budget and calculation steps
 */
export const calculateMaxBudget = (
  netIncome: number,
  age: number,
  expectedSalaryIncrease: number = 3,
  mortgageInterestRate: number = 4.0,
): {
  maxBudget: number;
  monthlyPayment: number;
  calculationSteps: string[];
  affordabilityRatio: number;
  financingOption: string;
  loanTerm: number;
  downPayment: number;
} => {
  const calculationSteps: string[] = [];
  let maxBudget = 0;
  let monthlyPayment = 0;
  let affordabilityRatio = 0;
  let financingOption = "تمويل عقاري";
  let loanTerm = 25;
  let downPayment = 0;

  // Retirement calculations
  const retirement = calculateRetirementImpact(
    age,
    netIncome,
    expectedSalaryIncrease,
  );

  // For mortgage, consider retirement
  const maxMonthlyPayment = netIncome * 0.35; // 35% of net income for mortgage
  calculationSteps.push(
    `الحد الأقصى للقسط الشهري: ${formatCurrency(maxMonthlyPayment)} (35% من صافي الدخل)`,
  );

  // Typical mortgage term in Saudi Arabia, adjusted for retirement
  loanTerm = Math.min(25, retirement.yearsUntilRetirement + 5);
  calculationSteps.push(`مدة القرض: ${loanTerm} سنة`);

  // Calculate maximum loan amount based on monthly payment capacity
  if (loanTerm > 0) {
    // Calculate loan amount using the mortgage formula
    const monthlyRate = mortgageInterestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Maximum loan amount calculation
    const maxLoanAmount =
      maxMonthlyPayment *
      ((1 - Math.pow(1 + monthlyRate, -numberOfPayments)) / monthlyRate);

    // Total budget is loan amount plus 20% down payment
    const totalBudget = maxLoanAmount / 0.8; // Assuming 20% down payment
    downPayment = totalBudget * 0.2;

    maxBudget = totalBudget;
    monthlyPayment = maxMonthlyPayment;

    calculationSteps.push(`معدل الفائدة: ${mortgageInterestRate}%`);
    calculationSteps.push(
      `القيمة الإجمالية للقرض: ${formatCurrency(maxLoanAmount)} (80% من قيمة العقار)`,
    );
    calculationSteps.push(
      `الدفعة الأولى: ${formatCurrency(downPayment)} (20% من قيمة العقار)`,
    );
    calculationSteps.push(
      `إجمالي الميزانية المتاحة: ${formatCurrency(maxBudget)}`,
    );

    // Adjust if retirement is approaching
    if (retirement.yearsUntilRetirement < 15) {
      // Apply a reduction factor for approaching retirement
      const reductionFactor =
        0.95 - (15 - retirement.yearsUntilRetirement) * 0.01;
      maxBudget = maxBudget * Math.max(0.8, reductionFactor);
      calculationSteps.push(
        `تعديل بسبب اقتراب سن التقاعد: ${formatCurrency(maxBudget)}`,
      );
    }
  } else {
    // Too close to retirement for a mortgage
    maxBudget = netIncome * 12 * 5; // 5 years of income
    calculationSteps.push(
      `نظرًا لقرب سن التقاعد، تم تقدير ميزانية محدودة: ${formatCurrency(maxBudget)}`,
    );
  }

  affordabilityRatio = monthlyPayment / netIncome;

  return {
    maxBudget,
    monthlyPayment,
    calculationSteps,
    affordabilityRatio,
    financingOption,
    loanTerm,
    downPayment,
  };
};

/**
 * Calculate required rooms based on family size
 * @param familySize Number of family members
 * @returns Recommended number of rooms
 */
export const calculateRequiredRooms = (
  familySize: number,
): {
  bedrooms: number;
  bathrooms: number;
} => {
  // Simplified room calculation based on family size
  if (familySize <= 2) {
    return { bedrooms: 1, bathrooms: 1 };
  } else if (familySize <= 4) {
    return { bedrooms: 2, bathrooms: 2 };
  } else if (familySize <= 6) {
    return { bedrooms: 3, bathrooms: 2 };
  } else if (familySize <= 8) {
    return { bedrooms: 4, bathrooms: 3 };
  } else {
    return { bedrooms: 5, bathrooms: 3 };
  }
};

/**
 * Format currency in SAR
 * @param amount Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage
 * @param value Percentage value (e.g., 5 for 5%)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("ar-SA", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};
