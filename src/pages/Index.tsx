import React, { useState } from "react";
import {
  RealEstateBudgetForm,
  BudgetFormValues,
} from "@/components/RealEstateBudgetForm";
import { BudgetResult } from "@/components/BudgetResult";
import {
  calculateNetIncome,
  calculateMaxBudget,
  recommendPropertyType,
} from "@/lib/budget-calculator";
import { useSaudiDate } from "@/lib/api";

const Index = () => {
  const [results, setResults] = useState<{
    maxBudget: number;
    propertyType: string;
    showResults: boolean;
    formData: BudgetFormValues | null;
  }>({
    maxBudget: 0,
    propertyType: "",
    showResults: false,
    formData: null,
  });

  // Fetch current date from Saudi API
  const { data: dateData, isLoading } = useSaudiDate();

  const handleFormSubmit = (data: BudgetFormValues) => {
    // Calculate net income
    const netIncome = calculateNetIncome(
      data.monthlyIncome,
      data.monthlyObligations,
    );

    // Calculate maximum budget based on financing option
    const maxBudget = calculateMaxBudget(
      netIncome,
      data.financingOption as "Cash" | "Mortgage",
    );

    // Get property type recommendation
    const propertyType = recommendPropertyType(maxBudget);

    // Set results
    setResults({
      maxBudget,
      propertyType,
      showResults: true,
      formData: data,
    });
  };

  // Format date strings
  const gregorianDate = dateData?.data?.gregorian
    ? `${dateData.data.gregorian.day} ${dateData.data.gregorian.month.en} ${dateData.data.gregorian.year}`
    : undefined;

  const hijriDate = dateData?.data?.hijri
    ? `${dateData.data.hijri.day} ${dateData.data.hijri.month.ar} ${dateData.data.hijri.year}`
    : undefined;

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
              propertyType={results.propertyType as any}
              city={results.formData.city}
              familySize={results.formData.familySize}
              financingOption={
                results.formData.financingOption as "Cash" | "Mortgage"
              }
              gregorianDate={gregorianDate}
              hijriDate={hijriDate}
              isLoading={isLoading}
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
