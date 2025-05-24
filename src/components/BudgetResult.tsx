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

  return (
    <Card className="w-full max-w-md shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader
        className={`bg-gradient-to-r ${getBgGradient()} text-white rounded-t-lg`}
      >
        <CardTitle className="text-center text-xl flex justify-center gap-2 items-center">
          <Building className="h-5 w-5" />
          {!isAffordable ? "تنبيه: تجاوز الميزانية" : "توصيات السكن المناسب"}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-4" dir="rtl">
        {!isAffordable && (
          <div className="bg-amber-50 p-4 rounded-md border border-amber-200 flex items-start gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">
                تجاوز الميزانية المتاحة
              </h3>
              <p className="text-sm text-amber-700">
                الميزانية المتاحة لك ({formatCurrency(maxBudget)}) أقل من السعر
                المتوقع للعقار المناسب ({formatCurrency(estimatedPrice)}). يرجى
                النظر في تعديل توقعاتك أو زيادة ميزانيتك.
              </p>
            </div>
          </div>
        )}

        <div className="border-b pb-3">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Home className="h-5 w-5 text-blue-600" />
            التوصية الأفضل لك
          </h3>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-md text-blue-900 mb-3">
              بناءً على تحليل بياناتك، ننصحك بـ:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  className="px-3 py-1"
                  variant={
                    ownershipRecommendation === "buy" ? "default" : "outline"
                  }
                >
                  {ownershipRecommendation === "buy" ? "التملك" : "الإيجار"}
                </Badge>
                <span className="text-sm font-medium text-gray-700">
                  {ownershipRecommendation === "buy"
                    ? "شراء عقار"
                    : "استئجار عقار"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="px-3 py-1" variant="outline">
                  {propertyType}
                </Badge>
                <span className="text-sm font-medium text-gray-700">
                  نوع العقار المناسب
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="px-3 py-1" variant="outline">
                  {district || "غير متوفر"}
                </Badge>
                <span className="text-sm font-medium text-gray-700">في حي</span>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="px-3 py-1" variant="outline">
                  {propertySize} م²
                </Badge>
                <span className="text-sm font-medium text-gray-700">
                  بمساحة تقريبية
                </span>
              </div>

              {ownershipRecommendation === "buy" ? (
                <div className="flex items-center gap-2">
                  <Badge className="px-3 py-1" variant="outline">
                    {formatCurrency(estimatedPrice)}
                  </Badge>
                  <span className="text-sm font-medium text-gray-700">
                    بسعر تقديري
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge className="px-3 py-1" variant="outline">
                    {formatCurrency(monthlyRent)}
                  </Badge>
                  <span className="text-sm font-medium text-gray-700">
                    بإيجار شهري تقديري
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible defaultValue="budget">
          <AccordionItem value="budget">
            <AccordionTrigger className="text-lg font-semibold flex items-center gap-2">
              <Coins className="h-5 w-5 text-blue-600" />
              <span>تفاصيل الميزانية</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="border-b pb-3">
                <h3 className="text-md font-semibold mb-1">الميزانية القصوى</h3>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(maxBudget)}
                </p>

                {ownershipRecommendation === "buy" && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>الدفعة الأولى:</span>
                      <span>
                        {formatCurrency(downPayment)} (
                        {Math.round((downPayment / maxBudget) * 100)}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>مبلغ التمويل:</span>
                      <span>{formatCurrency(loanAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>القسط الشهري:</span>
                      <span>{formatCurrency(monthlyPayment)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>مدة التمويل:</span>
                      <span>{loanTerm} سنة</span>
                    </div>
                  </div>
                )}

                <div className="mt-3 bg-blue-50 p-3 rounded-md text-sm text-blue-900">
                  <p className="font-semibold mb-1">
                    كيف تم احتساب هذه الميزانية:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {calculationSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-b pb-3">
                <h3 className="text-md font-semibold mb-1">
                  نسبة الاستقطاع من الدخل:
                </h3>
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded-full bg-gray-200 w-full">
                    <div
                      className={`h-2 rounded-full ${
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
                  <span className="text-sm font-medium">
                    {(affordabilityRatio * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {affordabilityRatio > 0.4
                    ? "نسبة مرتفعة، قد تشكل عبئًا ماليًا"
                    : affordabilityRatio > 0.35
                      ? "نسبة مقبولة، لكن قد تتطلب حذرًا في الإنفاق"
                      : "نسبة مثالية، تترك مجالًا للمصاريف الأخرى"}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="reasoning">
            <AccordionTrigger className="text-lg font-semibold flex items-center gap-2">
              <Calculator className="h-5 w-5 text-emerald-600" />
              <span>أسباب التوصية</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="border-b pb-3">
                <h3 className="text-md font-semibold mb-1">
                  لماذا نوصي بـ{" "}
                  {ownershipRecommendation === "buy" ? "التملك" : "الإيجار"}:
                </h3>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
                  {reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>

              <div className="border-b pb-3">
                <h3 className="text-md font-semibold mb-1">
                  لماذا نوصي بـ {propertyType} في {district}:
                </h3>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
                  {propertyReasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="personal">
            <AccordionTrigger className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span>معلوماتك الشخصية</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">العمر</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gray-600" />
                    <span className="font-medium">{age} سنة</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">
                    المتبقي للتقاعد
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gray-600" />
                    <span className="font-medium">
                      {yearsUntilRetirement} سنة
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">حجم الأسرة</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-gray-600" />
                    <span className="font-medium">
                      {familySize} {familySize > 1 ? "أفراد" : "فرد"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">
                    الغرف المطلوبة
                  </span>
                  <div className="flex items-center gap-1">
                    <Home className="h-3.5 w-3.5 text-gray-600" />
                    <span className="font-medium">{requiredRooms} غرف</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">المدينة</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-600" />
                    <span className="font-medium">{city}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">
                    منطقة العمل
                  </span>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-gray-600" />
                    <span className="font-medium">{workLocation}</span>
                  </div>
                </div>

                {mortgageInterestRate > 0 && (
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 mb-1">
                      نسبة الفائدة
                    </span>
                    <div className="flex items-center gap-1">
                      <Percent className="h-3.5 w-3.5 text-gray-600" />
                      <span className="font-medium">
                        {mortgageInterestRate}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {(gregorianDate || hijriDate) && (
          <div className="pt-2 text-center text-xs text-gray-500 border-t mt-4 pt-4">
            <div className="flex justify-center items-center gap-1 mb-1">
              <Calendar className="h-3 w-3" />
              <span>التاريخ الحالي:</span>
            </div>
            {hijriDate && <p>التاريخ الهجري: {hijriDate}</p>}
            {gregorianDate && <p>التاريخ الميلادي: {gregorianDate}</p>}
          </div>
        )}

        {isLoading && (
          <div className="text-center text-gray-500">
            جاري تحميل بيانات التاريخ...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
