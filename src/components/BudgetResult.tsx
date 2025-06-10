import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/budget-calculator";
import { cityHousingData } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Users,
  Calendar,
  Coins,
  Building,
  MapPin,
  Calculator,
  ChevronDown,
  AlertTriangle,
  Percent,
  Briefcase,
  Clock,
  CreditCard,
  CheckCircle,
  TrendingUp,
  Shield,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface BudgetResultProps {
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
  gregorianDate?: string;
  hijriDate?: string;
  isLoading: boolean;
  isAffordable: boolean;
  mortgageInterestRate: number;
}

export const BudgetResult: React.FC<BudgetResultProps> = ({
  maxBudget,
  monthlyPayment,
  calculationSteps,
  city,
  workLocation,
  familySize,
  requiredRooms,
  age,
  yearsUntilRetirement,
  district,
  propertyType,
  propertySize,
  estimatedPrice,
  monthlyRent,
  ownershipRecommendation,
  financingOption,
  loanAmount,
  loanTerm,
  downPayment,
  affordabilityRatio,
  reasons,
  propertyReasons,
  gregorianDate,
  hijriDate,
  isLoading,
  isAffordable,
  mortgageInterestRate,
}) => {
  // Get city-specific information if available
  const cityInfo = cityHousingData[city];

  // Background gradient based on affordability
  const getBgGradient = () => {
    if (!isAffordable) {
      return "from-amber-500 to-amber-700";
    }

    if (ownershipRecommendation === "rent") {
      return "from-teal-600 to-teal-800";
    }

    switch (propertyType) {
      case "شقة":
        return "from-green-600 to-green-800";
      case "فيلا":
        return "from-purple-600 to-purple-800";
      case "دوبلكس":
        return "from-indigo-600 to-indigo-800";
      default:
        return "from-blue-600 to-blue-800";
    }
  };

  const getAffordabilityColor = () => {
    if (affordabilityRatio > 0.4) return "text-red-600 bg-red-50 border-red-200";
    if (affordabilityRatio > 0.35) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  const getAffordabilityIcon = () => {
    if (affordabilityRatio > 0.4) return <AlertTriangle className="h-5 w-5" />;
    if (affordabilityRatio > 0.35) return <Clock className="h-5 w-5" />;
    return <CheckCircle className="h-5 w-5" />;
  };

  return (
    <Card className="w-full max-w-2xl shadow-2xl animate-in fade-in-50 duration-700 border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader
        className={`bg-gradient-to-r ${getBgGradient()} text-white rounded-t-lg relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative">
          <CardTitle className="text-center text-2xl flex justify-center gap-3 items-center">
            <Building className="h-6 w-6" />
            {!isAffordable ? "تنبيه: تجاوز الميزانية" : "توصيات السكن المناسب"}
          </CardTitle>
          <p className="text-center text-white/90 mt-2 text-sm">
            {isAffordable 
              ? "تم تحليل بياناتك بنجاح وإعداد التوصيات المناسبة"
              : "يرجى مراجعة الميزانية والتوقعات"
            }
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
      </CardHeader>

      <CardContent className="pt-8 space-y-6" dir="rtl">
        {!isAffordable && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border-2 border-amber-200 flex items-start gap-4 mb-6 shadow-lg">
            <div className="p-2 bg-amber-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-800 mb-2 text-lg">
                تجاوز الميزانية المتاحة
              </h3>
              <p className="text-amber-700 leading-relaxed">
                الميزانية المتاحة لك ({formatCurrency(maxBudget)}) أقل من السعر
                المتوقع للعقار المناسب ({formatCurrency(estimatedPrice)}). يرجى
                النظر في تعديل توقعاتك أو زيادة ميزانيتك.
              </p>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-blue-900">
            <Home className="h-6 w-6" />
            التوصية الأفضل لك
          </h3>
          <div className="space-y-4">
            <p className="text-blue-800 mb-4 text-lg leading-relaxed">
              بناءً على تحليل بياناتك المالية والشخصية، ننصحك بـ:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                <Badge
                  className={`px-4 py-2 text-sm font-semibold ${
                    ownershipRecommendation === "buy" 
                      ? "bg-green-600 text-white" 
                      : "bg-teal-600 text-white"
                  }`}
                >
                  {ownershipRecommendation === "buy" ? "التملك" : "الإيجار"}
                </Badge>
                <span className="text-sm font-medium text-gray-700">
                  {ownershipRecommendation === "buy"
                    ? "شراء عقار"
                    : "استئجار عقار"}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                <Badge className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white">
                  {propertyType}
                </Badge>
                <span className="text-sm font-medium text-gray-700">
                  نوع العقار المناسب
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                <Badge className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white">
                  {district || "غير متوفر"}
                </Badge>
                <span className="text-sm font-medium text-gray-700">في حي</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                <Badge className="px-4 py-2 text-sm font-semibold bg-orange-600 text-white">
                  {propertySize} م²
                </Badge>
                <span className="text-sm font-medium text-gray-700">
                  بمساحة تقريبية
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-white/70 rounded-lg">
              {ownershipRecommendation === "buy" ? (
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-800">السعر التقديري:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(estimatedPrice)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-800">الإيجار الشهري التقديري:</span>
                  <span className="text-2xl font-bold text-teal-600">
                    {formatCurrency(monthlyRent)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible defaultValue="budget" className="space-y-4">
          <AccordionItem value="budget" className="border-2 border-blue-100 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
            <AccordionTrigger className="text-lg font-semibold flex items-center gap-3 px-6 py-4 text-blue-800 hover:text-blue-900">
              <Coins className="h-5 w-5" />
              <span>تفاصيل الميزانية</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/70 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2 text-gray-800">الميزانية القصوى</h4>
                  <p className="text-3xl font-bold text-blue-700">
                    {formatCurrency(maxBudget)}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border-2 ${getAffordabilityColor()}`}>
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    {getAffordabilityIcon()}
                    نسبة الاستقطاع من الدخل
                  </h4>
                  <p className="text-2xl font-bold">
                    {(affordabilityRatio * 100).toFixed(1)}%
                  </p>
                  <div className="mt-2 h-3 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        affordabilityRatio > 0.4
                          ? "bg-red-500"
                          : affordabilityRatio > 0.35
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(affordabilityRatio * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {ownershipRecommendation === "buy" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/70 rounded-lg">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>الدفعة الأولى:</span>
                      <span className="font-semibold">
                        {formatCurrency(downPayment)} (
                        {Math.round((downPayment / maxBudget) * 100)}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>مبلغ التمويل:</span>
                      <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>القسط الشهري:</span>
                      <span className="font-semibold">{formatCurrency(monthlyPayment)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>مدة التمويل:</span>
                      <span className="font-semibold">{loanTerm} سنة</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/70 rounded-lg">
                    <h5 className="font-semibold mb-3 text-gray-800">كيف تم احتساب هذه الميزانية:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {calculationSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="reasoning" className="border-2 border-green-100 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
            <AccordionTrigger className="text-lg font-semibold flex items-center gap-3 px-6 py-4 text-green-800 hover:text-green-900">
              <TrendingUp className="h-5 w-5" />
              <span>أسباب التوصية</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 px-6 pb-6">
              <div className="p-4 bg-white/70 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">
                  لماذا نوصي بـ{" "}
                  {ownershipRecommendation === "buy" ? "التملك" : "الإيجار"}:
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {reasons.map((reason, index) => (
                    <li key={index} className="leading-relaxed">{reason}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-white/70 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">
                  لماذا نوصي بـ {propertyType} في {district}:
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {propertyReasons.map((reason, index) => (
                    <li key={index} className="leading-relaxed">{reason}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="personal" className="border-2 border-purple-100 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
            <AccordionTrigger className="text-lg font-semibold flex items-center gap-3 px-6 py-4 text-purple-800 hover:text-purple-900">
              <Users className="h-5 w-5" />
              <span>معلوماتك الشخصية</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 px-6 pb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-white/70 rounded-lg text-center">
                  <Clock className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-500 block">العمر</span>
                  <span className="font-semibold text-gray-800">{age} سنة</span>
                </div>

                <div className="p-3 bg-white/70 rounded-lg text-center">
                  <Calendar className="h-5 w-5 text-green-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-500 block">المتبقي للتقاعد</span>
                  <span className="font-semibold text-gray-800">{yearsUntilRetirement} سنة</span>
                </div>

                <div className="p-3 bg-white/70 rounded-lg text-center">
                  <Users className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-500 block">حجم الأسرة</span>
                  <span className="font-semibold text-gray-800">
                    {familySize} {familySize > 1 ? "أفراد" : "فرد"}
                  </span>
                </div>

                <div className="p-3 bg-white/70 rounded-lg text-center">
                  <Home className="h-5 w-5 text-orange-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-500 block">الغرف المطلوبة</span>
                  <span className="font-semibold text-gray-800">{requiredRooms} غرف</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white/70 rounded-lg text-center">
                  <MapPin className="h-5 w-5 text-red-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-500 block">المدينة</span>
                  <span className="font-semibold text-gray-800">{city}</span>
                </div>

                <div className="p-3 bg-white/70 rounded-lg text-center">
                  <Briefcase className="h-5 w-5 text-indigo-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-500 block">منطقة العمل</span>
                  <span className="font-semibold text-gray-800">{workLocation}</span>
                </div>

                {mortgageInterestRate > 0 && (
                  <div className="p-3 bg-white/70 rounded-lg text-center">
                    <Percent className="h-5 w-5 text-yellow-600 mx-auto mb-2" />
                    <span className="text-xs text-gray-500 block">نسبة الفائدة</span>
                    <span className="font-semibold text-gray-800">{mortgageInterestRate}%</span>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {(gregorianDate || hijriDate) && (
          <div className="pt-4 text-center text-sm text-gray-500 border-t-2 border-gray-100">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">التاريخ الحالي:</span>
            </div>
            <div className="space-y-1">
              {hijriDate && <p className="text-gray-600">التاريخ الهجري: {hijriDate}</p>}
              {gregorianDate && <p className="text-gray-600">التاريخ الميلادي: {gregorianDate}</p>}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center text-gray-500 py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            جاري تحميل بيانات التاريخ...
          </div>
        )}
      </CardContent>
    </Card>
  );
};