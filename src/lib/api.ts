import { useQuery } from "@tanstack/react-query";

interface DateResponse {
  date: string;
  format: string;
  day: string;
  weekday: {
    en: string;
    ar: string;
  };
  month: {
    number: number;
    en: string;
    ar: string;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
  holidays: any[];
}

interface DateAPIResponse {
  code: number;
  status: string;
  data: {
    gregorian: DateResponse;
    hijri: DateResponse;
  };
}

/**
 * Fetches current date information from Saudi Open Data API in both Hijri and Gregorian calendars
 */
export const useSaudiDate = () => {
  return useQuery<DateAPIResponse>({
    queryKey: ["saudiDate"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Riyadh&country=Saudi%20Arabia&method=4",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch date information");
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching date:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Cities in Saudi Arabia
 */
export const saudiCities = [
  "الرياض", // Riyadh
  "جدة", // Jeddah
  "مكة المكرمة", // Makkah
  "المدينة المنورة", // Madinah
  "الدمام", // Dammam
  "الطائف", // Taif
  "تبوك", // Tabuk
  "القصيم", // Qassim
  "حائل", // Hail
  "أبها", // Abha
  "جازان", // Jazan
  "نجران", // Najran
  "الباحة", // Al Bahah
  "سكاكا", // Sakaka
  "عرعر", // Arar
];

/**
 * Average housing prices in major Saudi cities (estimates in SAR)
 */
export const cityHousingData: Record<
  string,
  { avgPrice: number; description: string }
> = {
  الرياض: {
    avgPrice: 950000,
    description: "سوق عقاري نشط بأسعار متنوعة حسب ا��حي",
  },
  جدة: {
    avgPrice: 850000,
    description: "مدينة ساحلية بخيارات سكنية متنوعة",
  },
  "مكة المكرمة": {
    avgPrice: 1200000,
    description: "أسعار مرتفعة خاصة قرب الحرم المكي",
  },
  "المدينة المنورة": {
    avgPrice: 800000,
    description: "أسعار معتدلة مع ارتفاع قرب المسجد النبوي",
  },
  الدمام: {
    avgPrice: 750000,
    description: "مدينة صناعية بأسعار معقولة للعقارات",
  },
};
