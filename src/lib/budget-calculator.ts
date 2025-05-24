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
 * Calculate maximum budget based on multiple factors
 * @param netIncome Net monthly income in SAR
 * @param financingOption Financing option
 * @param age Current age
 * @param expectedSalaryIncrease Expected annual salary increase in percentage
 * @returns Maximum budget in SAR
 */
export const calculateMaxBudget = (
  netIncome: number,
  financingOption: string,
  age: number,
  expectedSalaryIncrease: number = 3,
): {
  maxBudget: number;
  monthlyPayment: number;
  calculationSteps: string[];
  affordabilityRatio: number;
} => {
  const calculationSteps: string[] = [];
  let maxBudget = 0;
  let monthlyPayment = 0;
  let affordabilityRatio = 0;

  // Standard mortgage interest rate in Saudi Arabia
  const mortgageInterestRate = 4.0;

  // Retirement calculations
  const retirement = calculateRetirementImpact(
    age,
    netIncome,
    expectedSalaryIncrease,
  );

  if (financingOption === "تمويل عقاري" || financingOption === "Mortgage") {
    // For mortgage, consider retirement
    const maxMonthlyPayment = netIncome * 0.35; // 35% of net income for mortgage
    calculationSteps.push(
      `الحد الأقصى للقسط الشهري: ${formatCurrency(maxMonthlyPayment)} (35% من صافي الدخل)`,
    );

    // Typical mortgage term in Saudi Arabia
    const mortgageTerm = Math.min(25, retirement.yearsUntilRetirement + 5);
    calculationSteps.push(`مدة القرض: ${mortgageTerm} سنة`);

    // Calculate maximum loan amount based on monthly payment capacity
    // Using a 4% interest rate (typical for Saudi mortgage)
    if (mortgageTerm > 0) {
      // P = PMT * ((1 - (1 + r)^-n) / r)
      const monthlyRate = mortgageInterestRate / 100 / 12;
      const numberOfPayments = mortgageTerm * 12;

      // Maximum loan amount calculation
      const maxLoanAmount =
        maxMonthlyPayment *
        ((1 - Math.pow(1 + monthlyRate, -numberOfPayments)) / monthlyRate);

      maxBudget = maxLoanAmount;
      monthlyPayment = maxMonthlyPayment;

      calculationSteps.push(`معدل الفائدة: ${mortgageInterestRate}%`);
      calculationSteps.push(
        `القيمة الإجمالية للقرض: ${formatCurrency(maxLoanAmount)}`,
      );

      // Adjust if retirement is approaching
      if (retirement.yearsUntilRetirement < 15) {
        // Apply a reduction factor for approaching retirement
        const reductionFactor =
          0.95 - (15 - retirement.yearsUntilRetirement) * 0.01;
        maxBudget = maxLoanAmount * Math.max(0.8, reductionFactor);
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
  } else if (financingOption === "كاش" || financingOption === "Cash") {
    // For cash, calculate based on saving capacity until retirement
    // Assuming saving 35% of net income each month
    const monthlySavings = netIncome * 0.35;
    calculationSteps.push(
      `قدرة الادخار الشهرية: ${formatCurrency(monthlySavings)} (35% من صافي الدخل)`,
    );

    // How much can be saved until retirement (simplified)
    const yearsToSave = Math.min(retirement.yearsUntilRetirement, 4);
    maxBudget = monthlySavings * 12 * yearsToSave;

    calculationSteps.push(`فترة الادخار: ${yearsToSave} سنوات`);
    calculationSteps.push(
      `إجمالي المدخرات المتوقعة: ${formatCurrency(maxBudget)}`,
    );

    monthlyPayment = 0; // No monthly payment for cash purchase
    affordabilityRatio = 0;
  } else if (
    financingOption === "تقسيط مباشر" ||
    financingOption === "Direct installment"
  ) {
    // For direct installment, typically shorter term, higher interest
    const installmentRate = 5.5; // Higher than mortgage
    const installmentTerm = Math.min(10, retirement.yearsUntilRetirement);
    const maxMonthlyPayment = netIncome * 0.35;

    calculationSteps.push(
      `الحد الأقصى للقسط الشهري: ${formatCurrency(maxMonthlyPayment)} (35% من صافي الدخل)`,
    );
    calculationSteps.push(`مدة التقسيط: ${installmentTerm} سنوات`);
    calculationSteps.push(`معدل الفائدة: ${installmentRate}%`);

    if (installmentTerm > 0) {
      const monthlyRate = installmentRate / 100 / 12;
      const numberOfPayments = installmentTerm * 12;

      // Maximum installment amount calculation
      const maxInstallmentAmount =
        maxMonthlyPayment *
        ((1 - Math.pow(1 + monthlyRate, -numberOfPayments)) / monthlyRate);

      maxBudget = maxInstallmentAmount;
      monthlyPayment = maxMonthlyPayment;

      calculationSteps.push(
        `القيمة الإجمالية للتقسيط: ${formatCurrency(maxInstallmentAmount)}`,
      );
    } else {
      maxBudget = netIncome * 12 * 2;
      calculationSteps.push(
        `نظرًا لقرب سن التقاعد، تم تقدير ميزانية محدودة: ${formatCurrency(maxBudget)}`,
      );
    }

    affordabilityRatio = monthlyPayment / netIncome;
  }

  return { maxBudget, monthlyPayment, calculationSteps, affordabilityRatio };
};

/**
 * Property categories based on budget
 */
export enum PropertyType {
  SMALL_APARTMENT = "شقة صغيرة",
  MEDIUM_APARTMENT = "شقة متوسطة",
  VILLA = "فيلا",
  LUXURY = "عقار فاخر",
}

/**
 * Recommend property type based on maximum budget
 * @param maxBudget Maximum budget in SAR
 * @returns Recommended property type
 */
export const recommendPropertyType = (maxBudget: number): PropertyType => {
  if (maxBudget < 400000) {
    return PropertyType.SMALL_APARTMENT;
  } else if (maxBudget < 700000) {
    return PropertyType.MEDIUM_APARTMENT;
  } else if (maxBudget < 1200000) {
    return PropertyType.VILLA;
  } else {
    return PropertyType.LUXURY;
  }
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
