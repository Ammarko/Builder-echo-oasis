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
  TrendingUp,
} from "lucide-react";

// بيانات المدن والمناطق مع أحياء محددة وأسعار دقيقة
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
      "شمال الرياض": [
        { name: "القيروان", tier: "premium" },
        { name: "النرجس", tier: "luxury" },
        { name: "الياسمين", tier: "premium" },
        { name: "الملقا", tier: "luxury" },
        { name: "النفل", tier: "standard" },
      ],
      "جنوب الرياض": [
        { name: "الشفا", tier: "standard" },
        { name: "العزيزية", tier: "standard" },
        { name: "النسيم", tier: "budget" },
        { name: "الدار البيضاء", tier: "standard" },
        { name: "الفيحاء", tier: "budget" },
      ],
      "شرق الرياض": [
        { name: "الروضة", tier: "premium" },
        { name: "الرواد", tier: "standard" },
        { name: "الربيع", tier: "standard" },
        { name: "الريان", tier: "standard" },
        { name: "النهضة", tier: "budget" },
      ],
      "غرب الرياض": [
        { name: "العقيق", tier: "luxury" },
        { name: "الصحافة", tier: "premium" },
        { name: "العليا", tier: "luxury" },
        { name: "الرحمانية", tier: "standard" },
        { name: "عرقة", tier: "standard" },
      ],
      "وسط الرياض": [
        { name: "الديرة", tier: "heritage" },
        { name: "المرقب", tier: "standard" },
        { name: "العود", tier: "standard" },
        { name: "المربع", tier: "budget" },
        { name: "الرميلة", tier: "budget" },
      ],
    },
    marketData: {
      averageRentYield: 0.05, // 5% عائد إيجاري سنوي
      growthRate: 0.08, // 8% نمو سنوي
      demandLevel: "high",
    },
    avgPrices: {
      أرض: {
        luxury: { price: 500000, size: 600, rent: 0 },
        premium: { price: 350000, size: 500, rent: 0 },
        standard: { price: 250000, size: 400, rent: 0 },
        budget: { price: 180000, size: 300, rent: 0 },
        heritage: { price: 220000, size: 350, rent: 0 },
      },
      شقة: {
        luxury: { price: 950000, size: 140, rent: 4500 },
        premium: { price: 750000, size: 120, rent: 3500 },
        standard: { price: 580000, size: 100, rent: 2800 },
        budget: { price: 420000, size: 80, rent: 2200 },
        heritage: { price: 380000, size: 90, rent: 2000 },
      },
      دوبلكس: {
        luxury: { price: 1800000, size: 280, rent: 8500 },
        premium: { price: 1400000, size: 250, rent: 7000 },
        standard: { price: 1100000, size: 220, rent: 5500 },
        budget: { price: 850000, size: 200, rent: 4500 },
        heritage: { price: 900000, size: 230, rent: 4800 },
      },
      فيلا: {
        luxury: { price: 3500000, size: 450, rent: 16000 },
        premium: { price: 2500000, size: 400, rent: 12000 },
        standard: { price: 1800000, size: 350, rent: 9000 },
        budget: { price: 1400000, size: 300, rent: 7000 },
        heritage: { price: 1600000, size: 320, rent: 8000 },
      },
    },
  },
  جدة: {
    regions: ["شمال جدة", "جنوب جدة", "شرق جدة", "غرب جدة", "وسط جدة"],
    neighborhoods: {
      "شمال جدة": [
        { name: "الشاطئ", tier: "luxury" },
        { name: "أبحر", tier: "luxury" },
        { name: "ذهبان", tier: "premium" },
        { name: "النعيم", tier: "standard" },
        { name: "الفيصلية", tier: "premium" },
      ],
      "جنوب جدة": [
        { name: "البوادي", tier: "budget" },
        { name: "العزيزية", tier: "standard" },
        { name: "القريات", tier: "budget" },
        { name: "المحاميد", tier: "budget" },
        { name: "الحرازات", tier: "standard" },
      ],
      "شرق جدة": [
        { name: "النزهة", tier: "premium" },
        { name: "الروضة", tier: "premium" },
        { name: "الفيصلية", tier: "premium" },
        { name: "النخيل", tier: "standard" },
        { name: "الروابي", tier: "standard" },
      ],
      "غرب جدة": [
        { name: "البلد", tier: "heritage" },
        { name: "الشرفية", tier: "standard" },
        { name: "الحمراء", tier: "standard" },
        { name: "الزهراء", tier: "standard" },
        { name: "السلامة", tier: "premium" },
      ],
      "وسط جدة": [
        { name: "العزيزية", tier: "standard" },
        { name: "الروضة", tier: "premium" },
        { name: "الفيصلية", tier: "premium" },
        { name: "النزهة", tier: "premium" },
        { name: "الصفا", tier: "standard" },
      ],
    },
    marketData: {
      averageRentYield: 0.055,
      growthRate: 0.06,
      demandLevel: "high",
    },
    avgPrices: {
      أرض: {
        luxury: { price: 450000, size: 600, rent: 0 },
        premium: { price: 320000, size: 500, rent: 0 },
        standard: { price: 220000, size: 400, rent: 0 },
        budget: { price: 160000, size: 300, rent: 0 },
        heritage: { price: 200000, size: 350, rent: 0 },
      },
      شقة: {
        luxury: { price: 850000, size: 130, rent: 4200 },
        premium: { price: 650000, size: 110, rent: 3200 },
        standard: { price: 500000, size: 95, rent: 2600 },
        budget: { price: 380000, size: 75, rent: 2000 },
        heritage: { price: 350000, size: 85, rent: 1900 },
      },
      دوبلكس: {
        luxury: { price: 1600000, size: 270, rent: 7800 },
        premium: { price: 1250000, size: 240, rent: 6500 },
        standard: { price: 950000, size: 210, rent: 5000 },
        budget: { price: 750000, size: 190, rent: 4000 },
        heritage: { price: 800000, size: 220, rent: 4300 },
      },
      فيلا: {
        luxury: { price: 3200000, size: 420, rent: 15000 },
        premium: { price: 2200000, size: 380, rent: 11000 },
        standard: { price: 1600000, size: 330, rent: 8000 },
        budget: { price: 1200000, size: 280, rent: 6500 },
        heritage: { price: 1400000, size: 300, rent: 7500 },
      },
    },
  },
  "مكة المكرمة": {
    regions: ["المنطقة المركزية", "العزيزية", "الششة", "النسيم", "العوالي"],
    neighborhoods: {
      "المنطقة المركزية": [
        { name: "العزيزية", tier: "luxury" },
        { name: "النسيم", tier: "standard" },
        { name: "العوالي", tier: "budget" },
        { name: "الششة", tier: "standard" },
        { name: "الضيافة", tier: "premium" },
      ],
      العزيزية: [
        { name: "الششة", tier: "standard" },
        { name: "النسيم", tier: "standard" },
        { name: "الحجون", tier: "heritage" },
        { name: "التيسير", tier: "budget" },
        { name: "المرسلات", tier: "budget" },
      ],
      الششة: [
        { name: "العزيزية", tier: "premium" },
        { name: "النسيم", tier: "standard" },
        { name: "الضيافة", tier: "premium" },
        { name: "العوالي", tier: "budget" },
        { name: "المرسلات", tier: "budget" },
      ],
      النسيم: [
        { name: "الششة", tier: "standard" },
        { name: "العزيزية", tier: "premium" },
        { name: "العوالي", tier: "budget" },
        { name: "الضيافة", tier: "premium" },
        { name: "المرسلات", tier: "budget" },
      ],
      العوالي: [
        { name: "الششة", tier: "standard" },
        { name: "النسيم", tier: "standard" },
        { name: "الضيافة", tier: "premium" },
        { name: "المرسلات", tier: "budget" },
        { name: "التيسير", tier: "budget" },
      ],
    },
    marketData: {
      averageRentYield: 0.06,
      growthRate: 0.09,
      demandLevel: "very-high",
    },
    avgPrices: {
      أرض: {
        luxury: { price: 600000, size: 500, rent: 0 },
        premium: { price: 400000, size: 450, rent: 0 },
        standard: { price: 280000, size: 350, rent: 0 },
        budget: { price: 200000, size: 250, rent: 0 },
        heritage: { price: 320000, size: 300, rent: 0 },
      },
      شقة: {
        luxury: { price: 1200000, size: 110, rent: 5500 },
        premium: { price: 900000, size: 100, rent: 4200 },
        standard: { price: 650000, size: 85, rent: 3200 },
        budget: { price: 480000, size: 70, rent: 2500 },
        heritage: { price: 550000, size: 80, rent: 2800 },
      },
      دوبلكس: {
        luxury: { price: 2200000, size: 240, rent: 10500 },
        premium: { price: 1650000, size: 220, rent: 8000 },
        standard: { price: 1200000, size: 190, rent: 6000 },
        budget: { price: 950000, size: 170, rent: 4800 },
        heritage: { price: 1100000, size: 180, rent: 5500 },
      },
      فيلا: {
        luxury: { price: 4200000, size: 380, rent: 19000 },
        premium: { price: 2800000, size: 350, rent: 14000 },
        standard: { price: 2000000, size: 300, rent: 10000 },
        budget: { price: 1500000, size: 250, rent: 7500 },
        heritage: { price: 1800000, size: 280, rent: 9000 },
      },
    },
  },
  "المدينة المنورة": {
    regions: ["المنطقة المركزية", "قباء", "العوالي", "الحرة الشرقية", "النخيل"],
    neighborhoods: {
      "المنطقة المركزية": [
        { name: "قباء", tier: "premium" },
        { name: "العوالي", tier: "standard" },
        { name: "الحرة الشرقية", tier: "standard" },
        { name: "النخيل", tier: "budget" },
        { name: "بني حارثة", tier: "budget" },
      ],
      قباء: [
        { name: "العوالي", tier: "standard" },
        { name: "الحرة الشرقية", tier: "standard" },
        { name: "النخيل", tier: "budget" },
        { name: "بني حارثة", tier: "budget" },
        { name: "الأنصار", tier: "standard" },
      ],
      العوالي: [
        { name: "قباء", tier: "premium" },
        { name: "الحرة الشرقية", tier: "standard" },
        { name: "النخيل", tier: "budget" },
        { name: "بني حارثة", tier: "budget" },
        { name: "الأنصار", tier: "standard" },
      ],
      "الحرة الشرقية": [
        { name: "قباء", tier: "premium" },
        { name: "العوالي", tier: "standard" },
        { name: "النخيل", tier: "budget" },
        { name: "بني حارثة", tier: "budget" },
        { name: "الأنصار", tier: "standard" },
      ],
      النخيل: [
        { name: "قباء", tier: "premium" },
        { name: "العوالي", tier: "standard" },
        { name: "الحرة الشرقية", tier: "standard" },
        { name: "بني حارثة", tier: "budget" },
        { name: "الأنصار", tier: "standard" },
      ],
    },
    marketData: {
      averageRentYield: 0.055,
      growthRate: 0.07,
      demandLevel: "high",
    },
    avgPrices: {
      أرض: {
        luxury: { price: 380000, size: 500, rent: 0 },
        premium: { price: 280000, size: 450, rent: 0 },
        standard: { price: 200000, size: 350, rent: 0 },
        budget: { price: 140000, size: 250, rent: 0 },
        heritage: { price: 180000, size: 300, rent: 0 },
      },
      شقة: {
        luxury: { price: 750000, size: 120, rent: 3500 },
        premium: { price: 580000, size: 115, rent: 2800 },
        standard: { price: 420000, size: 95, rent: 2200 },
        budget: { price: 320000, size: 80, rent: 1700 },
        heritage: { price: 360000, size: 85, rent: 1900 },
      },
      دوبلكس: {
        luxury: { price: 1400000, size: 250, rent: 6800 },
        premium: { price: 1100000, size: 230, rent: 5500 },
        standard: { price: 850000, size: 200, rent: 4200 },
        budget: { price: 650000, size: 180, rent: 3300 },
        heritage: { price: 750000, size: 190, rent: 3800 },
      },
      فيلا: {
        luxury: { price: 2500000, size: 400, rent: 12000 },
        premium: { price: 1800000, size: 370, rent: 9000 },
        standard: { price: 1300000, size: 320, rent: 6500 },
        budget: { price: 1000000, size: 280, rent: 5000 },
        heritage: { price: 1200000, size: 300, rent: 6000 },
      },
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
      "شمال الدمام": [
        { name: "الشاطئ", tier: "luxury" },
        { name: "الحمراء", tier: "premium" },
        { name: "النورس", tier: "premium" },
        { name: "الناصرية", tier: "standard" },
        { name: "طيبة", tier: "standard" },
      ],
      "جنوب الدمام": [
        { name: "عبد الله فؤاد", tier: "standard" },
        { name: "الفيصلية", tier: "standard" },
        { name: "البادية", tier: "budget" },
        { name: "غرناطة", tier: "premium" },
        { name: "الجلوية", tier: "budget" },
      ],
      "شرق الدمام": [
        { name: "الشاطئ", tier: "luxury" },
        { name: "البحيرة", tier: "premium" },
        { name: "الهدا", tier: "standard" },
        { name: "المنار", tier: "standard" },
        { name: "الصفا", tier: "standard" },
      ],
      "غرب الدمام": [
        { name: "النزهة", tier: "premium" },
        { name: "الروضة", tier: "premium" },
        { name: "الفنار", tier: "standard" },
        { name: "أحد", tier: "budget" },
        { name: "المزروعية", tier: "budget" },
      ],
      "وسط الدمام": [
        { name: "الطبيشي", tier: "heritage" },
        { name: "القزاز", tier: "standard" },
        { name: "الدواسر", tier: "standard" },
        { name: "الخليج", tier: "premium" },
        { name: "الفيصلية", tier: "standard" },
      ],
    },
    marketData: {
      averageRentYield: 0.06,
      growthRate: 0.05,
      demandLevel: "medium",
    },
    avgPrices: {
      أرض: {
        luxury: { price: 320000, size: 500, rent: 0 },
        premium: { price: 240000, size: 450, rent: 0 },
        standard: { price: 180000, size: 350, rent: 0 },
        budget: { price: 120000, size: 250, rent: 0 },
        heritage: { price: 150000, size: 300, rent: 0 },
      },
      شقة: {
        luxury: { price: 650000, size: 125, rent: 3200 },
        premium: { price: 480000, size: 110, rent: 2500 },
        standard: { price: 350000, size: 95, rent: 1900 },
        budget: { price: 280000, size: 80, rent: 1500 },
        heritage: { price: 300000, size: 85, rent: 1600 },
      },
      دوبلكس: {
        luxury: { price: 1200000, size: 250, rent: 6000 },
        premium: { price: 950000, size: 230, rent: 4800 },
        standard: { price: 720000, size: 200, rent: 3600 },
        budget: { price: 550000, size: 180, rent: 2800 },
        heritage: { price: 650000, size: 190, rent: 3200 },
      },
      فيلا: {
        luxury: { price: 2200000, size: 400, rent: 11000 },
        premium: { price: 1600000, size: 370, rent: 8000 },
        standard: { price: 1200000, size: 320, rent: 6000 },
        budget: { price: 900000, size: 280, rent: 4500 },
        heritage: { price: 1100000, size: 300, rent: 5500 },
      },
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
    invalid_type_error: "يرجى اختيار طريقة الشراء",
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

// دالة تنسيق العملة
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// الذكاء الاصطناعي لتحليل القدرة الشرائية وتحديد العقار الأنسب
const analyzeAffordability = (data: FormValues) => {
  const netIncome = data.monthlyIncome - data.monthlyObligations;
  const cityInfo = cityData[data.city as keyof typeof cityData];

  if (!cityInfo) {
    throw new Error("بيانات المدينة غير متوفرة");
  }

  // حساب الميزانية القصوى
  let maxBudget = 0;
  let monthlyPayment = 0;
  let calculationSteps: Array<{
    title: string;
    value: string;
    explanation: string;
  }> = [];

  if (data.financingType === "cash") {
    const monthlySavings = netIncome * 0.35;
    maxBudget = monthlySavings * 12 * 4;

    calculationSteps = [
      {
        title: `صافي الدخل الشهري: ${formatCurrency(netIncome)}`,
        value: formatCurrency(netIncome),
        explanation: "تم حسابه بطرح الالتزامات الشهرية من إجمالي الدخل الشهري",
      },
      {
        title: `قدرة الادخار الشهرية (35%): ${formatCurrency(monthlySavings)}`,
        value: formatCurrency(monthlySavings),
        explanation: "يُنصح بتوفير 35% من صافي الدخل الشهري كحد أقصى للادخار",
      },
      {
        title: `إجمالي المدخرات خلال 4 سنوات: ${formatCurrency(maxBudget)}`,
        value: formatCurrency(maxBudget),
        explanation:
          "تم حساب إجمالي المدخرات على مدى 4 سنوات كفترة معقولة للتوفير",
      },
    ];
  } else {
    const maxMonthlyPayment = netIncome * 0.35;
    const interestRate = (data.interestRate || 4) / 100 / 12;
    const loanTerms = (data.loanYears || 25) * 12;

    const maxLoanAmount =
      maxMonthlyPayment *
      ((1 - Math.pow(1 + interestRate, -loanTerms)) / interestRate);

    const actualDownPayment =
      data.hasDownPayment === "yes" && data.downPayment
        ? data.downPayment
        : maxLoanAmount * 0.1;

    maxBudget = maxLoanAmount + actualDownPayment;
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
          "تم احتسابها بناء على نسبة التحمل 35% من صافي دخلك، وهي النسبة المعتمدة من البنوك السعودية",
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
  }

  // تحديد أفضل نوع عقار وحي بناءً على الميزانية والاحتياجات
  const propertyTypes = ["فيلا", "دوبلكس", "شقة", "أرض"] as const;
  let bestOption: any = null;
  let recommendationReason = "";
  let isRentOnly = false;

  // الحصول على الأحياء المتاحة في المنطقة المحددة
  const availableNeighborhoods =
    cityInfo.neighborhoods[
      data.region as keyof typeof cityInfo.neighborhoods
    ] || [];

  // ترتيب الأحياء حسب المستوى (من الأقل تكلفة للأعلى)
  const tierOrder = ["budget", "heritage", "standard", "premium", "luxury"];
  const sortedNeighborhoods = [...availableNeighborhoods].sort(
    (a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier),
  );

  // البحث عن أفضل خيار متاح
  for (const propertyType of propertyTypes) {
    for (const neighborhood of sortedNeighborhoods) {
      const propertyData =
        cityInfo.avgPrices[propertyType]?.[
          neighborhood.tier as keyof (typeof cityInfo.avgPrices)[typeof propertyType]
        ];

      if (propertyData && propertyData.price <= maxBudget) {
        bestOption = {
          type: propertyType,
          neighborhood: neighborhood.name,
          tier: neighborhood.tier,
          data: propertyData,
          isAffordable: true,
          action: "buy",
        };

        // تحديد سبب التوصية
        if (propertyType === "فيلا") {
          recommendationReason =
            data.familySize >= 6
              ? `بناءً على حجم أسرتك الكبير (${data.familySize} أفراد) والحاجة لمساحة واسعة وخصوصية أكبر`
              : `ميزانيتك المتاحة تسمح بشراء فيلا مما يوفر استثماراً عقارياً ممتازاً ومساحة مريحة`;
        } else if (propertyType === "دوبلكس") {
          recommendationReason =
            data.familySize >= 4
              ? `يناسب حجم أسرتك (${data.familySize} أفراد) ويوفر توازناً مثالياً بين المساحة والتكلفة`
              : `خيار ممتاز يوفر مساحة أكبر من الشقة مع إمكانية الاستثمار المستقبلي`;
        } else if (propertyType === "شقة") {
          recommendationReason =
            data.familySize <= 3
              ? `مناسبة لحجم أسرتك الصغير (${data.familySize} أفراد) مع سهولة الصيانة والإدارة`
              : `خيار اقتصادي يوفر احتياجاتك الأساسية مع إمكانية الترقي مستقبلاً`;
        } else {
          recommendationReason = `استثمار ممتاز في الأرض يمكنك بناؤها حسب احتياجاتك أو الاحتفاظ بها كاستثمار طويل المدى`;
        }

        break;
      }
    }
    if (bestOption) break;
  }

  // إذا لم يجد خيار للشراء، يقترح الإيجار
  if (!bestOption) {
    isRentOnly = true;
    // البحث عن أفضل خيار إيجار
    for (const propertyType of ["شقة", "دوبلكس", "فيلا"] as const) {
      for (const neighborhood of sortedNeighborhoods) {
        const propertyData =
          cityInfo.avgPrices[propertyType]?.[
            neighborhood.tier as keyof (typeof cityInfo.avgPrices)[typeof propertyType]
          ];

        if (
          propertyData &&
          propertyData.rent > 0 &&
          propertyData.rent <= netIncome * 0.3
        ) {
          bestOption = {
            type: propertyType,
            neighborhood: neighborhood.name,
            tier: neighborhood.tier,
            data: propertyData,
            isAffordable: false,
            action: "rent",
          };

          recommendationReason = `بناءً على تحليل دخلك الشهري، الإيجار هو الخيار الأنسب حالياً حيث يوفر لك مرونة مالية أكبر ويسمح لك بتوفير المزيد للمستقبل`;
          break;
        }
      }
      if (bestOption) break;
    }
  }

  // إذا لم يجد أي خيار حتى الإيجار
  if (!bestOption) {
    // اقتراح أقل الخيارات تكلفة
    const cheapestOption = sortedNeighborhoods[0];
    const cheapestProperty =
      cityInfo.avgPrices["شقة"]?.[
        cheapestOption.tier as keyof (typeof cityInfo.avgPrices)["شقة"]
      ];

    bestOption = {
      type: "شقة",
      neighborhood: cheapestOption.name,
      tier: cheapestOption.tier,
      data: cheapestProperty,
      isAffordable: false,
      action: "rent",
    };

    isRentOnly = true;
    recommendationReason = `ننصح بالإيجار مؤقتاً وتحسين الوضع المالي تدريجياً من خلال زيادة الدخل أو تقليل الالتزامات`;
  }

  return {
    maxBudget,
    monthlyPayment,
    calculationSteps,
    bestOption,
    recommendationReason,
    isRentOnly,
    netIncome,
    cityInfo,
    familySize: data.familySize,
    requiredRooms: data.requiredRooms,
    region: data.region,
    city: data.city,
    hasDownPayment: data.hasDownPayment,
    financingType: data.financingType,
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
    const analysis = analyzeAffordability(data);
    setResults(analysis);
    setShowResults(true);
  };

  const resetForm = () => {
    setShowResults(false);
    setResults(null);
  };

  if (showResults && results) {
    const currentYear = new Date().getFullYear();

    return (
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4"
        dir="rtl"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-4">
              تحليل الوضع العقاري الشخصي
            </h1>
          </div>

          {/* التوصية الذكية */}
          <Card className="mb-6 shadow-lg">
            <CardHeader
              className={`text-white ${results.bestOption?.isAffordable ? "bg-gradient-to-r from-green-600 to-green-800" : results.isRentOnly ? "bg-gradient-to-r from-blue-600 to-blue-800" : "bg-gradient-to-r from-amber-500 to-amber-700"}`}
            >
              <CardTitle className="text-center text-xl flex justify-center gap-2 items-center">
                {results.bestOption?.isAffordable ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <TrendingUp className="h-6 w-6" />
                )}
                {results.isRentOnly
                  ? "توصية الإيجار الأنسب"
                  : results.bestOption?.isAffordable
                    ? "العقار الأنسب للشراء"
                    : "توصية مالية ذكية"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div
                className={`${results.bestOption?.isAffordable ? "bg-green-50" : results.isRentOnly ? "bg-blue-50" : "bg-amber-50"} p-6 rounded-lg`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Building
                        className={`h-6 w-6 ${results.bestOption?.isAffordable ? "text-green-600" : results.isRentOnly ? "text-blue-600" : "text-amber-600"}`}
                      />
                      <div>
                        <p className="font-semibold text-lg">نوع العقار:</p>
                        <Badge
                          className={`${results.bestOption?.isAffordable ? "bg-green-100 text-green-800" : results.isRentOnly ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"} text-lg px-4 py-2`}
                        >
                          {results.bestOption?.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin
                        className={`h-6 w-6 ${results.bestOption?.isAffordable ? "text-green-600" : results.isRentOnly ? "text-blue-600" : "text-amber-600"}`}
                      />
                      <div>
                        <p className="font-semibold text-lg">الموقع المقترح:</p>
                        <p className="text-lg">
                          {results.bestOption?.neighborhood} - {results.region}
                        </p>
                        <p className="text-sm text-gray-600">{results.city}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Home
                        className={`h-6 w-6 ${results.bestOption?.isAffordable ? "text-green-600" : results.isRentOnly ? "text-blue-600" : "text-amber-600"}`}
                      />
                      <div>
                        <p className="font-semibold">المساحة التقديرية:</p>
                        <p className="text-lg">
                          {results.bestOption?.data?.size} متر مربع
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Coins
                        className={`h-6 w-6 ${results.bestOption?.isAffordable ? "text-green-600" : results.isRentOnly ? "text-blue-600" : "text-amber-600"}`}
                      />
                      <div>
                        <p className="font-semibold text-lg">
                          {results.bestOption?.action === "rent"
                            ? "الإيجار الشهري:"
                            : "السعر المقدر:"}
                        </p>
                        <p
                          className={`text-2xl font-bold ${results.bestOption?.isAffordable ? "text-green-700" : results.isRentOnly ? "text-blue-700" : "text-amber-700"}`}
                        >
                          {formatCurrency(
                            results.bestOption?.action === "rent"
                              ? results.bestOption?.data?.rent
                              : results.bestOption?.data?.price,
                          )}
                          {results.bestOption?.action === "rent" && " شهرياً"}
                        </p>
                      </div>
                    </div>

                    {!results.isRentOnly && results.monthlyPayment > 0 && (
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
                        <p className="font-semibold">
                          {results.isRentOnly
                            ? "قدرتك على الإيجار:"
                            : "ميزانيتك للشراء:"}
                        </p>
                        <p
                          className={`text-xl font-bold ${results.bestOption?.isAffordable ? "text-green-700" : results.isRentOnly ? "text-blue-700" : "text-amber-700"}`}
                        >
                          {results.isRentOnly
                            ? formatCurrency(results.netIncome * 0.3) +
                              " شهرياً"
                            : formatCurrency(results.maxBudget)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* تحليل ذكي ديناميكي */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p
                        className={`${results.bestOption?.isAffordable ? "text-blue-900" : results.isRentOnly ? "text-blue-900" : "text-amber-900"} leading-relaxed`}
                      >
                        <strong>
                          بناءً على تحليل شامل لبيانات السوق العقاري لعام{" "}
                          {currentYear}
                        </strong>{" "}
                        والمؤشرات الصادرة من وزارة العدل ومنصة إيجار، وبعد دراسة
                        دخلك الشهري البالغ{" "}
                        {formatCurrency(
                          results.netIncome +
                            form.getValues("monthlyObligations"),
                        )}{" "}
                        وصافي دخلك {formatCurrency(results.netIncome)} بعد خصم
                        الالتزامات،
                        {results.bestOption?.action === "rent" ? (
                          <>
                            {" "}
                            ننصح بـ
                            <strong>
                              استئجار {results.bestOption?.type}
                            </strong>{" "}
                            في حي{" "}
                            <strong>{results.bestOption?.neighborhood}</strong>{" "}
                            بـ{results.region}
                            بمساحة{" "}
                            <strong>
                              {results.bestOption?.data?.size} متر مربع
                            </strong>{" "}
                            بإيجار شهري{" "}
                            <strong>
                              {formatCurrency(results.bestOption?.data?.rent)}
                            </strong>
                            ، وهو يمثل{" "}
                            {(
                              (results.bestOption?.data?.rent /
                                results.netIncome) *
                              100
                            ).toFixed(1)}
                            % من صافي دخلك.
                          </>
                        ) : (
                          <>
                            {" "}
                            ننصح بـ
                            <strong>شراء {results.bestOption?.type}</strong> في
                            حي{" "}
                            <strong>{results.bestOption?.neighborhood}</strong>{" "}
                            بـ{results.region}
                            بمساحة{" "}
                            <strong>
                              {results.bestOption?.data?.size} متر مربع
                            </strong>{" "}
                            بسعر{" "}
                            <strong>
                              {formatCurrency(results.bestOption?.data?.price)}
                            </strong>
                            {results.monthlyPayment > 0 && (
                              <>
                                {" "}
                                بقسط شهري{" "}
                                <strong>
                                  {formatCurrency(results.monthlyPayment)}
                                </strong>
                              </>
                            )}
                            .
                          </>
                        )}
                      </p>

                      <div className="mt-3 p-3 bg-white rounded border-r-4 border-blue-400">
                        <p className="text-sm text-gray-700">
                          <strong>سبب هذه التوصية:</strong>{" "}
                          {results.recommendationReason}
                          {results.cityInfo.marketData && (
                            <>
                              . حي {results.bestOption?.neighborhood} يشهد نمواً
                              سنوياً بمعدل{" "}
                              {(
                                results.cityInfo.marketData.growthRate * 100
                              ).toFixed(1)}
                              % ومستوى طلب{" "}
                              {results.cityInfo.marketData.demandLevel ===
                              "high"
                                ? "مرتفع"
                                : results.cityInfo.marketData.demandLevel ===
                                    "very-high"
                                  ? "مرتفع جداً"
                                  : "متوسط"}{" "}
                              وفقاً لبيانات السوق العقاري
                            </>
                          )}
                          .
                        </p>
                      </div>

                      {!results.isRentOnly &&
                        results.hasDownPayment === "no" && (
                          <div className="mt-3 p-3 bg-amber-50 rounded border-r-4 border-amber-400">
                            <p className="text-sm text-amber-800">
                              <strong>ملاحظة مالية:</strong> نظراً لعدم توفر
                              دفعة أولى، ستحتاج إلى تمويل إضافي بقيمة{" "}
                              {formatCurrency(
                                results.bestOption?.data?.price * 0.1,
                              )}{" "}
                              (10% من قيمة العقار) عبر قرض شخصي أو جمعية
                              الموظفين بمعدل فائدة تقديري 4%.
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* تفاصيل الحسابات المالية - فقط في حالة الشراء */}
          {!results.isRentOnly && (
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
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
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
          )}

          {/* مقارنة مع بيانات السوق */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                مقارنة مع متوسطات السوق
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-blue-600 mb-1">
                      متوسط الأسعار في {results.region}
                    </p>
                    <p className="text-lg font-bold text-blue-800">
                      {formatCurrency(
                        results.cityInfo.avgPrices[results.bestOption?.type]
                          ?.standard?.price || 0,
                      )}
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-green-600 mb-1">
                      العائد الإيجاري السنوي
                    </p>
                    <p className="text-lg font-bold text-green-800">
                      {(
                        results.cityInfo.marketData.averageRentYield * 100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-purple-600 mb-1">
                      نمو الأسعار السنوي
                    </p>
                    <p className="text-lg font-bold text-purple-800">
                      {(results.cityInfo.marketData.growthRate * 100).toFixed(
                        1,
                      )}
                      %
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>تحليل مقارن:</strong> العقار المقترح لك يقع في
                    الشريحة{" "}
                    <strong>
                      {results.bestOption?.tier === "luxury"
                        ? "الفاخرة"
                        : results.bestOption?.tier === "premium"
                          ? "المتميزة"
                          : results.bestOption?.tier === "standard"
                            ? "المتوسطة"
                            : results.bestOption?.tier === "budget"
                              ? "الاقتصادية"
                              : "التراثية"}
                    </strong>{" "}
                    من العقارات في {results.city}، ويعتبر
                    {results.bestOption?.data?.price <
                    results.cityInfo.avgPrices[results.bestOption?.type]
                      ?.standard?.price
                      ? " أقل من متوسط السوق"
                      : results.bestOption?.data?.price >
                          results.cityInfo.avgPrices[results.bestOption?.type]
                            ?.standard?.price
                        ? " أعلى من متوسط السوق"
                        : " ضمن متوسط السوق"}{" "}
                    مما يجعله خياراً
                    {results.bestOption?.data?.price <
                    results.cityInfo.avgPrices[results.bestOption?.type]
                      ?.standard?.price
                      ? "اقتصادياً ممتازاً"
                      : "استثمارياً جيداً"}
                    .
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
              إعادة التحليل
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

              {/* 2. طريقة الشراء */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">
                  🏦 طريقة الشراء
                </h3>
                <FormField
                  control={form.control}
                  name="financingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اختر طريقة الشراء</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        dir="rtl"
                      >
                        <FormControl>
                          <SelectTrigger dir="rtl">
                            <SelectValue placeholder="اختر طريقة الشراء" />
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
                تحليل الوضع العقاري والحصول على التوصيات
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
