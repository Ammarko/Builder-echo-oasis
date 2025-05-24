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

// Form schema with validation
const formSchema = z.object({
  monthlyIncome: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .positive("يجب أن يكون الدخل الشهري رقماً موجباً")
    .min(1000, "يجب أن يكون الدخل الشهري على الأقل 1000 ريال"),
  monthlyObligations: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .min(0, "لا يمكن أن تكون الالتزامات الشهرية رقماً سالباً"),
  city: z.string().min(1, "يرجى اختيار مدينة"),
  familySize: z.coerce
    .number({ invalid_type_error: "يرجى إدخال رقم صحيح" })
    .int("يجب أن يكون عدد أفراد الأسرة رقماً صحيحاً")
    .min(1, "يجب أن يكون عدد أفراد الأسرة على الأقل 1")
    .max(20, "يرجى التحقق من عدد أفراد الأسرة"),
  financingOption: z.enum(["Cash", "Mortgage"], {
    invalid_type_error: "يرجى اختيار خيار التمويل",
  }),
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
      city: "",
      familySize: 1,
      financingOption: "Mortgage",
    },
  });

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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
              name="familySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عدد أفراد الأسرة</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل عدد أفراد الأسرة"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
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
                      <SelectItem value="Cash">نقدي</SelectItem>
                      <SelectItem value="Mortgage">رهن عقاري</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    سيؤثر اختيارك على حساب الميزانية القصوى
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              حساب الميزانية
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
