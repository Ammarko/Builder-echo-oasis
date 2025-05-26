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
  Info,
  Building,
} from "lucide-react";

// بيانات المدن والمناطق مع أحياء محددة
const cityData = {
  الرياض: {
    regions: [
      "شمال الرياض",
      "جنوب الرياض",
      "شرق الرياض",
      "غرب الرياض",
      "وسط الرياض",
    ],
    neighborhoods: {
      "شمال الرياض": ["القيروان", "النرجس", "الياسمين", "الملقا", "النفل"],
      "جنوب الرياض": [
        "الشفا",
        "العزيزية",
        "النسيم",
        "الدار البيضاء",
        "الفيحاء",
      ],
      "شرق الرياض": ["الروضة", "الرواد", "الربيع", "الريان", "النهضة"],
      "غرب الرياض": ["العقيق", "الصحافة", "العليا", "الرحمانية", "عرقة"],
      "وسط الرياض": ["الديرة", "المرقب", "العود", "المربع", "الرميلة"],
    },
    avgPrices: {
      شقة: { price: 850000, size: 120 },
      فيلا: { price: 1800000, size: 400 },
      دوبلكس: { price: 1200000, size: 250 },
    },
  },
  جدة: {
    regions: ["شمال جدة", "جنوب جدة", "شرق جدة", "غرب جدة", "وسط جدة"],
    neighborhoods: {
      "شمال جدة": ["الشاطئ", "أبحر", "ذهبان", "النعيم", "الفيصلية"],
      "جنوب جدة": ["البوادي", "العزيزية", "القريات", "المحاميد", "الحرازات"],
      "شرق جدة": ["النزهة", "الروضة", "الفيصلية", "النخيل", "الروابي"],
      "غرب جدة": ["البلد", "الشرفية", "الحمراء", "الزهراء", "السلامة"],
      "وسط جدة": ["العزيزية", "الروضة", "الفيصلية", "النزهة", "الصفا"],
    },
    avgPrices: {
      شقة: { price: 750000, size: 110 },
      فيلا: { price: 1600000, size: 380 },
      دوبلكس: { price: 1100000, size: 240 },
    },
  },
  "مكة المكرمة": {
    regions: ["المنطقة المركزية", "العزيزية", "الششة", "النسيم", "العوالي"],
    neighborhoods: {
      "المنطقة المركزية": ["العزيزية", "النسيم", "العوالي", "الششة", "الضيافة"],
      العزيزية: ["الششة", "النسيم", "الحجون", "التيسير", "المرسلات"],
      الششة: ["العزيزية", "النسيم", "الضيافة", "العوالي", "المرسلات"],
      النسيم: ["الششة", "العزيزية", "العوالي", "الضيافة", "المرسلات"],
      العوالي: ["الششة", "النسيم", "الضيافة", "المرسلات", "التيسير"],
    },
    avgPrices: {
      شقة: { price: 950000, size: 100 },
      فيلا: { price: 2000000, size: 350 },
      دوبلكس: { price: 1400000, size: 220 },
    },
  },
  "المدينة المنورة": {
    regions: ["المنطقة المركزية", "قباء", "العوالي", "الحرة الشرقية", "النخيل"],
    neighborhoods: {
      "المنطقة المركزية": [
        "قباء",
        "العوالي",
        "الحرة الشرقية",
        "النخيل",
        "بني حارثة",
      ],
      قباء: ["العوالي", "الحرة الشرقية", "النخيل", "بني حارثة", "الأنصار"],
      العوالي: ["قباء", "الحرة الشرقية", "النخيل", "بني حارثة", "الأنصار"],
      "الحرة الشرقية": ["قباء", "العوالي", "النخيل", "بني حارثة", "الأنصار"],
      النخيل: ["قباء", "ال��والي", "الحرة الشرقية", "بني حارثة", "الأنصار"],
    },
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
    neighborhoods: {
      "شمال الدمام": ["الشاطئ", "الحمراء", "النورس", "الناصرية", "طيبة"],
      "جنوب الدمام": [
        "عبد الله فؤاد",
        "الفيصلية",
        "البادية",
        "غرناطة",
        "الجلوية",
      ],
      "شرق الدمام": ["الشاطئ", "البحيرة", "الهدا", "المنار", "الصفا"],
      "غرب الدمام": ["النزهة", "الروضة", "الفنار", "أحد", "المزروعية"],
      "وسط الدمام": ["الطبيشي", "القزاز", "الدواسر", "الخليج", "الفيصلية"],
    },
    avgPrices: {
      شقة: { price: 550000, size: 125 },
      فيلا: { price: 1200000, size: 390 },
      دوبلكس: { price: 800000, size: 240 },
    },
  },
};

