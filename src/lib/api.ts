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
 * Work locations by district - mapping work areas to nearby districts
 * This helps recommend districts close to work
 */
export const workLocationToDistricts = {
  "شمال الرياض": [
    "حي النرجس",
    "حي الياسمين",
    "حي الملقا",
    "حي القيروان",
    "حي النفل",
  ],
  "جنوب الرياض": [
    "حي الشفا",
    "حي العزيزية",
    "حي النسيم",
    "حي الدار البيضاء",
    "حي الفيحاء",
  ],
  "شرق الرياض": [
    "حي الروضة",
    "حي الرواد",
    "حي الربيع",
    "حي الريان",
    "حي النهضة",
  ],
  "غرب الرياض": [
    "حي عرقة",
    "حي العقيق",
    "حي الصحافة",
    "حي العليا",
    "حي الرحمانية",
  ],
  "وسط الرياض": [
    "حي الديرة",
    "حي المرقب",
    "حي العود",
    "حي المربع",
    "حي الرميلة",
  ],

  "شمال جدة": ["حي الشاطئ", "حي أبحر", "حي ذهبان", "حي النعيم", "حي الفيصلية"],
  "جنوب جدة": [
    "حي البوادي",
    "حي العزيزية",
    "حي القريات",
    "حي المحاميد",
    "حي الحرازات",
  ],
  "شرق جدة": [
    "حي ال��زهة",
    "حي الروضة",
    "حي الفيصلية",
    "حي النخيل",
    "حي الروابي",
  ],
  "غرب جدة": [
    "حي البلد",
    "حي الشرفية",
    "حي الحمراء",
    "حي الزهراء",
    "حي السلامة",
  ],
  "وسط جدة": [
    "حي العزيزية",
    "حي الروضة",
    "حي الفيصلية",
    "حي النزهة",
    "حي الصفا",
  ],

  "المنطقة المركزية": ["العزيزية", "النسيم", "العوالي", "الششة", "الضيافة"],
  العزيزية: ["الششة", "النسيم", "الحجون", "التيسير", "المرسلات"],
  الششة: ["العزيزية", "النسيم", "الضيافة", "العوالي", "المرسلات"],
  النسيم: ["الششة", "العزيزية", "العوالي", "الضيافة", "المرسلات"],
  العوالي: ["الششة", "النسيم", "الضيافة", "المرسلات", "التيسير"],

  "شمال الدمام": [
    "حي الشاطئ",
    "حي الحمراء",
    "حي النورس",
    "حي الناصرية",
    "حي طيبة",
  ],
  "جنوب الدمام": [
    "حي عبد الله فؤاد",
    "حي الفيصلية",
    "حي البادية",
    "حي غرناطة",
    "حي الجلوية",
  ],
  "شرق الدمام": [
    "حي الشاطئ",
    "حي البحيرة",
    "حي الهدا",
    "حي المنار",
    "حي الصفا",
  ],
  "غرب الدمام": [
    "حي النزهة",
    "حي الروضة",
    "حي الفنار",
    "حي أحد",
    "حي المزروعية",
  ],
  "وسط الدمام": [
    "حي الطبيشي",
    "حي القزاز",
    "حي الدواسر",
    "حي الخليج",
    "حي الفيصلية",
  ],
};

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
      area: string; // North, South, East, West, Central
      priceMultiplier: number; // Relative to city average
      demandScore: number; // 1-10 scale
      futureGrowthPotential: number; // 1-10 scale
      propertyTypes: {
        شقة: {
          pricePerMeter: number;
          availableSizes: number[]; // in square meters
        };
        فيلا: {
          pricePerMeter: number;
          availableSizes: number[]; // in square meters
        };
        دوبلكس: {
          pricePerMeter: number;
          availableSizes: number[]; // in square meters
        };
      };
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
        area: "شمال",
        priceMultiplier: 1.2,
        demandScore: 8,
        futureGrowthPotential: 9,
        propertyTypes: {
          شقة: {
            pricePerMeter: 5200,
            availableSizes: [120, 150, 180],
          },
          فيلا: {
            pricePerMeter: 4800,
            availableSizes: [350, 450, 550],
          },
          دوبلكس: {
            pricePerMeter: 5000,
            availableSizes: [250, 300, 350],
          },
        },
      },
      {
        name: "حي الياسمين",
        area: "شمال",
        priceMultiplier: 1.15,
        demandScore: 8,
        futureGrowthPotential: 8,
        propertyTypes: {
          شقة: {
            pricePerMeter: 5000,
            availableSizes: [110, 140, 170],
          },
          فيلا: {
            pricePerMeter: 4700,
            availableSizes: [320, 420, 520],
          },
          دوبلكس: {
            pricePerMeter: 4900,
            availableSizes: [240, 290, 340],
          },
        },
      },
      {
        name: "حي الملقا",
        area: "شمال",
        priceMultiplier: 1.3,
        demandScore: 9,
        futureGrowthPotential: 8,
        propertyTypes: {
          شقة: {
            pricePerMeter: 5500,
            availableSizes: [130, 160, 190],
          },
          فيلا: {
            pricePerMeter: 5200,
            availableSizes: [400, 500, 600],
          },
          دوبلكس: {
            pricePerMeter: 5300,
            availableSizes: [270, 320, 370],
          },
        },
      },
      {
        name: "حي العليا",
        area: "غرب",
        priceMultiplier: 1.5,
        demandScore: 9,
        futureGrowthPotential: 7,
        propertyTypes: {
          شقة: {
            pricePerMeter: 6500,
            availableSizes: [100, 130, 160],
          },
          فيلا: {
            pricePerMeter: 6200,
            availableSizes: [450, 550, 650],
          },
          دوبلكس: {
            pricePerMeter: 6300,
            availableSizes: [300, 350, 400],
          },
        },
      },
      {
        name: "حي اليرموك",
        area: "شرق",
        priceMultiplier: 0.9,
        demandScore: 7,
        futureGrowthPotential: 8,
        propertyTypes: {
          شقة: {
            pricePerMeter: 4200,
            availableSizes: [100, 130, 160],
          },
          فيلا: {
            pricePerMeter: 3900,
            availableSizes: [300, 400, 500],
          },
          دوبلكس: {
            pricePerMeter: 4000,
            availableSizes: [220, 270, 320],
          },
        },
      },
      {
        name: "حي الصحافة",
        area: "غرب",
        priceMultiplier: 1.1,
        demandScore: 8,
        futureGrowthPotential: 8,
        propertyTypes: {
          شقة: {
            pricePerMeter: 5000,
            availableSizes: [110, 140, 170],
          },
          فيلا: {
            pricePerMeter: 4700,
            availableSizes: [350, 450, 550],
          },
          دوبلكس: {
            pricePerMeter: 4800,
            availableSizes: [250, 300, 350],
          },
        },
      },
      {
        name: "حي النسيم",
        area: "جنوب",
        priceMultiplier: 0.85,
        demandScore: 6,
        futureGrowthPotential: 7,
        propertyTypes: {
          شقة: {
            pricePerMeter: 3800,
            availableSizes: [90, 120, 150],
          },
          فيلا: {
            pricePerMeter: 3500,
            availableSizes: [300, 400, 500],
          },
          دوبلكس: {
            pricePerMeter: 3600,
            availableSizes: [220, 270, 320],
          },
        },
      },
      {
        name: "حي الشفا",
        area: "جنوب",
        priceMultiplier: 0.8,
        demandScore: 6,
        futureGrowthPotential: 7,
        propertyTypes: {
          شقة: {
            pricePerMeter: 3600,
            availableSizes: [90, 120, 150],
          },
          فيلا: {
            pricePerMeter: 3300,
            availableSizes: [300, 400, 500],
          },
          دوبلكس: {
            pricePerMeter: 3400,
            availableSizes: [220, 270, 320],
          },
        },
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
        area: "شمال",
        priceMultiplier: 1.4,
        demandScore: 9,
        futureGrowthPotential: 8,
        propertyTypes: {
          شقة: {
            pricePerMeter: 5800,
            availableSizes: [110, 140, 170],
          },
          فيلا: {
            pricePerMeter: 5500,
            availableSizes: [350, 450, 550],
          },
          دوبلكس: {
            pricePerMeter: 5600,
            availableSizes: [250, 300, 350],
          },
        },
      },
      {
        name: "حي الروضة",
        area: "شرق",
        priceMultiplier: 1.2,
        demandScore: 8,
        futureGrowthPotential: 7,
        propertyTypes: {
          شقة: {
            pricePerMeter: 5000,
            availableSizes: [100, 130, 160],
          },
          فيلا: {
            pricePerMeter: 4700,
            availableSizes: [320, 420, 520],
          },
          دوبلكس: {
            pricePerMeter: 4800,
            availableSizes: [240, 290, 340],
          },
        },
      },
      {
        name: "حي السلامة",
        area: "غرب",
        priceMultiplier: 1.1,
        demandScore: 7,
        futureGrowthPotential: 7,
        propertyTypes: {
          شقة: {
            pricePerMeter: 4700,
            availableSizes: [100, 130, 160],
          },
          فيلا: {
            pricePerMeter: 4400,
            availableSizes: [320, 420, 520],
          },
          دوبلكس: {
            pricePerMeter: 4500,
            availableSizes: [240, 290, 340],
          },
        },
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
        area: "وسط",
        priceMultiplier: 1.3,
        demandScore: 9,
        futureGrowthPotential: 8,
        propertyTypes: {
          شقة: {
            pricePerMeter: 7000,
            availableSizes: [90, 120, 150],
          },
          فيلا: {
            pricePerMeter: 6700,
            availableSizes: [350, 450, 550],
          },
          دوبلكس: {
            pricePerMeter: 6800,
            availableSizes: [250, 300, 350],
          },
        },
      },
      {
        name: "الششة",
        area: "وسط",
        priceMultiplier: 0.9,
        demandScore: 7,
        futureGrowthPotential: 7,
        propertyTypes: {
          شقة: {
            pricePerMeter: 5000,
            availableSizes: [90, 120, 150],
          },
          فيلا: {
            pricePerMeter: 4700,
            availableSizes: [300, 400, 500],
          },
          دوبلكس: {
            pricePerMeter: 4800,
            availableSizes: [220, 270, 320],
          },
        },
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
        area: "وسط",
        priceMultiplier: 1.1,
        demandScore: 8,
        futureGrowthPotential: 8,
        propertyTypes: {
          شقة: {
            pricePerMeter: 4600,
            availableSizes: [100, 130, 160],
          },
          فيلا: {
            pricePerMeter: 4300,
            availableSizes: [320, 420, 520],
          },
          دوبلكس: {
            pricePerMeter: 4400,
            availableSizes: [240, 290, 340],
          },
        },
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
        area: "شمال",
        priceMultiplier: 1.3,
        demandScore: 8,
        futureGrowthPotential: 8,
        propertyTypes: {
          شقة: {
            pricePerMeter: 4400,
            availableSizes: [110, 140, 170],
          },
          فيلا: {
            pricePerMeter: 4100,
            availableSizes: [350, 450, 550],
          },
          دوبلكس: {
            pricePerMeter: 4200,
            availableSizes: [250, 300, 350],
          },
        },
      },
    ],
  },
};

