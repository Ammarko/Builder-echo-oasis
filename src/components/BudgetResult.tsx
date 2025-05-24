import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyType, formatCurrency } from "@/lib/budget-calculator";
import { cityHousingData } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Home, Users, Calendar, Coins, Building } from "lucide-react";

interface BudgetResultProps {
  maxBudget: number;
  propertyType: PropertyType;
  city: string;
  familySize: number;
  financingOption: "Cash" | "Mortgage";
  gregorianDate?: string;
  hijriDate?: string;
  isLoading: boolean;
}

export const BudgetResult: React.FC<BudgetResultProps> = ({
  maxBudget,
  propertyType,
  city,
  familySize,
  financingOption,
  gregorianDate,
  hijriDate,
  isLoading,
}) => {
  // Get city-specific information if available
  const cityInfo = cityHousingData[city];

  // Background gradient based on property type
  const getBgGradient = () => {
    switch (propertyType) {
      case PropertyType.SMALL_APARTMENT:
        return "from-green-600 to-green-800";
      case PropertyType.MEDIUM_APARTMENT:
        return "from-blue-600 to-blue-800";
      case PropertyType.VILLA:
        return "from-purple-600 to-purple-800";
      case PropertyType.LUXURY:
        return "from-amber-500 to-amber-700";
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
          نتائج حاسبة الميزانية العقارية
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-4" dir="rtl">
        <div className="border-b pb-3">
          <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <Coins className="h-5 w-5 text-blue-600" />
            الميزانية القصوى
          </h3>
          <p className="text-2xl font-bold text-blue-700">
            {formatCurrency(maxBudget)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            بناءً على{" "}
            {financingOption === "Mortgage" ? "الرهن العقاري" : "الدفع النقدي"}
          </p>
          <div className="mt-2 bg-blue-50 p-3 rounded-md text-sm text-blue-900">
            <p className="font-semibold mb-1">كيف تم احتساب هذه الميزانية:</p>
            {financingOption === "Mortgage" ? (
              <ul className="list-disc list-inside space-y-1">
                <li>صافي الدخل = الدخل الشهري - الالتزامات الشهرية</li>
                <li>نسبة التمويل العقاري المتاحة = 35% من صافي الدخل</li>
                <li>قيمة القرض = نسبة التمويل × 200 (مضاعف القرض)</li>
                <li>
                  الميزانية القصوى = قيمة القرض الكلية التي يمكنك الحصول عليها
                </li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                <li>صافي الدخل = الدخل الشهري - الالتزامات الشهرية</li>
                <li>
                  الميزانية القصوى = صافي الدخل الشهري × 12 شهر �� 4 سنوات
                </li>
                <li>يفترض هذا المبلغ أنك ستدخر لمدة 4 سنوات للشراء نقدًا</li>
              </ul>
            )}
          </div>
        </div>

        <div className="border-b pb-3">
          <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <Home className="h-5 w-5 text-indigo-600" />
            نوع العقار الموصى به
          </h3>
          <Badge className="text-md px-3 py-1 mt-1" variant="outline">
            {propertyType}
          </Badge>
        </div>

        {city && cityInfo && (
          <div className="border-b pb-3">
            <h3 className="text-lg font-semibold mb-1">
              معلومات المدينة: {city}
            </h3>
            <p className="text-sm text-gray-600">
              متوسط أسعار العقارات: {formatCurrency(cityInfo.avgPrice)}
            </p>
            <p className="text-sm text-gray-600 mt-1">{cityInfo.description}</p>
          </div>
        )}

        <div className="border-b pb-3">
          <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            عدد أفراد الأسرة
          </h3>
          <p className="text-gray-700">
            {familySize} {familySize > 1 ? "أفراد" : "فرد"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {familySize >= 4
              ? "قد تحتاج إلى مساحة أكبر للعائلة"
              : "مناسب للمساحات المتوسطة"}
          </p>
        </div>

        {(gregorianDate || hijriDate) && (
          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-rose-600" />
              التاريخ الحالي
            </h3>
            {hijriDate && (
              <p className="text-sm text-gray-600">
                التاريخ الهجري: {hijriDate}
              </p>
            )}
            {gregorianDate && (
              <p className="text-sm text-gray-600">
                التاريخ الميلادي: {gregorianDate}
              </p>
            )}
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
