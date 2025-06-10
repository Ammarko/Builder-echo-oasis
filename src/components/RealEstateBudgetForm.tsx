import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saudiCities } from "@/lib/api";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  DollarSign, 
  User, 
  MapPin, 
  Calculator,
  TrendingUp,
  Percent,
  Users,
  Home,
  Calendar
} from "lucide-react";

// Work locations for major cities
const workLocations = {
  الرياض: [
    "شمال الرياض",
    "جنوب الرياض",
    "شرق الرياض",
    "غرب الرياض",
    "وسط الرياض",
  ],
  جدة: ["شمال جدة", "جنوب جدة", "شرق جدة", "غرب جدة", "وسط جدة"],
  "مكة المكرمة": ["المنطقة المركزية", "العزيزية", "الششة", "النسيم", "العوالي"],
  "المدينة المنورة": [
    "المنطقة المركزية",
    "قباء",
    "العوالي",
    "الحرة الشرقية",
    "النخيل",
  ],
  الدمام: [
    "شمال الدمام",
    "جنوب الدمام",
    "شرق الدمام",
    "غرب الدمام",
    "وسط الدمام",
  ],
};

// Form schema with validation
const formSchema = z.object({
  monthlyIncome: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .positive("يجب أن يكون الدخل الشهري رقماً موجباً")
    .min(1000, "يجب أن يكون الدخل الشهري على الأقل 1000 ريال"),
  monthlyObligations: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .min(0, "لا يمكن أن تكون الالتزامات الشهرية رقماً سالباً"),
  currentCity: z.string().min(1, "يرجى اختيار المدينة الحالية"),
  workLocation: z.string().min(1, "يرجى اختيار منطقة العمل"),
  familySize: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .int("يجب أن يكون عدد أفراد الأسرة رقماً صحيحاً")
    .min(1, "يجب أن يكون عدد أفراد الأسرة على الأقل 1")
    .max(20, "يرجى التحقق من عدد أفراد الأسرة"),
  requiredRooms: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .int("يجب أن يكون عدد الغرف رقماً صحيحاً")
    .min(1, "يجب أن يكون عدد الغرف على الأقل 1")
    .max(10, "يرجى التحقق من عدد الغرف المطلوبة"),
  age: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .int("يجب أن يكون العمر رقماً صحيحاً")
    .min(18, "يجب أن يكون العمر على الأقل 18 سنة")
    .max(90, "يرجى التحقق من العمر المدخل"),
  expectedSalaryIncrease: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .min(0, "لا يمكن أن تكون نسبة الزيادة السنوية رقماً سالباً")
    .max(20, "يرجى التحقق من نسبة الزيادة السنوية (الحد الأقصى 20%)"),
  mortgageInterestRate: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .min(0, "لا يمكن أن تكون نسبة الفائدة رقماً سالباً")
    .max(15, "يرجى التحقق من نسبة الفائدة (الحد الأقصى 15%)"),
});

export type BudgetFormValues = z.infer<typeof formSchema>;

interface RealEstateBudgetFormProps {
  onSubmit: (values: BudgetFormValues) => void;
}

