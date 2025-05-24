import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PropertyType,
  formatCurrency,
  formatPercentage,
} from "@/lib/budget-calculator";
import { cityHousingData, getRecommendedDistrict } from "@/lib/api";
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
  propertyType: string;
  city: string;
  futureCity: string;
  familySize: number;
  requiredRooms: number;
  age: number;
  financingOption: string;
  preferredPropertyType: string;
  ownershipPreference: string;
  expectedSalaryIncrease: number;
  yearsUntilRetirement: number;
  recommendedPropertyType: string;
  recommendedDistrict: string;
  estimatedPropertyPrice: number;
  isRentRecommended: boolean;
  rentReasons: string[];
  affordabilityRatio: number;
  gregorianDate?: string;
  hijriDate?: string;
  isLoading: boolean;
  isAffordable: boolean;
}

export const BudgetResult: React.FC<BudgetResultProps> = ({
  maxBudget,
  monthlyPayment,
  calculationSteps,
  propertyType,
  city,
  futureCity,
  familySize,
  requiredRooms,
  age,
  financingOption,
  preferredPropertyType,
  ownershipPreference,
  expectedSalaryIncrease,
  yearsUntilRetirement,
  recommendedPropertyType,
  recommendedDistrict,
  estimatedPropertyPrice,
  isRentRecommended,
  rentReasons,
  affordabilityRatio,
  gregorianDate,
  hijriDate,
  isLoading,
  isAffordable,
}) => {
  // Get city-specific information if available
  const cityInfo = cityHousingData[futureCity];

  // Background gradient based on affordability
  const getBgGradient = () => {
    if (!isAffordable) {
      return "from-amber-500 to-amber-700";
    }

    if (isRentRecommended) {
      return "from-teal-600 to-teal-800";
    }

    switch (recommendedPropertyType) {
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
          {!isAffordable ? "تنبيه: تجاوز الميزانية" : "نتائج التحليل العقاري"}
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
                المتوقع للعقار الذي ترغب به (
                {formatCurrency(estimatedPropertyPrice)}). يرجى النظر في تعديل
                توقعاتك أو زيادة ميزانيتك.
              </p>
            </div>
          </div>
        )}

        <Accordion type="single" collapsible defaultValue="budget">
          <AccordionItem value="budget">
            <AccordionTrigger className="text-lg font-semibold flex items-center gap-2">
              <Coins className="h-5 w-5 text-blue-600" />
              <span>الميزانية والتوصية</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="border-b pb-3">
                <h3 className="text-lg font-semibold mb-1">الميزانية القصوى</h3>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(maxBudget)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  بناءً على التمويل عبر: {financingOption}
                  {monthlyPayment > 0 &&
                    ` (قسط شهري: ${formatCurrency(monthlyPayment)})`}
                </p>

                <div className="mt-2 bg-blue-50 p-3 rounded-md text-sm text-blue-900">
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
                <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <Home className="h-5 w-5 text-indigo-600" />
                  التوصية العقارية
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">
                      نوع العقار الموصى به:
                    </span>
                    <Badge className="text-md px-3 py-1 mr-2" variant="outline">
                      {isRentRecommended ? "إيجار" : "تملك"} -{" "}
                      {recommendedPropertyType}
                    </Badge>
                  </div>

                  {recommendedDistrict && (
                    <div>
                      <span className="text-sm text-gray-600">
                        الحي الموصى به:
                      </span>
                      <Badge
                        className="text-md px-3 py-1 mr-2"
                        variant="outline"
                      >
                        {recommendedDistrict}
                      </Badge>
                    </div>
                  )}

                  <div>
                    <span className="text-sm text-gray-600">
                      السعر المتوقع:
                    </span>
                    <Badge
                      className="text-md px-3 py-1 mr-2"
                      variant={isAffordable ? "outline" : "destructive"}
                    >
                      {formatCurrency(estimatedPropertyPrice)}
                    </Badge>
                  </div>
                </div>

                {isRentRecommended && (
                  <div className="mt-3 bg-teal-50 p-3 rounded-md text-sm text-teal-900">
                    <p className="font-semibold mb-1">لماذا نوصي بالإيجار:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {rentReasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="analysis">
            <AccordionTrigger className="text-lg font-semibold flex items-center gap-2">
              <Calculator className="h-5 w-5 text-emerald-600" />
              <span>التحليل المالي</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
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

              <div className="border-b pb-3">
                <h3 className="text-md font-semibold mb-1">تحليل التقاعد:</h3>
                <p className="text-sm text-gray-700">
                  العمر الحالي: <span className="font-medium">{age} سنة</span>
                </p>
                <p className="text-sm text-gray-700">
                  الفترة المتبقية حتى التقاعد:{" "}
                  <span className="font-medium">
                    {yearsUntilRetirement} سنة
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  معدل الزيادة السنوية المتوقعة:{" "}
                  <span className="font-medium">{expectedSalaryIncrease}%</span>
                </p>

                {financingOption === "تمويل عقاري" && (
                  <div className="mt-2 bg-blue-50 p-2 rounded-md text-sm">
                    <p>
                      {yearsUntilRetirement < 15
                        ? "اقتراب التقاعد يتطلب خطة مالية حذرة للقرض العقاري"
                        : "لديك وقت كافٍ قبل التقاعد لسداد القرض العقاري"}
                    </p>
                  </div>
                )}
              </div>

              {cityInfo && (
                <div className="border-b pb-3">
                  <h3 className="text-md font-semibold mb-1">
                    تحليل سوق العقار:
                  </h3>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <p className="text-sm text-gray-700">
                      مدينة الاستقرار:{" "}
                      <span className="font-medium">{futureCity}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Percent className="h-4 w-4 text-gray-600" />
                    <p className="text-sm text-gray-700">
                      معدل التضخم العقاري السنوي:{" "}
                      <span className="font-medium">
                        {formatPercentage(cityInfo.inflationRate * 100)}
                      </span>
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {cityInfo.description}
                  </p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="personal">
            <AccordionTrigger className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span>متطلبات الأسرة</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="border-b pb-3">
                <h3 className="text-md font-semibold mb-1">
                  حجم الأسرة والمتطلبات:
                </h3>
                <p className="text-sm text-gray-700">
                  عدد أفراد الأسرة:{" "}
                  <span className="font-medium">
                    {familySize} {familySize > 1 ? "أفراد" : "فرد"}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  عدد الغرف المطلوبة:{" "}
                  <span className="font-medium">{requiredRooms} غرف</span>
                </p>

                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    التوافق مع المتطلبات:
                  </h4>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          familySize > requiredRooms * 2
                            ? "bg-red-500"
                            : familySize > requiredRooms * 1.5
                              ? "bg-amber-500"
                              : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min((requiredRooms / (familySize * 0.5)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {familySize > requiredRooms * 2
                      ? "عدد الغرف قد لا يكون كافيًا لحجم الأسرة"
                      : familySize > requiredRooms * 1.5
                        ? "عدد الغرف مقبول لكن قد تحتاج لمساحة أكبر"
                        : "عدد الغرف مناسب لحجم الأسرة"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-md font-semibold mb-1">التفضيلات:</h3>
                <p className="text-sm text-gray-700">
                  نوع العقار المفضل:{" "}
                  <span className="font-medium">{preferredPropertyType}</span>
                </p>
                <p className="text-sm text-gray-700">
                  تفضيل التملك/الإيجار:{" "}
                  <span className="font-medium">
                    {ownershipPreference === "buy" ? "تملك" : "إيجار"}
                  </span>
                </p>

                {preferredPropertyType !== recommendedPropertyType && (
                  <div className="mt-2 bg-amber-50 p-2 rounded-md text-sm">
                    <p>
                      ملاحظة: نوع العقار المفضل لديك ({preferredPropertyType})
                      يختلف عن توصيتنا ({recommendedPropertyType}) بناءً على
                      تحليل ميزانيتك واحتياجاتك.
                    </p>
                  </div>
                )}

                {ownershipPreference === "buy" && isRentRecommended && (
                  <div className="mt-2 bg-amber-50 p-2 rounded-md text-sm">
                    <p>
                      ملاحظة: رغم تفضيلك للتملك، قد يكون الإيجار أفضل لك حاليًا
                      بناءً على تحليل وضعك المالي والعمري.
                    </p>
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