// نموذج التحقق من البيانات
const formSchema = z.object({
  monthlyIncome: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .positive("يجب أن يكون الدخل الشهري رقماً موجباً")
    .min(1000, "يجب أن يكون الدخل الشهري على الأقل 1000 ريال"),
  monthlyObligations: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .min(0, "لا يمكن أن تكون الالتزامات الشهرية رقماً سالباً"),
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
    .max(30, "الحد ��لأقصى لسنوات التمويل هو 30 سنة")
    .optional(),
  hasDownPayment: z.enum(["yes", "no"], {
    invalid_type_error: "يرجى اختيار ما إذا كان لديك دفعة أولى",
  }),
  downPayment: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .min(0, "لا يمكن أن تكون الدفعة الأولى رقماً سالباً")
    .optional(),
  city: z.string().min(1, "يرجى اختيار المدينة"),
  region: z.string().min(1, "يرجى اختيار المنطقة"),
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
});

type FormValues = z.infer<typeof formSchema>;

// دالة ��نسيق العملة
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

// دالة اختيار أفضل حي
const getBestNeighborhood = (
  city: string,
  region: string,
  budget: number,
  propertyType: string,
) => {
  const cityInfo = cityData[city as keyof typeof cityData];
  if (
    !cityInfo ||
    !cityInfo.neighborhoods[region as keyof typeof cityInfo.neighborhoods]
  ) {
    return (
      cityInfo?.neighborhoods[
        Object.keys(
          cityInfo.neighborhoods,
        )[0] as keyof typeof cityInfo.neighborhoods
      ]?.[0] || "غير محدد"
    );
  }

  const neighborhoods =
    cityInfo.neighborhoods[region as keyof typeof cityInfo.neighborhoods];
  const propertyPrice =
    cityInfo.avgPrices[propertyType as keyof typeof cityInfo.avgPrices]
      ?.price || 0;

  // اختيار الحي الأول كافتراضي (يمكن تطوير هذا المنطق أكثر)
  return neighborhoods[0];
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
  const bestNeighborhood = getBestNeighborhood(
    data.city,
    data.region,
    0,
    propertyType,
  );

  let maxBudget = 0;
  let monthlyPayment = 0;
  let calculationSteps: Array<{
    title: string;
    value: string;
    explanation: string;
  }> = [];
  let loanAmount = 0;
  let actualDownPayment = 0;
  let personalLoanAmount = 0;

  if (data.financingType === "cash") {
    // حساب الكاش: 4 سنوات من الادخار
    const monthlySavings = netIncome * 0.35; // 35% من صافي الدخل للادخار
    maxBudget = monthlySavings * 12 * 4; // 4 سنوات

    calculationSteps = [
      {
        title: `صافي الدخل الشهري: ${formatCurrency(netIncome)}`,
        value: formatCurrency(netIncome),
        explanation: "تم حسابه بطرح الالتزامات الشهرية من إجمالي الدخل الشهري",
      },
      {
        title: `قدرة الادخار الشهرية (35%): ${formatCurrency(monthlySavings)}`,
        value: formatCurrency(monthlySavings),
        explanation:
          "يُنصح بتوفير 35% من صافي الدخل الشهري كحد أقصى للادخار مع الحفاظ على مستوى المعيشة",
      },
      {
        title: `إجمالي المدخرات خلال 4 سنوات: ${formatCurrency(maxBudget)}`,
        value: formatCurrency(maxBudget),
        explanation:
          "تم حساب إجمالي المدخرات على مدى 4 سنوات كفترة معقولة لتوفير مبلغ شراء العقار كاش",
      },
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

    loanAmount = maxLoanAmount;

    // حساب الدفعة الأولى
    if (data.hasDownPayment === "yes" && data.downPayment) {
      actualDownPayment = data.downPayment;
      maxBudget = maxLoanAmount + actualDownPayment;
    } else {
      // إذا لم يكن لديه دفعة أولى، فسيحتاج لقرض شخصي للدفعة الأولى
      const requiredDownPayment = maxLoanAmount * 0.1; // 10% من قيمة العقار
      personalLoanAmount = requiredDownPayment;
      actualDownPayment = requiredDownPayment;
      maxBudget = maxLoanAmount + actualDownPayment;
    }

    monthlyPayment = maxMonthlyPayment;

    calculationSteps = [
      {
        title: `صافي الدخل الشهري: ${formatCurrency(netIncome)}`,
        value: formatCurrency(netIncome),
        explanation: "تم حسابه بطرح الالتزامات الشهرية من إجمالي الدخل الشهري",
      },
      {
        title: `الحد الأقصى للقسط الشهري (35%): ${formatCurrency(maxMonthlyPayment)}`,
        value: formatCurrency(maxMonthlyPayment),
        explanation:
          "تم احتسابها بناء على نسبة التحمل 35% من صا��ي دخلك، وهي النسبة المعتمدة من البنوك السعودية",
      },
      {
        title: `معدل الفائدة: ${data.interestRate || 4}%`,
        value: `${data.interestRate || 4}%`,
        explanation:
          "هذا هو متوسط أسعار الفائدة للتمويل العقاري في السوق السعودي حسب بيانات البنك المركزي",
      },
      {
        title: `مدة التمويل: ${data.loanYears || 25} سنة`,
        value: `${data.loanYears || 25} سنة`,
        explanation:
          "المدة المثلى للتمويل العقاري التي توازن بين القسط الشهري المعقول وإجمالي الفوائد المدفوعة",
      },
      {
        title: `مبلغ القرض: ${formatCurrency(maxLoanAmount)}`,
        value: formatCurrency(maxLoanAmount),
        explanation:
          "تم حسابه باستخدام معادلة التمويل العقاري بناء على القسط الشهري المتاح ومعدل الفائدة وفترة السداد",
      },
      {
        title: `الدفعة الأولى: ${formatCurrency(actualDownPayment)}`,
        value: formatCurrency(actualDownPayment),
        explanation:
          data.hasDownPayment === "yes"
            ? "المبلغ الذي حددته كدفعة أولى متوفرة لديك"
            : "10% من قيمة العقار كحد أدنى مطلوب، يمكن الحصول عليها من قرض شخصي أو جمعية",
      },
      {
        title: `إجمالي الميزانية: ${formatCurrency(maxBudget)}`,
        value: formatCurrency(maxBudget),
        explanation:
          "مجموع مبلغ القرض العقاري والدفعة الأولى، وهو الحد الأقصى لسعر العقار الذي يمكنك تحمله",
      },
    ];

    if (personalLoanAmount > 0) {
      calculationSteps.push({
        title: `قرض شخصي للدفعة الأولى: ${formatCurrency(personalLoanAmount)}`,
        value: formatCurrency(personalLoanAmount),
        explanation:
          "نظراً لعدم توفر دفعة أولى، يمكن الحصول على قرض شخصي بفائدة 4% أو من خلال جمعية للموظفين",
      });
    }
  }

  const isAffordable = maxBudget >= propertyInfo.price;
  const recommendedRegion = data.region;

  return {
    maxBudget,
    monthlyPayment,
    propertyType,
    propertyInfo,
    recommendedRegion,
    bestNeighborhood,
    isAffordable,
    calculationSteps,
    netIncome,
    city: data.city,
    loanAmount,
    actualDownPayment,
    personalLoanAmount,
    hasDownPayment: data.hasDownPayment,
    familySize: data.familySize,
    requiredRooms: data.requiredRooms,
  };
};

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyIncome: 0,
      monthlyObligations: 0,
      financingType: "mortgage",
      interestRate: 4,
      loanYears: 25,
      hasDownPayment: "no",
      downPayment: 0,
      city: "",
      region: "",
      familySize: 1,
      requiredRooms: 2,
    },
  });

  // تحديث المناطق عند تغيير المدينة
  const selectedCity = form.watch("city");
  const selectedFinancing = form.watch("financingType");
  const familySize = form.watch("familySize");
  const hasDownPayment = form.watch("hasDownPayment");

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
                  ? "العقار الأنسب لك"
                  : "تنبيه: تجاوز الميزانية"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {results.isAffordable ? (
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Building className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-semibold text-lg">نوع العقار:</p>
                          <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                            {results.propertyType}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-semibold text-lg">
                            الموقع المقترح:
                          </p>
                          <p className="text-lg">
                            {results.bestNeighborhood} -{" "}
                            {results.recommendedRegion}
                          </p>
                          <p className="text-sm text-gray-600">
                            {results.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Home className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-semibold">المساحة التقديرية:</p>
                          <p className="text-lg">
                            {results.propertyInfo.size} متر مربع
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Coins className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-semibold text-lg">السعر المقدر:</p>
                          <p className="text-2xl font-bold text-green-700">
                            {formatCurrency(results.propertyInfo.price)}
                          </p>
                        </div>
                      </div>

                      {results.monthlyPayment > 0 && (
                        <div className="flex items-center gap-3">
                          <Calculator className="h-6 w-6 text-blue-600" />
                          <div>
                            <p className="font-semibold">القسط الشهري:</p>
                            <p className="text-xl font-bold text-blue-700">
                              {formatCurrency(results.monthlyPayment)}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold">ميزانيتك:</p>
                          <p className="text-xl font-bold text-green-700">
                            {formatCurrency(results.maxBudget)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* تفاصيل التوصية بناءً على API */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-blue-900 leading-relaxed">
                          <strong>
                            بناءً على البيانات العقارية الصادرة من وزارة العدل
                            لعام 2024
                          </strong>
                          ، وبناءً على دخلك الشهري البالغ{" "}
                          {formatCurrency(
                            results.netIncome +
                              form.getValues("monthlyObligations"),
                          )}
                          ، يوصى بشراء <strong>{results.propertyType}</strong>{" "}
                          في <strong>{results.recommendedRegion}</strong> بحي{" "}
                          <strong>{results.bestNeighborhood}</strong>
                          بمساحة{" "}
                          <strong>
                            {results.propertyInfo.size} متر مربع
                          </strong>{" "}
                          وميزانية قدرها{" "}
                          <strong>
                            {formatCurrency(results.propertyInfo.price)}
                          </strong>
                          .
                        </p>

                        <div className="mt-3 p-3 bg-white rounded border-r-4 border-blue-400">
                          <p className="text-sm text-gray-700">
                            <strong>تفسير اختيار نوع العقار:</strong> تم اختيار{" "}
                            {results.propertyType} بناءً على عدد أفراد الأسرة (
                            {results.familySize} أفراد) والحاجة إلى{" "}
                            {results.requiredRooms} غرف، مما يتطلب مساحة لا تقل
                            عن {results.propertyInfo.size} متر مربع لضمان الراحة
                            والخصوصية لجميع أفراد الأسرة.
                          </p>
                        </div>

                        {results.personalLoanAmount > 0 && (
                          <div className="mt-3 p-3 bg-amber-50 rounded border-r-4 border-amber-400">
                            <p className="text-sm text-amber-800">
                              <strong>ملاحظة هامة:</strong> نظراً لعدم توفر
                              ��فعة أولى، ستحتاج إلى قرض شخصي بقيمة{" "}
                              {formatCurrency(results.personalLoanAmount)}
                              (10% من قيمة العقار) بمتوسط فائدة 4%، أو يمكن
                              توفيرها من خلال جمعية الموظفين أو طريقة ادخار
                              بديلة.
                            </p>
                          </div>
                        )}
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
                      في {results.bestNeighborhood} -{" "}
                      {results.recommendedRegion} (
                      {formatCurrency(results.propertyInfo.price)})
                    </p>

                    <div className="bg-blue-50 p-4 rounded-lg mt-4">
                      <h3 className="font-semibold text-blue-800 mb-2">
                        💡 البديل المقترح: الإيجار
                      </h3>
                      <div className="space-y-2 text-blue-700">
                        <p>
                          إيجار {results.propertyType} في{" "}
                          {results.bestNeighborhood} -{" "}
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
                          (تقدير بناءً على 5% عائد سنو�� من قيمة العقار)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* تفاصيل الحسابات المالية */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                الحسبة المالية التفصيلية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.calculationSteps.map((step: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">
                        {step.title.split(":")[0]}:
                      </span>
                      <span className="font-bold text-lg text-blue-700">
                        {step.value}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 bg-white p-3 rounded border-r-4 border-blue-300">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p>{step.explanation}</p>
                      </div>
                    </div>
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
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    <strong>اختيار نوع العقار:</strong> تم اختيار{" "}
                    {results.propertyType} بناءً على عدد أفراد الأسرة (
                    {results.familySize} أفراد) وعدد الغرف المطلوبة (
                    {results.requiredRooms} غرف)، مما يوفر مساحة مناسبة قدرها{" "}
                    {results.propertyInfo.size} متر مربع.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    <strong>اختيار الموقع:</strong> تم اختيار حي{" "}
                    {results.bestNeighborhood} في {results.recommendedRegion}
                    بناءً على المنطقة الجغرافية المحددة والميزانية المتاحة، مع
                    مراعاة متوسط أسعار العقارات في المنطقة.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    <strong>نسبة الاستقطاع:</strong>
                    القسط الشهري يمثل{" "}
                    {(
                      (results.monthlyPayment / results.netIncome) *
                      100
                    ).toFixed(1)}
                    % من صافي الدخل
                    {results.monthlyPayment / results.netIncome <= 0.35
                      ? " وهي نسبة مثالية ومقبولة بنكياً"
                      : " وهي نسبة مرتفعة قد تتطلب إعادة النظر في الميزانية"}
                  </p>
                </div>

                {results.personalLoanAmount > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      <strong>بديل الدفعة الأولى:</strong> يمكن الحصول على
                      الدفعة الأولى البالغة{" "}
                      {formatCurrency(results.personalLoanAmount)}
                      من خلال قرض شخصي بفائدة 4% أو من خلال جمعية الموظفين، مما
                      يجعل التملك ممكناً بدون توفر مبلغ مقدم.
                    </p>
                  </div>
                )}
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
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
          <CardTitle className="text-center text-2xl">
            🏠 حاسبة ميزانية العقارات
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
              dir="rtl"
            >
              {/* 1. تفاصيل الدخل والالتزامات */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">
                  💰 تفاصيل الدخل والالتزامات
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            dir="rtl"
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
                            dir="rtl"
                          />
                        </FormControl>
                        <FormDescription>
                          أقساط القروض والبطاقات الائتمانية والالتزامات الثابتة
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 2. نوع التمويل */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">
                  🏦 نوع التمويل
                </h3>
                <FormField
                  control={form.control}
                  name="financingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اختر نوع التمويل</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        dir="rtl"
                      >
                        <FormControl>
                          <SelectTrigger dir="rtl">
                            <SelectValue placeholder="اختر نوع التمويل" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent dir="rtl">
                          <SelectItem value="cash">كاش (دفع كامل)</SelectItem>
                          <SelectItem value="mortgage">تمويل عقاري</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 3. تفاصيل التمويل العقاري */}
              {selectedFinancing === "mortgage" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">
                    📊 تفاصيل التمويل العقاري
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
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
                              dir="rtl"
                            />
                          </FormControl>
                          <FormDescription>
                            افتراضية: 4% (متوسط السوق)
                          </FormDescription>
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
                              dir="rtl"
                            />
                          </FormControl>
                          <FormDescription>الحد الأقصى: 30 سنة</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* 4. الدفعة الأولى */}
              {selectedFinancing === "mortgage" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">
                    💳 الدفعة الأولى
                  </h3>
                  <FormField
                    control={form.control}
                    name="hasDownPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>هل لديك دفعة أولى؟</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          dir="rtl"
                        >
                          <FormControl>
                            <SelectTrigger dir="rtl">
                              <SelectValue placeholder="اختر الإجابة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent dir="rtl">
                            <SelectItem value="yes">
                              نعم، لدي دفعة أولى
                            </SelectItem>
                            <SelectItem value="no">
                              لا، ليس لدي دفعة أولى
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {hasDownPayment === "yes" && (
                    <FormField
                      control={form.control}
                      name="downPayment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>مبلغ الدفعة الأولى (ريال)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="200000"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              dir="rtl"
                            />
                          </FormControl>
                          <FormDescription>
                            يُنصح بـ 20% من قيمة العقار كحد أدنى
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {hasDownPayment === "no" && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-amber-800 mb-1">
                            تنبيه: الدفعة الأولى مطلوبة
                          </h4>
                          <p className="text-sm text-amber-700">
                            ستحتاج إلى دفعة أولى تبلغ{" "}
                            <strong>10% من قيمة العقار</strong> كحد أدنى. يمكن
                            الحصول عليها من خلال:
                          </p>
                          <ul className="list-disc list-inside text-sm text-amber-700 mt-2 mr-4">
                            <li>قرض شخصي بمتوسط فائدة 4%</li>
                            <li>جمعية الموظفين</li>
                            <li>ادخار مسبق أو طريقة بديلة</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. المدينة والمنطقة */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">
                  📍 الموقع المفضل
                </h3>
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
                          dir="rtl"
                        >
                          <FormControl>
                            <SelectTrigger dir="rtl">
                              <SelectValue placeholder="اختر المدينة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent dir="rtl">
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
                        <FormLabel>المنطقة المفضلة</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!selectedCity}
                          dir="rtl"
                        >
                          <FormControl>
                            <SelectTrigger dir="rtl">
                              <SelectValue placeholder="اختر المنطقة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent dir="rtl">
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
                        <FormDescription>
                          اختر أولاً المدينة لعرض المناطق المتاحة
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 6. عدد أفراد الأسرة والغرف */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">
                  👨‍👩‍👧‍👦 تفاصيل الأسرة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="familySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عدد أفراد الأسرة</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="عدد أفراد الأسرة"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            dir="rtl"
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
                            dir="rtl"
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
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg"
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
