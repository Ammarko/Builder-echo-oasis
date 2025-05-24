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
  findBestDistrictAndProperty,
  analyzeOwnershipStrategy,
} from "@/lib/api";

const Index = () => {
  const [results, setResults] = useState<{
    maxBudget: number;
    monthlyPayment: number;
    calculationSteps: string[];
    city: string;
    workLocation: string;
    familySize: number;
    requiredRooms: number;
    age: number;
    yearsUntilRetirement: number;
    district: string;
    propertyType: string;
    propertySize: number;
    estimatedPrice: number;
    monthlyRent: number;
    ownershipRecommendation: "buy" | "rent";
    financingOption: string;
    loanAmount: number;
    loanTerm: number;
    downPayment: number;
    affordabilityRatio: number;
    reasons: string[];
    propertyReasons: string[];
    showResults: boolean;
    formData: BudgetFormValues | null;
    isAffordable: boolean;
    mortgageInterestRate: number;
  }>({
    maxBudget: 0,
    monthlyPayment: 0,
    calculationSteps: [],
    city: "",
    workLocation: "",
    familySize: 0,
    requiredRooms: 0,
    age: 0,
    yearsUntilRetirement: 0,
    district: "",
    propertyType: "",
    propertySize: 0,
    estimatedPrice: 0,
    monthlyRent: 0,
    ownershipRecommendation: "buy",
    financingOption: "",
    loanAmount: 0,
    loanTerm: 0,
    downPayment: 0,
    affordabilityRatio: 0,
    reasons: [],
    propertyReasons: [],
    showResults: false,
    formData: null,
    isAffordable: true,
    mortgageInterestRate: 4.0,
  });

  // Fetch current date from Saudi API
  const { data: dateData, isLoading: isDateLoading } = useSaudiDate();

  // Fetch data based on selected city (only when form is submitted)
  const { data: realEstatePrices, isLoading: isPricesLoading } =
    useRealEstatePrices(results.city);

  const { data: realEstateIndicators, isLoading: isIndicatorsLoading } =
    useRealEstateIndicators(results.city);

  const { data: housingFinance, isLoading: isFinanceLoading } =
    useHousingFinance("تمويل عقاري");

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

    // Calculate maximum budget based on financial parameters
    const budgetResult = calculateMaxBudget(
      netIncome,
      data.age,
      data.expectedSalaryIncrease,
      data.mortgageInterestRate,
    );

    // Analyze if buying or renting is better based on user profile
    const ownershipStrategy = analyzeOwnershipStrategy(
      data.monthlyIncome,
      data.monthlyObligations,
      data.age,
      retirement.yearsUntilRetirement,
      data.currentCity,
      data.mortgageInterestRate,
      budgetResult.maxBudget,
    );

    // Find the best district and property type based on budget and preferences
    const propertyRecommendation = findBestDistrictAndProperty(
      data.currentCity,
      data.workLocation,
      budgetResult.maxBudget,
      data.familySize,
      data.requiredRooms,
    );

    // Check if affordable (budget >= estimated price)
    const isAffordable =
      budgetResult.maxBudget >= propertyRecommendation.estimatedPrice;

    // Set results
    setResults({
      maxBudget: budgetResult.maxBudget,
      monthlyPayment: budgetResult.monthlyPayment,
      calculationSteps: budgetResult.calculationSteps,
      city: data.currentCity,
      workLocation: data.workLocation,
      familySize: data.familySize,
      requiredRooms: data.requiredRooms,
      age: data.age,
      yearsUntilRetirement: retirement.yearsUntilRetirement,
      district: propertyRecommendation.district,
      propertyType: propertyRecommendation.propertyType,
      propertySize: propertyRecommendation.propertySize,
      estimatedPrice: propertyRecommendation.estimatedPrice,
      monthlyRent: propertyRecommendation.monthlyRent,
      ownershipRecommendation: ownershipStrategy.recommended,
      financingOption: ownershipStrategy.financingOption,
      loanAmount: ownershipStrategy.loanAmount,
      loanTerm: ownershipStrategy.loanTerm,
      downPayment: ownershipStrategy.downPayment,
      affordabilityRatio: budgetResult.affordabilityRatio,
      reasons: ownershipStrategy.reasons,
      propertyReasons: propertyRecommendation.reasons,
      showResults: true,
      formData: data,
      isAffordable: isAffordable,
      mortgageInterestRate: data.mortgageInterestRate,
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
              city={results.city}
              workLocation={results.workLocation}
              familySize={results.familySize}
              requiredRooms={results.requiredRooms}
              age={results.age}
              yearsUntilRetirement={results.yearsUntilRetirement}
              district={results.district}
              propertyType={results.propertyType}
              propertySize={results.propertySize}
              estimatedPrice={results.estimatedPrice}
              monthlyRent={results.monthlyRent}
              ownershipRecommendation={results.ownershipRecommendation}
              financingOption={results.financingOption}
              loanAmount={results.loanAmount}
              loanTerm={results.loanTerm}
              downPayment={results.downPayment}
              affordabilityRatio={results.affordabilityRatio}
              reasons={results.reasons}
              propertyReasons={results.propertyReasons}
              gregorianDate={gregorianDate}
              hijriDate={hijriDate}
              isLoading={isLoading}
              isAffordable={results.isAffordable}
              mortgageInterestRate={results.mortgageInterestRate}
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