/**
 * Find the best district based on work location, budget, and family needs
 * @param city The city
 * @param workLocation Work location area
 * @param budget Maximum budget
 * @param familySize Family size
 * @param requiredRooms Required number of rooms
 * @returns Object with recommended district, property type, and details
 */
export const findBestDistrictAndProperty = (
  city: string,
  workLocation: string,
  budget: number,
  familySize: number,
  requiredRooms: number,
): {
  district: string;
  propertyType: string;
  propertySize: number;
  estimatedPrice: number;
  monthlyRent: number;
  reasons: string[];
} => {
  // Default return if no match is found
  const defaultReturn = {
    district: "",
    propertyType: "",
    propertySize: 0,
    estimatedPrice: 0,
    monthlyRent: 0,
    reasons: ["لم يتم العثور على توصيات مناسبة للمعايير المحددة"],
  };

  // Get city data
  const cityData = cityHousingData[city];
  if (!cityData) return defaultReturn;

  // Get districts near work location
  const nearbyDistricts =
    workLocationToDistricts[
      workLocation as keyof typeof workLocationToDistricts
    ] || [];

  // Map required rooms to property types and sizes
  let recommendedPropertyType = "شقة"; // Default
  let minSize = 90; // Default minimum size in sqm

  if (requiredRooms >= 4 || familySize >= 6) {
    recommendedPropertyType = "فيلا";
    minSize = 300;
  } else if (requiredRooms >= 3 || familySize >= 4) {
    recommendedPropertyType = "دوبلكس";
    minSize = 220;
  } else {
    recommendedPropertyType = "شقة";
    minSize = 90 + (requiredRooms - 1) * 30; // 30 sqm per additional room
  }

  // Find districts that match our criteria - prioritize those near work
  const candidateDistricts = cityData.districts.filter((district) => {
    // Check if district is near work location
    const isNearWork = nearbyDistricts.includes(district.name);

    // Check if property type is available in this district
    const propertyTypeData =
      district.propertyTypes[
        recommendedPropertyType as keyof typeof district.propertyTypes
      ];
    if (!propertyTypeData) return false;

    // Find available size that meets our needs
    const availableSize = propertyTypeData.availableSizes.find(
      (size) => size >= minSize,
    );
    if (!availableSize) return false;

    // Calculate estimated price
    const estimatedPrice = propertyTypeData.pricePerMeter * availableSize;

    // Check if within budget
    return (
      estimatedPrice <= budget && (isNearWork || nearbyDistricts.length === 0)
    );
  });

  // If no matches near work, try any district in the city
  const allCandidateDistricts =
    candidateDistricts.length > 0
      ? candidateDistricts
      : cityData.districts.filter((district) => {
          const propertyTypeData =
            district.propertyTypes[
              recommendedPropertyType as keyof typeof district.propertyTypes
            ];
          if (!propertyTypeData) return false;

          const availableSize = propertyTypeData.availableSizes.find(
            (size) => size >= minSize,
          );
          if (!availableSize) return false;

          const estimatedPrice = propertyTypeData.pricePerMeter * availableSize;
          return estimatedPrice <= budget;
        });

  // If still no matches, try smaller property types
  if (allCandidateDistricts.length === 0) {
    if (recommendedPropertyType === "فيلا") {
      recommendedPropertyType = "دوبلكس";
      minSize = 220;
    } else if (recommendedPropertyType === "دوبلكس") {
      recommendedPropertyType = "شقة";
      minSize = 90 + (requiredRooms - 1) * 30;
    } else {
      minSize = Math.max(90, minSize - 30); // Reduce size by 30 sqm
    }

    // Try again with reduced criteria
    return findBestDistrictAndProperty(
      city,
      workLocation,
      budget,
      familySize,
      requiredRooms - 1,
    );
  }

  // Sort candidates by combination of proximity to work, demand score, and future growth
  const sortedDistricts = allCandidateDistricts.sort((a, b) => {
    const aIsNearWork = nearbyDistricts.includes(a.name) ? 1 : 0;
    const bIsNearWork = nearbyDistricts.includes(b.name) ? 1 : 0;

    // Create a combined score (60% proximity, 25% demand, 15% growth)
    const aScore =
      aIsNearWork * 60 + a.demandScore * 2.5 + a.futureGrowthPotential * 1.5;
    const bScore =
      bIsNearWork * 60 + b.demandScore * 2.5 + b.futureGrowthPotential * 1.5;

    return bScore - aScore;
  });

  // Select the best district
  const bestDistrict = sortedDistricts[0];
  if (!bestDistrict) return defaultReturn;

  // Get property data
  const propertyData =
    bestDistrict.propertyTypes[
      recommendedPropertyType as keyof typeof bestDistrict.propertyTypes
    ];
  if (!propertyData) return defaultReturn;

  // Find the best size that meets our needs
  const availableSizes = propertyData.availableSizes.filter(
    (size) => size >= minSize,
  );
  const bestSize =
    availableSizes.length > 0
      ? Math.min(...availableSizes)
      : propertyData.availableSizes[0];

  // Calculate price
  const estimatedPrice = propertyData.pricePerMeter * bestSize;

  // Calculate monthly rent (typically 5% annual return on property value)
  const monthlyRent = Math.round((estimatedPrice * 0.05) / 12);

  // Generate reasons for recommendation
  const reasons = [];
  if (nearbyDistricts.includes(bestDistrict.name)) {
    reasons.push(`قريب من منطقة العمل في ${workLocation}`);
  }
  reasons.push(
    `يناسب حجم الأسرة (${familySize} أفراد) ويوفر ${requiredRooms} غرف`,
  );
  reasons.push(
    `${bestDistrict.name} منطقة ذات طلب مرتفع (${bestDistrict.demandScore}/10) ومستقبل واعد (${bestDistrict.futureGrowthPotential}/10)`,
  );

  if (estimatedPrice <= budget * 0.9) {
    reasons.push("ضمن الميزانية المتاحة مع هامش أمان جيد");
  }

  return {
    district: bestDistrict.name,
    propertyType: recommendedPropertyType,
    propertySize: bestSize,
    estimatedPrice,
    monthlyRent,
    reasons,
  };
};

