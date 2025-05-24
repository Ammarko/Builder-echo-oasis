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
 * Calculate maximum budget based on net income and financing option
 * @param netIncome Net monthly income in SAR
 * @param financingOption "Cash" or "Mortgage"
 * @returns Maximum budget in SAR
 */
export const calculateMaxBudget = (
  netIncome: number,
  financingOption: "Cash" | "Mortgage",
): number => {
  if (financingOption === "Mortgage") {
    // Mortgage: 35% of net income times 200 (mortgage multiplier)
    return netIncome * 0.35 * 200;
  } else {
    // Cash: 4 years of saving (net income * 12 months * 4 years)
    return netIncome * 12 * 4;
  }
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