export const RealEstateBudgetForm: React.FC<RealEstateBudgetFormProps> = ({
  onSubmit,
}) => {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyIncome: 0,
      monthlyObligations: 0,
      currentCity: "",
      workLocation: "",
      familySize: 1,
      requiredRooms: 2,
      age: 30,
      expectedSalaryIncrease: 3,
      mortgageInterestRate: 4.0,
    },
  });

  // Automatically set required rooms based on family size
  React.useEffect(() => {
    const familySize = form.watch("familySize");
    let recommendedRooms = 1;

    if (familySize <= 2) {
      recommendedRooms = 1;
    } else if (familySize <= 4) {
      recommendedRooms = 2;
    } else if (familySize <= 6) {
      recommendedRooms = 3;
    } else {
      recommendedRooms = 4;
    }

    form.setValue("requiredRooms", recommendedRooms);
  }, [form.watch("familySize")]);

  // Update work locations when city changes
  const [availableWorkLocations, setAvailableWorkLocations] = React.useState<
    string[]
  >([]);

  React.useEffect(() => {
    const city = form.watch("currentCity");
    if (city && workLocations[city as keyof typeof workLocations]) {
      setAvailableWorkLocations(
        workLocations[city as keyof typeof workLocations],
      );
      form.setValue("workLocation", ""); // Reset work location when city changes
    } else {
      setAvailableWorkLocations([]);
    }
  }, [form.watch("currentCity")]);

  return (
    <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative">
          <CardTitle className="text-center text-2xl flex justify-center gap-3 items-center">
            <Calculator className="h-6 w-6" />
            حاسبة ميزانية العقارات
          </CardTitle>
          <p className="text-center text-blue-100 mt-2 text-sm">
            أدخل بياناتك للحصول على توصيات مخصصة
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-8 pb-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            dir="rtl"
          >
            <Accordion type="single" collapsible defaultValue="financial" className="space-y-4">
              <AccordionItem value="financial" className="border border-blue-100 rounded-lg px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <AccordionTrigger className="text-lg font-semibold text-blue-800 hover:text-blue-900 py-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5" />
                    المعلومات المالية
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="monthlyIncome"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-medium flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            الدخل الشهري (ريال)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال: 15000"
                              type="number"
                              className="h-12 text-lg border-2 focus:border-blue-500 transition-all duration-200"
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
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-medium flex items-center gap-2">
                            <Calculator className="h-4 w-4 text-red-600" />
                            الالتزامات المالية الشهرية (ريال)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال: 3000"
                              type="number"
                              className="h-12 text-lg border-2 focus:border-blue-500 transition-all duration-200"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-gray-600">
                            الأقساط، القروض، وأي التزامات مالية ثابتة
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="expectedSalaryIncrease"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-medium flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            معدل الزيادة السنوية المتوقعة (%)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال: 3"
                              type="number"
                              className="h-12 text-lg border-2 focus:border-blue-500 transition-all duration-200"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-gray-600">
                            النسبة المئوية للزيادة السنوية المتوقعة في الراتب
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mortgageInterestRate"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-medium flex items-center gap-2">
                            <Percent className="h-4 w-4 text-purple-600" />
                            نسبة الفائدة للقرض العقاري (%)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال: 4"
                              type="number"
                              step="0.1"
                              className="h-12 text-lg border-2 focus:border-blue-500 transition-all duration-200"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-gray-600">
                            النسبة المتوقعة بناءً على توجهات السوق هي 4%
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="personal" className="border border-green-100 rounded-lg px-4 bg-gradient-to-r from-green-50 to-emerald-50">
                <AccordionTrigger className="text-lg font-semibold text-green-800 hover:text-green-900 py-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    المعلومات الشخصية
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            العمر
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال: 30"
                              type="number"
                              className="h-12 text-lg border-2 focus:border-green-500 transition-all duration-200"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-gray-600">
                            يؤثر العمر على حساب الفترة المتبقية حتى التقاعد (65 سنة)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="familySize"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-medium flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-600" />
                            عدد أفراد الأسرة
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال: 4"
                              type="number"
                              className="h-12 text-lg border-2 focus:border-green-500 transition-all duration-200"
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
                  </div>

                  <FormField
                    control={form.control}
                    name="requiredRooms"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-medium flex items-center gap-2">
                          <Home className="h-4 w-4 text-orange-600" />
                          عدد الغرف المطلوبة
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: 3"
                            type="number"
                            className="h-12 text-lg border-2 focus:border-green-500 transition-all duration-200"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-gray-600">
                          تلقائيًا مبني على حجم الأسرة، يمكنك تعديله
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="location" className="border border-purple-100 rounded-lg px-4 bg-gradient-to-r from-purple-50 to-pink-50">
                <AccordionTrigger className="text-lg font-semibold text-purple-800 hover:text-purple-900 py-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5" />
                    معلومات الموقع
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="currentCity"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-red-600" />
                            المدينة الحالية
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 text-lg border-2 focus:border-purple-500 transition-all duration-200">
                                <SelectValue placeholder="اختر المدينة الحالية" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {saudiCities.map((city) => (
                                <SelectItem key={city} value={city} className="text-lg py-3">
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
                      name="workLocation"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            منطقة العمل
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={availableWorkLocations.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 text-lg border-2 focus:border-purple-500 transition-all duration-200">
                                <SelectValue placeholder="اختر منطقة العمل" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableWorkLocations.map((location) => (
                                <SelectItem key={location} value={location} className="text-lg py-3">
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-sm text-gray-600">
                            اختر المنطقة التي تعمل فيها لتحديد الأحياء القريبة
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transform transition-all duration-200 hover:scale-[1.02] focus:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <Calculator className="h-5 w-5 mr-2" />
                حساب الميزانية والتوصيات
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};