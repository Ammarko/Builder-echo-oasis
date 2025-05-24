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
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
        <CardTitle className="text-center text-xl">
          حاسبة ميزانية العقارات
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            dir="rtl"
          >
            <Accordion type="single" collapsible defaultValue="financial">
              <AccordionItem value="financial">
                <AccordionTrigger className="text-lg font-medium text-blue-700">
                  المعلومات المالية
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="monthlyIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الدخل الشهري (ريال)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل دخلك الشهري"
                            type="number"
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
                        <FormLabel>الالتزامات المالية الشهرية (ريال)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل التزاماتك المالية الشهرية"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          الأقساط، القروض، وأي التزامات مالية ثابتة
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expectedSalaryIncrease"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          معدل الزيادة السنوية المتوقعة في الراتب (%)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: 3"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
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
                      <FormItem>
                        <FormLabel>نسبة الفائدة للقرض العقاري (%)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: 4"
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          النسبة المتوقعة بناءً على توجهات السوق هي 4%
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="personal">
                <AccordionTrigger className="text-lg font-medium text-blue-700">
                  المعلومات الشخصية
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العمر</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عمرك"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          يؤثر العمر على حساب الفترة المتبقية حتى التقاعد (65
                          سنة)
                        </FormDescription>
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
                            placeholder="أدخل عدد أفراد الأسرة"
                            type="number"
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
                            placeholder="أدخل عدد الغرف المطلوبة"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          تلقائيًا مبني على حجم الأسرة، يمكنك تعديله
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="location">
                <AccordionTrigger className="text-lg font-medium text-blue-700">
                  معلومات الموقع
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="currentCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المدينة الحالية</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المدينة الحالية" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {saudiCities.map((city) => (
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
                    name="workLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>منطقة العمل</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={availableWorkLocations.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر منطقة العمل" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableWorkLocations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          اختر المنطقة التي تعمل فيها لتحديد الأحياء القريبة
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              حساب الميزانية والتوصيات
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
