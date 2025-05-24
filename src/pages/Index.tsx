import React, { useState } from "react";
import {
  RealEstateBudgetForm,
  BudgetFormValues,
} from "@/components/RealEstateBudgetForm";
import { BudgetResult } from "@/components/BudgetResult";
import {
  calculateNetIncome,
  calculateMaxBudget,
  calculateRetirementImpact,
  calculateRequiredRooms,
} from "@/lib/budget-calculator";
import {
  useSaudiDate,
  useRealEstatePrices,
  useRealEstateIndicators,
  useHousingFinance,
  getRecommendedDistrict,
  getEstimatedPropertyPrice,
  shouldRentInsteadOfBuy,
} from "@/lib/api";

const Index = () => {
  const [results, setResults] = useState<{
    maxBudget: number;
    monthlyPayment: number;
    calculationSteps: string[];
    recommendedPropertyType: string;
    recommendedDistrict: string;
    estimatedPropertyPrice: number;
    isRentRecommended: boolean;
    rentReasons: string[];
    affordabilityRatio: number;
    yearsUntilRetirement: number;
    showResults: boolean;
    formData: BudgetFormValues | null;
    isAffordable: boolean;
  }>({
    maxBudget: 0,
    monthlyPayment: 0,
    calculationSteps: [],
    recommendedPropertyType: "",
    recommendedDistrict: "",
    estimatedPropertyPrice: 0,
    isRentRecommended: false,
    rentReasons: [],
    affordabilityRatio: 0,
    yearsUntilRetirement: 0,
    showResults: false,
    formData: null,
    isAffordable: true,
  });

  // Fetch current date from Saudi API
  const { data: dateData, isLoading: isDateLoading } = useSaudiDate();

  // Fetch data based on selected city (only when form is submitted)
  const { data: realEstatePrices, isLoading: isPricesLoading } =
    useRealEstatePrices(results.formData?.futureCity);

  const { data: realEstateIndicators, isLoading: isIndicatorsLoading } =
    useRealEstateIndicators(results.formData?.futureCity);

  const { data: housingFinance, isLoading: isFinanceLoading } =
    useHousingFinance(results.formData?.financingOption);

  const handleFormSubmit = (data: BudgetFormValues) => {
    // Calculate net income
    const netIncome = calculateNetIncome(
      data.monthlyIncome,
      data.monthlyObligations,
    );

    // Calculate retirement impact
    const retirement = calculateRetirementImpact(
      data.age,
      netIncome,
      data.expectedSalaryIncrease,
    );

    // Calculate maximum budget based on financing option
    const budgetResult = calculateMaxBudget(
      netIncome,
      data.financingOption,
      data.age,
      data.expectedSalaryIncrease,
    );

    // Get recommended district
    const district = getRecommendedDistrict(
      data.futureCity,
      budgetResult.maxBudget,
      data.familySize,
      data.preferredPropertyType,
    );

    // Get estimated property price
    const estimatedPrice = getEstimatedPropertyPrice(
      data.futureCity,
      district?.name || "",
      data.preferredPropertyType,
    );

    // Check if rent is recommended instead of buying
    const rentAnalysis = shouldRentInsteadOfBuy(
      data.futureCity,
      data.age,
      budgetResult.maxBudget,
      retirement.yearsUntilRetirement,
    );

    // Check if affordable (budget >= estimated price)
    const isAffordable = budgetResult.maxBudget >= estimatedPrice;

    // Set results
    setResults({
      maxBudget: budgetResult.maxBudget,
      monthlyPayment: budgetResult.monthlyPayment,
      calculationSteps: budgetResult.calculationSteps,
      recommendedPropertyType: data.preferredPropertyType,
      recommendedDistrict: district?.name || "",
      estimatedPropertyPrice: estimatedPrice,
      isRentRecommended: rentAnalysis.recommendation,
      rentReasons: rentAnalysis.reasons,
      affordabilityRatio: budgetResult.affordabilityRatio,
      yearsUntilRetirement: retirement.yearsUntilRetirement,
      showResults: true,
      formData: data,
      isAffordable: isAffordable,
    });
  };

  // Format date strings
  const gregorianDate = dateData?.data?.gregorian
    ? `${dateData.data.gregorian.day} ${dateData.data.gregorian.month.en} ${dateData.data.gregorian.year}`
    : undefined;

  const hijriDate = dateData?.data?.hijri
    ? `${dateData.data.hijri.day} ${dateData.data.hijri.month.ar} ${dateData.data.hijri.year}`
    : undefined;

  const isLoading =
    isDateLoading || isPricesLoading || isIndicatorsLoading || isFinanceLoading;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
        مساعد حساب ميزانية العقارات
      </h1>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 justify-center items-center md:items-start">
        <div className="w-full md:w-1/2">
          <RealEstateBudgetForm onSubmit={handleFormSubmit} />
        </div>

        {results.showResults && results.formData && (
          <div className="w-full md:w-1/2 mt-6 md:mt-0">
            <BudgetResult
              maxBudget={results.maxBudget}
              monthlyPayment={results.monthlyPayment}
              calculationSteps={results.calculationSteps}
              propertyType={results.recommendedPropertyType}
              city={results.formData.currentCity}
              futureCity={results.formData.futureCity}
              familySize={results.formData.familySize}
              requiredRooms={results.formData.requiredRooms}
              age={results.formData.age}
              financingOption={results.formData.financingOption}
              preferredPropertyType={results.formData.preferredPropertyType}
              ownershipPreference={results.formData.ownershipPreference}
              expectedSalaryIncrease={results.formData.expectedSalaryIncrease}
              yearsUntilRetirement={results.yearsUntilRetirement}
              recommendedPropertyType={results.recommendedPropertyType}
              recommendedDistrict={results.recommendedDistrict}
              estimatedPropertyPrice={results.estimatedPropertyPrice}
              isRentRecommended={results.isRentRecommended}
              rentReasons={results.rentReasons}
              affordabilityRatio={results.affordabilityRatio}
              gregorianDate={gregorianDate}
              hijriDate={hijriDate}
              isLoading={isLoading}
              isAffordable={results.isAffordable}
            />
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} مساعد حساب ميزانية العقارات - جميع
          الحقوق محفوظة
        </p>
      </footer>
    </div>
  );
};

export default Index;
