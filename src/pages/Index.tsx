import React, { useState } from "react";
import { RealEstateBudgetForm, BudgetFormValues } from "@/components/RealEstateBudgetForm";
import { BudgetResult } from "@/components/BudgetResult";
import { calculateMaxBudget, calculateRequiredRooms } from "@/lib/budget-calculator";
import { getPropertyRecommendation } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Home, TrendingUp, Shield } from "lucide-react";

const Index = () => {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (values: BudgetFormValues) => {
    setIsLoading(true);
    
    try {
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const netIncome = values.monthlyIncome - values.monthlyObligations;
      
      const budgetInfo = calculateMaxBudget(
        netIncome,
        values.age,
        values.expectedSalaryIncrease,
        values.mortgageInterestRate
      );
      
      const roomInfo = calculateRequiredRooms(values.familySize);
      
      const propertyRecommendation = getPropertyRecommendation(
        budgetInfo.maxBudget,
        values.currentCity,
        values.workLocation,
        values.familySize,
        values.requiredRooms,
        values.age
      );
      
      const yearsUntilRetirement = Math.max(0, 65 - values.age);
      
      setResult({
        ...budgetInfo,
        city: values.currentCity,
        workLocation: values.workLocation,
        familySize: values.familySize,
        requiredRooms: values.requiredRooms,
        age: values.age,
        yearsUntilRetirement,
        ...propertyRecommendation,
        isLoading: false,
        mortgageInterestRate: values.mortgageInterestRate,
      });
    } catch (error) {
      console.error("Error calculating budget:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetCalculator = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Calculator className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              حاسبة ميزانية العقارات
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              احسب ميزانيتك المثالية للعقار واحصل على توصيات مخصصة بناءً على وضعك المالي
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-3 space-x-reverse text-white/90">
                <Home className="h-6 w-6" />
                <span className="text-lg">توصيات عقارية ذكية</span>
              </div>
              <div className="flex items-center justify-center space-x-3 space-x-reverse text-white/90">
                <TrendingUp className="h-6 w-6" />
                <span className="text-lg">تحليل مالي دقيق</span>
              </div>
              <div className="flex items-center justify-center space-x-3 space-x-reverse text-white/90">
                <Shield className="h-6 w-6" />
                <span className="text-lg">حسابات آمنة وموثوقة</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!result ? (
          <div className="max-w-2xl mx-auto">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4 space-x-reverse">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <span className="mr-3 text-sm font-medium text-gray-700">أدخل بياناتك</span>
                </div>
                <div className="w-16 h-0.5 bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <span className="mr-3 text-sm font-medium text-gray-500">احصل على النتائج</span>
                </div>
              </div>
            </div>

            <div className="transform transition-all duration-500 hover:scale-[1.02]">
              <RealEstateBudgetForm onSubmit={handleFormSubmit} />
            </div>
            
            {/* Loading state */}
            {isLoading && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center px-6 py-3 bg-blue-50 rounded-full">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-blue-700 font-medium">جاري حساب ميزانيتك المثالية...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Progress indicator - completed */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-4 space-x-reverse">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    ✓
                  </div>
                  <span className="mr-3 text-sm font-medium text-green-700">تم إدخال البيانات</span>
                </div>
                <div className="w-16 h-0.5 bg-green-600"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    ✓
                  </div>
                  <span className="mr-3 text-sm font-medium text-green-700">النتائج جاهزة</span>
                </div>
              </div>
            </div>

            {/* Results section */}
            <div className="max-w-2xl mx-auto">
              <div className="transform transition-all duration-500 animate-in fade-in-50 slide-in-from-bottom-4">
                <BudgetResult {...result} />
              </div>
              
              {/* Action buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetCalculator}
                  className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                  حساب جديد
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                  طباعة النتائج
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Information Cards */}
        {!result && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">حسابات دقيقة</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  نستخدم أحدث المعايير المصرفية السعودية لحساب قدرتك الشرائية بدقة عالية
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Home className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">توصيات مخصصة</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  احصل على توصيات عقارية تناسب احتياجاتك وميزانيتك في مختلف مدن المملكة
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg md:col-span-2 lg:col-span-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">آمان وخصوصية</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  جميع بياناتك محمية ولا يتم حفظها أو مشاركتها مع أي جهة خارجية
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2025 حاسبة ميزانية العقارات. جميع الحقوق محفوظة.
            </p>
            <p className="text-xs mt-2 text-gray-500">
              هذه الحاسبة للأغراض التوضيحية فقط ولا تشكل استشارة مالية رسمية
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;