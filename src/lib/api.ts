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

// Saudi Open Data API Response Interfaces
interface RealEstatePrice {
  id: number;
  city: string;
  district: string;
  propertyType: string;
  averagePrice: number;
  pricePerMeter: number;
  date: string;
}

interface RealEstateIndicator {
  id: number;
  city: string;
  indicator: string;
  value: number;
  year: number;
  quarter: number;
}

interface HousingFinance {
  id: number;
  financingType: string;
  amount: number;
  interestRate: number;
  year: number;
  month: number;
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
 * Fetches real estate prices from Saudi Open Data API
 */
export const useRealEstatePrices = (city?: string, propertyType?: string) => {
  return useQuery<RealEstatePrice[]>({
    queryKey: ["realEstatePrices", city, propertyType],
    queryFn: async () => {
      try {
        // This would be replaced with the actual API call if we had access
        // const response = await fetch("https://open.data.gov.sa/ar/datasets/view/0fd9a088-8bd9-4d8a-8d69-63eac103238d/api");

        // For demo purposes, returning mock data that mimics API response
        return mockRealEstatePrices.filter(
          (item) =>
            (!city || item.city === city) &&
            (!propertyType || item.propertyType === propertyType),
        );
      } catch (error) {
        console.error("Error fetching real estate prices:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: !!city, // Only run if city is provided
  });
};

/**
 * Fetches real estate indicators from Saudi Open Data API
 */
export const useRealEstateIndicators = (city?: string) => {
  return useQuery<RealEstateIndicator[]>({
    queryKey: ["realEstateIndicators", city],
    queryFn: async () => {
      try {
        // This would be replaced with the actual API call if we had access
        // const response = await fetch("https://open.data.gov.sa/ar/datasets/view/7fddc7e4-bec7-4457-b99e-5ac838cc5ac0/api");

        // For demo purposes, returning mock data that mimics API response
        return mockRealEstateIndicators.filter(
          (item) => !city || item.city === city,
        );
      } catch (error) {
        console.error("Error fetching real estate indicators:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: !!city, // Only run if city is provided
  });
};

/**
 * Fetches housing finance data from Saudi Open Data API
 */
export const useHousingFinance = (financingType?: string) => {
  return useQuery<HousingFinance[]>({
    queryKey: ["housingFinance", financingType],
    queryFn: async () => {
      try {
        // This would be replaced with the actual API call if we had access
        // const response = await fetch("https://open.data.gov.sa/ar/datasets/view/1428f67c-82e2-47aa-ba52-4e92038f6caa/api");

        // For demo purposes, returning mock data that mimics API response
        return mockHousingFinance.filter(
          (item) => !financingType || item.financingType === financingType,
        );
      } catch (error) {
        console.error("Error fetching housing finance data:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
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
 * Property types available in Saudi Arabia
 */
export const propertyTypes = [
  "شقة", // Apartment
  "فيلا", // Villa
  "دوبلكس", // Duplex
  "بيت شعبي", // Traditional house
  "قصر", // Palace/Mansion
  "استوديو", // Studio
  "ملحق", // Annex
  "مزرعة", // Farm
];

/**
 * Financing options
 */
export const financingOptions = [
  "تمويل عقاري", // Mortgage
  "كاش", // Cash
  "تقسيط مباشر", // Direct installment
];

/**
 * Average housing prices in major Saudi cities (estimates in SAR)
 */
export const cityHousingData: Record<
  string,
  {
    avgPrice: number;
    description: string;
    inflationRate: number; // Annual real estate inflation rate
    districts: Array<{
      name: string;
      priceMultiplier: number; // Relative to city average
      demandScore: number; // 1-10 scale
      futureGrowthPotential: number; // 1-10 scale
    }>;
  }
> = {
  الرياض: {
    avgPrice: 950000,
    description: "سوق عقاري نشط بأسعار متنوعة حسب الحي",
    inflationRate: 0.05, // 5% annual inflation
    districts: [
      {
        name: "حي النرجس",
        priceMultiplier: 1.2,
        demandScore: 8,
        futureGrowthPotential: 9,
      },
      {
        name: "حي العليا",
        priceMultiplier: 1.5,
        demandScore: 9,
        futureGrowthPotential: 7,
      },
      {
        name: "حي الملقا",
        priceMultiplier: 1.3,
        demandScore: 8,
        futureGrowthPotential: 8,
      },
      {
        name: "حي اليرموك",
        priceMultiplier: 0.9,
        demandScore: 7,
        futureGrowthPotential: 8,
      },
      {
        name: "حي الصحافة",
        priceMultiplier: 1.1,
        demandScore: 8,
        futureGrowthPotential: 8,
      },
    ],
  },
  جدة: {
    avgPrice: 850000,
    description: "مدينة ساحلية بخيارات سكنية متنوعة",
    inflationRate: 0.04, // 4% annual inflation
    districts: [
      {
        name: "حي الشاطئ",
        priceMultiplier: 1.4,
        demandScore: 9,
        futureGrowthPotential: 8,
      },
      {
        name: "حي الروضة",
        priceMultiplier: 1.2,
        demandScore: 8,
        futureGrowthPotential: 7,
      },
      {
        name: "حي السلامة",
        priceMultiplier: 1.1,
        demandScore: 7,
        futureGrowthPotential: 7,
      },
      {
        name: "حي الصفا",
        priceMultiplier: 1.0,
        demandScore: 7,
        futureGrowthPotential: 6,
      },
      {
        name: "حي النزهة",
        priceMultiplier: 0.9,
        demandScore: 6,
        futureGrowthPotential: 7,
      },
    ],
  },
  "مكة المكرمة": {
    avgPrice: 1200000,
    description: "أسعار مرتفعة خاصة قرب الحرم المكي",
    inflationRate: 0.06, // 6% annual inflation
    districts: [
      {
        name: "العزيزية",
        priceMultiplier: 1.3,
        demandScore: 9,
        futureGrowthPotential: 8,
      },
      {
        name: "الششة",
        priceMultiplier: 0.9,
        demandScore: 7,
        futureGrowthPotential: 7,
      },
      {
        name: "النسيم",
        priceMultiplier: 0.8,
        demandScore: 6,
        futureGrowthPotential: 8,
      },
      {
        name: "العوالي",
        priceMultiplier: 0.7,
        demandScore: 6,
        futureGrowthPotential: 7,
      },
      {
        name: "المرسلات",
        priceMultiplier: 0.8,
        demandScore: 7,
        futureGrowthPotential: 7,
      },
    ],
  },
  "المدينة المنورة": {
    avgPrice: 800000,
    description: "أسعار معتدلة مع ارتفاع قرب المسجد النبوي",
    inflationRate: 0.045, // 4.5% annual inflation
    districts: [
      {
        name: "قباء",
        priceMultiplier: 1.1,
        demandScore: 8,
        futureGrowthPotential: 8,
      },
      {
        name: "العوالي",
        priceMultiplier: 1.2,
        demandScore: 8,
        futureGrowthPotential: 7,
      },
      {
        name: "الحرة الشرقية",
        priceMultiplier: 0.9,
        demandScore: 7,
        futureGrowthPotential: 7,
      },
      {
        name: "النخيل",
        priceMultiplier: 0.8,
        demandScore: 6,
        futureGrowthPotential: 8,
      },
      {
        name: "بني حارثة",
        priceMultiplier: 0.7,
        demandScore: 6,
        futureGrowthPotential: 7,
      },
    ],
  },
  الدمام: {
    avgPrice: 750000,
    description: "مدينة صناعية بأسعار معقولة للعقارات",
    inflationRate: 0.035, // 3.5% annual inflation
    districts: [
      {
        name: "الشاطئ",
        priceMultiplier: 1.3,
        demandScore: 8,
        futureGrowthPotential: 8,
      },
      {
        name: "الروضة",
        priceMultiplier: 1.1,
        demandScore: 7,
        futureGrowthPotential: 7,
      },
      {
        name: "النزهة",
        priceMultiplier: 1.0,
        demandScore: 7,
        futureGrowthPotential: 7,
      },
      {
        name: "الفيصلية",
        priceMultiplier: 0.9,
        demandScore: 6,
        futureGrowthPotential: 7,
      },
      {
        name: "الفنار",
        priceMultiplier: 0.8,
        demandScore: 6,
        futureGrowthPotential: 6,
      },
    ],
  },
};

// Mock data for APIs
const mockRealEstatePrices: RealEstatePrice[] = [
  {
    id: 1,
    city: "الرياض",
    district: "حي النرجس",
    propertyType: "شقة",
    averagePrice: 950000,
    pricePerMeter: 5200,
    date: "2023-04-15",
  },
  {
    id: 2,
    city: "الرياض",
    district: "حي العليا",
    propertyType: "شقة",
    averagePrice: 1150000,
    pricePerMeter: 6800,
    date: "2023-04-15",
  },
  {
    id: 3,
    city: "الرياض",
    district: "حي الملقا",
    propertyType: "فيلا",
    averagePrice: 2350000,
    pricePerMeter: 4900,
    date: "2023-04-15",
  },
  {
    id: 4,
    city: "جدة",
    district: "حي الشاطئ",
    propertyType: "شقة",
    averagePrice: 1050000,
    pricePerMeter: 6100,
    date: "2023-04-15",
  },
  {
    id: 5,
    city: "جدة",
    district: "حي الروضة",
    propertyType: "فيلا",
    averagePrice: 2150000,
    pricePerMeter: 5200,
    date: "2023-04-15",
  },
  {
    id: 6,
    city: "مكة المكرمة",
    district: "العزيزية",
    propertyType: "شقة",
    averagePrice: 1250000,
    pricePerMeter: 7500,
    date: "2023-04-15",
  },
  {
    id: 7,
    city: "المدينة المنورة",
    district: "قباء",
    propertyType: "شقة",
    averagePrice: 850000,
    pricePerMeter: 4800,
    date: "2023-04-15",
  },
  {
    id: 8,
    city: "الدمام",
    district: "الشاطئ",
    propertyType: "فيلا",
    averagePrice: 1750000,
    pricePerMeter: 4200,
    date: "2023-04-15",
  },
  {
    id: 9,
    city: "الرياض",
    district: "حي النرجس",
    propertyType: "دوبلكس",
    averagePrice: 1850000,
    pricePerMeter: 5100,
    date: "2023-04-15",
  },
  {
    id: 10,
    city: "جدة",
    district: "حي الشاطئ",
    propertyType: "دوبلكس",
    averagePrice: 1950000,
    pricePerMeter: 5600,
    date: "2023-04-15",
  },
];

const mockRealEstateIndicators: RealEstateIndicator[] = [
  {
    id: 1,
    city: "الرياض",
    indicator: "مع��ل النمو",
    value: 5.2,
    year: 2023,
    quarter: 2,
  },
  {
    id: 2,
    city: "الرياض",
    indicator: "معدل الطلب",
    value: 8.7,
    year: 2023,
    quarter: 2,
  },
  {
    id: 3,
    city: "الرياض",
    indicator: "توقعات التضخم العقاري",
    value: 4.8,
    year: 2023,
    quarter: 2,
  },
  {
    id: 4,
    city: "جدة",
    indicator: "معدل النمو",
    value: 4.1,
    year: 2023,
    quarter: 2,
  },
  {
    id: 5,
    city: "جدة",
    indicator: "معدل الطلب",
    value: 7.9,
    year: 2023,
    quarter: 2,
  },
  {
    id: 6,
    city: "مكة المكرمة",
    indicator: "معدل النمو",
    value: 6.3,
    year: 2023,
    quarter: 2,
  },
  {
    id: 7,
    city: "المدينة المنورة",
    indicator: "معدل النمو",
    value: 3.9,
    year: 2023,
    quarter: 2,
  },
  {
    id: 8,
    city: "الدمام",
    indicator: "معدل النمو",
    value: 3.7,
    year: 2023,
    quarter: 2,
  },
];

const mockHousingFinance: HousingFinance[] = [
  {
    id: 1,
    financingType: "تمويل عقاري",
    amount: 950000,
    interestRate: 4.0,
    year: 2023,
    month: 6,
  },
  {
    id: 2,
    financingType: "تمويل عقاري",
    amount: 850000,
    interestRate: 4.1,
    year: 2023,
    month: 5,
  },
  {
    id: 3,
    financingType: "تمويل عقاري",
    amount: 920000,
    interestRate: 4.0,
    year: 2023,
    month: 4,
  },
  {
    id: 4,
    financingType: "تقسيط مباشر",
    amount: 650000,
    interestRate: 5.5,
    year: 2023,
    month: 6,
  },
  {
    id: 5,
    financingType: "تقسيط مباشر",
    amount: 620000,
    interestRate: 5.7,
    year: 2023,
    month: 5,
  },
];

/**
 * Get recommended district based on family size, budget, and property type
 */
export const getRecommendedDistrict = (
  city: string,
  budget: number,
  familySize: number,
  propertyType: string,
) => {
  const cityData = cityHousingData[city];
  if (!cityData) return null;

  // Filter districts that fit within budget
  const affordableDistricts = cityData.districts.filter((district) => {
    const estimatedPrice = getEstimatedPropertyPrice(
      city,
      district.name,
      propertyType,
    );
    return estimatedPrice <= budget;
  });

  if (affordableDistricts.length === 0) return null;

  // For small families, prioritize areas with good future growth
  // For larger families, prioritize areas with high demand (indicating better services, schools, etc.)
  const sortedDistricts = affordableDistricts.sort((a, b) => {
    const aScore =
      familySize <= 3
        ? a.futureGrowthPotential * 0.7 + a.demandScore * 0.3
        : a.demandScore * 0.7 + a.futureGrowthPotential * 0.3;

    const bScore =
      familySize <= 3
        ? b.futureGrowthPotential * 0.7 + b.demandScore * 0.3
        : b.demandScore * 0.7 + b.futureGrowthPotential * 0.3;

    return bScore - aScore;
  });

  return sortedDistricts[0];
};

/**
 * Get estimated property price based on city, district, and property type
 */
export const getEstimatedPropertyPrice = (
  city: string,
  district: string,
  propertyType: string,
): number => {
  // First check if we have exact match in the mock data
  const exactMatch = mockRealEstatePrices.find(
    (item) =>
      item.city === city &&
      item.district === district &&
      item.propertyType === propertyType,
  );

  if (exactMatch) {
    return exactMatch.averagePrice;
  }

  // If no exact match, calculate based on city average and district multiplier
  const cityData = cityHousingData[city];
  if (!cityData) return 0;

  const districtData = cityData.districts.find((d) => d.name === district);
  if (!districtData) return cityData.avgPrice;

  // Adjust price based on property type
  const propertyTypeMultiplier =
    propertyType === "فيلا"
      ? 2.2
      : propertyType === "دوبلكس"
        ? 1.8
        : propertyType === "شقة"
          ? 1.0
          : propertyType === "استوديو"
            ? 0.6
            : 1.0;

  return (
    cityData.avgPrice * districtData.priceMultiplier * propertyTypeMultiplier
  );
};

/**
 * Determine if renting is better than buying based on various factors
 */
export const shouldRentInsteadOfBuy = (
  city: string,
  age: number,
  budget: number,
  timeUntilRetirement: number,
): { recommendation: boolean; reasons: string[] } => {
  const cityData = cityHousingData[city];
  const reasons: string[] = [];

  // If inflation rate is very high, buying is generally better
  if (cityData && cityData.inflationRate > 0.055) {
    reasons.push(
      "معدل التضخم العقاري مرتفع في هذه المدينة، مما يجعل الشراء أفضل على المدى الطويل",
    );
  }

  // If person is older, renting might be better
  if (age > 50) {
    reasons.push(
      "نظرًا لعمرك، قد يكون الإيجار خيارًا أفضل لتجنب القروض طويلة الأجل",
    );
  }

  // If budget is very low compared to city average
  if (cityData && budget < cityData.avgPrice * 0.7) {
    reasons.push(
      "ميزانيتك أقل من متوسط أسعار العقارات في هذه المدينة، قد يكون الإيجار أكثر مرونة",
    );
  }

  // If retirement is coming soon
  if (timeUntilRetirement < 10) {
    reasons.push("اقتراب سن التقاعد يجعل الإيجار خيارًا أكثر مرونة ماليًا");
  }

  // Decision logic
  if (reasons.length >= 2) {
    return { recommendation: true, reasons };
  }

  return {
    recommendation: false,
    reasons: ["الشراء عمومًا أفضل للاستقرار طويل المدى وبناء الأصول"],
  };
};
