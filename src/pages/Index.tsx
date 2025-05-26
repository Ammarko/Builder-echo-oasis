import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  MapPin,
  Coins,
  Calculator,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// بيانات المدن والمناطق
const cityData = {
  الرياض: {
    regions: [
      "شمال الرياض",
      "جنوب الرياض",
      "شرق الرياض",
      "غرب الرياض",
      "وسط الرياض",
    ],
    avgPrices: {
      شقة: { price: 850000, size: 120 },
      فيلا: { price: 1800000, size: 400 },
      دوبلكس: { price: 1200000, size: 250 },
    },
  },
  جدة: {
    regions: ["شمال جدة", "جنوب جدة", "شرق جدة", "غرب جدة", "وسط جدة"],
    avgPrices: {
      شقة: { price: 750000, size: 110 },
      فيلا: { price: 1600000, size: 380 },
      دوبلكس: { price: 1100000, size: 240 },
    },
  },
  "مكة المكرمة": {
    regions: ["المنطقة المركزية", "العزيزية", "الششة", "النسيم", "العوالي"],
    avgPrices: {
      شقة: { price: 950000, size: 100 },
      فيلا: { price: 2000000, size: 350 },
      دوبلكس: { price: 1400000, size: 220 },
    },
  },
  "المدينة المنورة": {
    regions: ["المنطقة المركزية", "قباء", "العوالي", "الحرة الشرقية", "النخيل"],
    avgPrices: {
      شقة: { price: 650000, size: 115 },
      فيلا: { price: 1400000, size: 370 },
      دوبلكس: { price: 950000, size: 230 },
    },
  },
  الدمام: {
    regions: [
      "شمال الدمام",
      "جنوب الدمام",
      "شرق الدمام",
      "غرب الدمام",
      "وسط الدمام",
    ],
    avgPrices: {
      شقة: { price: 550000, size: 125 },
      فيلا: { price: 1200000, size: 390 },
      دوبلكس: { price: 800000, size: 240 },
    },
  },
};

