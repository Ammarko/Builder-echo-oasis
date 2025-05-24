import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saudiCities, propertyTypes, financingOptions } from "@/lib/api";

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
  futureCity: z.string().min(1, "يرجى اختيار مدينة الاستقرار المستقبلية"),
  familySize: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .int("يجب أن يكون عدد أفراد الأسرة رقماً صحيحاً")
    .min(1, "يجب أن يكون عدد أفراد الأسرة على الأقل 1")
    .max(20, "يرجى التحقق من عدد أفراد الأسرة"),
  requiredRooms: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .int("يجب أن يكون عدد الغرف رقماً صحيح��ً")
    .min(1, "يجب أن يكون عدد الغرف على الأقل 1")
    .max(10, "يرجى التحقق من عدد الغرف المطلوبة"),
  preferredPropertyType: z.string().min(1, "يرجى اختيار نوع العقار المفضل"),
  ownershipPreference: z.enum(["buy", "rent"], {
    invalid_type_error: "يرجى اختيار تفضيل التملك أو الإيجار",
  }),
  age: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .int("يجب أن يكون العمر رقماً صحيحاً")
    .min(18, "يجب أن يكون العمر على الأقل 18 سنة")
    .max(90, "يرجى التحقق من العمر المدخل"),
  expectedSalaryIncrease: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .min(0, "لا يمكن أن تكون نسبة الزيادة السنوية رقماً سالباً")
    .max(20, "يرجى التحقق من نسبة الزيادة السنوية (الحد الأقصى 20%)"),
  financingOption: z.string().min(1, "يرجى اختيار خيار التمويل المفضل"),
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
      futureCity: "",
      familySize: 1,
      requiredRooms: 2,
      preferredPropertyType: "",
      ownershipPreference: "buy",
      age: 30,
      expectedSalaryIncrease: 3,
      financingOption: "",
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
                    name="financingOption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>خيار التمويل المفضل</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر خيار التمويل" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {financingOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          سيؤثر اختيارك على حساب الميزانية القصوى
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
                  معلومات الموقع والتفضيلات
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
                    name="futureCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مدينة الاستقرار المستقبلية</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر مدينة الاستقرار المستقبلية" />
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
                        <FormDescription>
                          المدينة التي تنوي الاستقرار فيها على المدى الطويل
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredPropertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع العقار المفضل</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر نوع العقار" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {propertyTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
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
                    name="ownershipPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>هل تفضل التملك أو الإيجار؟</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر تفضيلك" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="buy">تملك</SelectItem>
                            <SelectItem value="rent">إيجار</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          سنحلل الخيار الأفضل لك بناءً على معلوماتك وظروف السوق
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