/**
 * Analyze budget, income, and retirement to determine optimal ownership strategy
 */
export const analyzeOwnershipStrategy = (
  monthlyIncome: number,
  monthlyObligations: number,
  age: number,
  yearsUntilRetirement: number,
  city: string,
  mortgageInterestRate: number,
  budget: number,
): {
  recommended: "buy" | "rent";
  financingOption: string;
  monthlyPayment: number;
  loanAmount: number;
  loanTerm: number;
  downPayment: number;
  reasons: string[];
} => {
  const netIncome = monthlyIncome - monthlyObligations;
  const cityData = cityHousingData[city];
  const reasons: string[] = [];

  // Default values
  let recommended: "buy" | "rent" = "buy";
  let financingOption = "تمويل عقاري";
  let loanAmount = 0;
  let loanTerm = 0;
  let downPayment = 0;
  let monthlyPayment = 0;

  // Determine if buying is better than renting

  // 1. Age and retirement considerations
  if (age > 50 || yearsUntilRetirement < 15) {
    reasons.push("اقتراب سن التقاعد يجعل فترة القرض العقاري أقصر");
    if (yearsUntilRetirement < 10) {
      recommended = "rent";
      reasons.push("قرب التقاعد يجعل الإيجار خياراً أكثر مرونة ماليًا");
    }
  }

  // 2. Market conditions
  if (cityData) {
    if (cityData.inflationRate > 0.05) {
      reasons.push(
        "معدل التضخم العقاري مرتفع في المدينة، مما يجعل التملك استثماراً جيداً",
      );
    } else {
      reasons.push(
        "معدل التضخم العقاري معتدل، مما يجعل كلا الخيارين (التملك والإيجار) مناسبين",
      );
    }
  }

  // 3. Financial health
  const affordabilityRatio = (netIncome * 0.35) / netIncome;
  if (affordabilityRatio < 0.3) {
    reasons.push(
      "نسبة الاستقطاع من الدخل منخفضة، مما يشير إلى قدرة مالية جيدة على التملك",
    );
  } else if (affordabilityRatio > 0.45) {
    recommended = "rent";
    reasons.push(
      "نسبة الاستقطاع من الدخل مرتفعة، قد يكون الإيجار أكثر أماناً ماليًا",
    );
  }

  // If buying is recommended, determine financing option
  if (recommended === "buy") {
    // Calculate mortgage terms
    loanTerm = Math.min(25, yearsUntilRetirement + 5);
    downPayment = budget * 0.2; // 20% down payment
    loanAmount = budget * 0.8; // 80% loan

    // Calculate monthly payment using the mortgage formula
    const monthlyRate = mortgageInterestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Check if monthly payment is affordable (should be < 35% of net income)
    if (monthlyPayment > netIncome * 0.35) {
      // Try increasing down payment to make it affordable
      const maxLoanAmount =
        (netIncome * 0.35 * (Math.pow(1 + monthlyRate, numberOfPayments) - 1)) /
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));

      if (maxLoanAmount + downPayment < budget) {
        // Needs higher down payment
        downPayment = budget - maxLoanAmount;
        loanAmount = maxLoanAmount;
        monthlyPayment = netIncome * 0.35;

        if (downPayment > budget * 0.5) {
          // If down payment needs to be more than 50%, maybe renting is better
          recommended = "rent";
          reasons.push(
            "التملك يتطلب دفعة أولى كبيرة، الإيجار قد يكون أكثر مرونة",
          );
        } else {
          reasons.push(
            `الدفعة الأولى المطلوبة: ${Math.round(downPayment)} ريال (${Math.round((downPayment / budget) * 100)}% من قيمة العقار)`,
          );
        }
      }
    } else {
      reasons.push("القسط الشهري للتمويل العقاري ضمن حدود الميزانية المتاحة");
    }
  }

  return {
    recommended,
    financingOption,
    monthlyPayment,
    loanAmount,
    loanTerm,
    downPayment,
    reasons,
  };
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
    indicator: "معدل النمو",
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