// نموذج التحقق من البيانات
const formSchema = z.object({
  city: z.string().min(1, "يرجى اختيار المدينة"),
  region: z.string().min(1, "يرجى اختيار المنطقة"),
  monthlyIncome: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .positive("يجب أن يكون الدخل الشهري رقماً موجباً")
    .min(1000, "يجب أن يكون الدخل الشهري على الأقل 1000 ريال"),
  monthlyObligations: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .min(0, "لا يمكن أن تكون الالتزامات الشهرية رقماً سالباً"),
  familySize: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .int("يجب أن يكون عدد أفراد الأسرة رقماً صحيحاً")
    .min(1, "يجب أن يكون عدد أفراد الأسرة على الأقل 1")
    .max(15, "يرجى التحقق من عدد أفراد الأسرة"),
  requiredRooms: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .int("يجب أن يكون عدد الغرف رقماً صحيحاً")
    .min(1, "يجب أن يكون عدد الغرف على الأقل 1")
    .max(8, "يرجى التحقق من عدد الغرف المطلوبة"),
  financingType: z.enum(["cash", "mortgage"], {
    invalid_type_error: "يرجى اختيار نوع التمويل",
  }),
  interestRate: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .min(0, "لا يمكن أن تكون نسبة الفائدة رقماً سالباً")
    .max(15, "يرجى التحقق من نسبة الفائدة")
    .optional(),
  loanYears: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .int("يجب أن يكون عدد سنوات التمويل رقماً صحيحاً")
    .min(1, "يجب أن يكون عدد سنوات التمويل على الأقل سنة واحدة")
    .max(30, "الحد الأقصى لسنوات التمويل هو 30 سنة")
    .optional(),
  downPayment: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .min(0, "لا يمكن أن تكون الدفعة الأولى رقماً سالباً")
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

// دالة تنسيق العملة
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// دالة حساب نوع العقار المناسب
const getRecommendedPropertyType = (
  familySize: number,
  requiredRooms: number,
): "شقة" | "دوبلكس" | "فيلا" => {
  if (familySize >= 6 || requiredRooms >= 4) {
    return "فيلا";
  } else if (familySize >= 4 || requiredRooms >= 3) {
    return "دوبلكس";
  } else {
    return "شقة";
  }
};

// دالة حساب الميزانية
const calculateBudget = (data: FormValues) => {
  const netIncome = data.monthlyIncome - data.monthlyObligations;
  const propertyType = getRecommendedPropertyType(
    data.familySize,
    data.requiredRooms,
  );
  const cityInfo = cityData[data.city as keyof typeof cityData];
  const propertyInfo = cityInfo.avgPrices[propertyType];

  let maxBudget = 0;
  let monthlyPayment = 0;
  let calculationSteps: string[] = [];

  if (data.financingType === "cash") {
    // حساب الكاش: 4 سنوات من الادخار
    const monthlySavings = netIncome * 0.35; // 35% من صافي الدخل للادخار
    maxBudget = monthlySavings * 12 * 4; // 4 سنوات
    calculationSteps = [
      `صافي الدخل الشهري: ${formatCurrency(netIncome)}`,
      `قدرة الادخار الشهرية (35%): ${formatCurrency(monthlySavings)}`,
      `إجمالي المدخرات خلال 4 سنوات: ${formatCurrency(maxBudget)}`,
    ];
  } else {
    // حساب التمويل العقاري
    const maxMonthlyPayment = netIncome * 0.35; // 35% من صافي الدخل
    const interestRate = (data.interestRate || 4) / 100 / 12; // معدل الفائدة الشهري
    const loanTerms = (data.loanYears || 25) * 12; // عدد الأشهر

    // حساب القرض الأقصى باستخدام معادلة القرض
    const maxLoanAmount =
      maxMonthlyPayment *
      ((1 - Math.pow(1 + interestRate, -loanTerms)) / interestRate);

    // إضافة الدفعة الأولى إن وجدت
    const downPayment = data.downPayment || maxLoanAmount * 0.2; // 20% افتراضي
    maxBudget = maxLoanAmount + downPayment;
    monthlyPayment = maxMonthlyPayment;

    calculationSteps = [
      `صافي الدخل الشهري: ${formatCurrency(netIncome)}`,
      `الحد الأقصى للقسط الشهري (35%): ${formatCurrency(maxMonthlyPayment)}`,
      `معدل الفائدة: ${data.interestRate || 4}%`,
      `مدة التمويل: ${data.loanYears || 25} سنة`,
      `مبلغ القرض: ${formatCurrency(maxLoanAmount)}`,
      `الدفعة الأولى: ${formatCurrency(downPayment)}`,
      `إجمالي الميزانية: ${formatCurrency(maxBudget)}`,
    ];
  }

  const isAffordable = maxBudget >= propertyInfo.price;
  const recommendedRegion = data.region;

  return {
    maxBudget,
    monthlyPayment,
    propertyType,
    propertyInfo,
    recommendedRegion,
    isAffordable,
    calculationSteps,
    netIncome,
    city: data.city,
  };
};

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
      region: "",
      monthlyIncome: 0,
      monthlyObligations: 0,
      familySize: 1,
      requiredRooms: 2,
      financingType: "mortgage",
      interestRate: 4,
      loanYears: 25,
      downPayment: 0,
    },
  });

  // تحديث المناطق عند تغيير المدينة
  const selectedCity = form.watch("city");
  const selectedFinancing = form.watch("financingType");
  const familySize = form.watch("familySize");

  React.useEffect(() => {
    if (selectedCity) {
      form.setValue("region", "");
    }
  }, [selectedCity]);

  // تحديث عدد الغرف المطلوبة بناءً على حجم الأسرة
  React.useEffect(() => {
    if (familySize) {
      let recommendedRooms = 1;
      if (familySize <= 2) recommendedRooms = 1;
      else if (familySize <= 4) recommendedRooms = 2;
      else if (familySize <= 6) recommendedRooms = 3;
      else recommendedRooms = 4;

      form.setValue("requiredRooms", recommendedRooms);
    }
  }, [familySize]);

  const onSubmit = (data: FormValues) => {
    const calculation = calculateBudget(data);
    setResults(calculation);
    setShowResults(true);
  };

  const resetForm = () => {
    setShowResults(false);
    setResults(null);
  };

  if (showResults && results) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4"
        dir="rtl"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-4">
              نتائج حاسبة ميزانية العقارات
            </h1>
          </div>

          {/* التوصية النهائية */}
          <Card className="mb-6 shadow-lg">
            <CardHeader
              className={`text-white ${results.isAffordable ? "bg-gradient-to-r from-green-600 to-green-800" : "bg-gradient-to-r from-amber-500 to-amber-700"}`}
            >
              <CardTitle className="text-center text-xl flex justify-center gap-2 items-center">
                {results.isAffordable ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <AlertTriangle className="h-6 w-6" />
                )}
                {results.isAffordable
                  ? "التوصية النهائية"
                  : "تنبيه: تجاوز الميزانية"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {results.isAffordable ? (
                <div className="bg-green-50 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
                    🏠 العقار الأنسب لك
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-green-600" />
                        <span className="font-semibold">نوع العقار:</span>
                        <Badge className="bg-green-100 text-green-800">
                          {results.propertyType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                        <span className="font-semibold">الموقع المقترح:</span>
                        <span>
                          {results.recommendedRegion} - {results.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Coins className="h-5 w-5 text-green-600" />
                        <span className="font-semibold">السعر المقدر:</span>
                        <span className="text-lg font-bold text-green-700">
                          {formatCurrency(results.propertyInfo.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          المساحة التقديرية:
                        </span>
                        <span>{results.propertyInfo.size} متر مربع</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">الغرض:</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          {selectedFinancing === "cash"
                            ? "شراء كاش"
                            : "تمليك بالتمويل"}
                        </Badge>
                      </div>
                      {results.monthlyPayment > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">القسط الشهري:</span>
                          <span className="text-lg font-bold text-blue-700">
                            {formatCurrency(results.monthlyPayment)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">ميزانيتك:</span>
                        <span className="text-lg font-bold text-green-700">
                          {formatCurrency(results.maxBudget)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 p-6 rounded-lg">
                  <h2 className="text-xl font-bold text-amber-800 mb-4 text-center">
                    ⚠️ الشراء غير ممكن حالياً
                  </h2>
                  <div className="space-y-3">
                    <p className="text-amber-700">
                      ميزانيتك المتاحة ({formatCurrency(results.maxBudget)}) أقل
                      من سعر {results.propertyType}
                      في {results.recommendedRegion} (
                      {formatCurrency(results.propertyInfo.price)})
                    </p>

                    <div className="bg-blue-50 p-4 rounded-lg mt-4">
                      <h3 className="font-semibold text-blue-800 mb-2">
                        💡 البديل المقترح: الإيجار
                      </h3>
                      <div className="space-y-2 text-blue-700">
                        <p>
                          إيجار {results.propertyType} في{" "}
                          {results.recommendedRegion}:
                        </p>
                        <p className="text-lg font-bold">
                          {formatCurrency(
                            Math.round(
                              (results.propertyInfo.price * 0.05) / 12,
                            ),
                          )}{" "}
                          شهرياً
                        </p>
                        <p className="text-sm">
                          (تقدير بناءً على 5% عائد سنوي من قيمة العقار)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* تفاصيل الحسابات */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                تفاصيل الحسابات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.calculationSteps.map((step: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span>{step.split(":")[0]}:</span>
                    <span className="font-semibold">{step.split(":")[1]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* مبررات التوصية */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>مبررات التوصية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p>
                    بناءً على عدد أفراد الأسرة ({familySize} أفراد) وعدد الغرف
                    المطلوبة ({form.getValues("requiredRooms")} غرف)، تم اختيار{" "}
                    {results.propertyType}
                    بمساحة {results.propertyInfo.size} متر مربع.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p>
                    الموقع في {results.recommendedRegion} تم اختياره بناءً على
                    المنطقة الجغرافية المحددة والميزانية المتاحة.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p>
                    نسبة الاستقطاع من الدخل:
                    {(
                      (results.monthlyPayment / results.netIncome) *
                      100
                    ).toFixed(1)}
                    %
                    {results.monthlyPayment / results.netIncome <= 0.35
                      ? " (نسبة مثالية)"
                      : " (نسبة مرتفعة)"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* زر إعادة الحساب */}
          <div className="text-center">
            <Button
              onClick={resetForm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              <ArrowRight className="h-5 w-5 ml-2" />
              إعادة الحساب
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
          <CardTitle className="text-center text-2xl">
            🏠 حاسبة ميزانية العقارات
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              dir="rtl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المدينة</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المدينة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(cityData).map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المنطقة</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedCity}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المنطقة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedCity &&
                            cityData[
                              selectedCity as keyof typeof cityData
                            ]?.regions.map((region) => (
                              <SelectItem key={region} value={region}>
                                {region}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الدخل الشهري (ريال)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="أدخل دخلك الشهري"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyObligations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الالتزامات الشهرية (ريال)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="الأقساط والالتزامات"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="familySize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عدد أفراد الأسرة</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="عدد أ��راد الأسرة"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiredRooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عدد الغرف المطلوبة</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="عدد الغرف"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        يتم تحديدها تلقائياً بناءً على حجم الأسرة
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="financingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع التمويل</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع التمويل" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">كاش</SelectItem>
                        <SelectItem value="mortgage">تمويل عقاري</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedFinancing === "mortgage" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نسبة الفائدة (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="4"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>افتراضية: 4%</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="loanYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عدد سنوات التمويل</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="25"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="downPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الدفعة الأولى (اختياري)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="200000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          اتركه فارغاً للحساب التلقائي
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              >
                احسب الميزانية والتوصيات
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
