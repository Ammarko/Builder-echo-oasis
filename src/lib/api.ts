// Saudi cities data
export const saudiCities = [
  "الرياض",
  "جدة", 
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الظهران",
  "تبوك",
  "بريدة",
  "خميس مشيط",
  "حائل",
  "نجران",
  "الجبيل",
  "الطائف",
  "ينبع",
  "أبها",
  "عرعر",
  "سكاكا",
  "جازان",
  "القطيف"
];

// Housing data for major cities
export const cityHousingData: Record<string, any> = {
  "الرياض": {
    averagePrice: 800000,
    averageRent: 3500,
    districts: ["الملقا", "النرجس", "الياسمين", "الربوة", "العليا", "الحمراء"],
    pricePerSqm: 4000
  },
  "جدة": {
    averagePrice: 750000,
    averageRent: 3200,
    districts: ["الروضة", "الزهراء", "النزهة", "الشاطئ", "البساتين", "الصفا"],
    pricePerSqm: 3800
  },
  "مكة المكرمة": {
    averagePrice: 650000,
    averageRent: 2800,
    districts: ["العزيزية", "الششة", "النسيم", "العوالي", "الكعكية", "الرصيفة"],
    pricePerSqm: 3500
  },
  "المدينة المنورة": {
    averagePrice: 600000,
    averageRent: 2500,
    districts: ["قباء", "العوالي", "الحرة الشرقية", "النخيل", "الدفاع", "الأزهري"],
    pricePerSqm: 3200
  },
  "الدمام": {
    averagePrice: 700000,
    averageRent: 3000,
    districts: ["الفيصلية", "الشاطئ", "الجلوية", "الأندلس", "الضباب", "الفردوس"],
    pricePerSqm: 3600
  }
};

// Property recommendation logic
export const getPropertyRecommendation = (
  budget: number,
  city: string,
  workLocation: string,
  familySize: number,
  requiredRooms: number,
  age: number
) => {
  const cityData = cityHousingData[city] || cityHousingData["الرياض"];
  
  // Determine property type based on family size and budget
  let propertyType = "شقة";
  let propertySize = 120;
  
  if (familySize <= 2) {
    propertyType = "شقة";
    propertySize = 80;
  } else if (familySize <= 4) {
    propertyType = "شقة";
    propertySize = 120;
  } else if (familySize <= 6) {
    if (budget > cityData.averagePrice * 1.5) {
      propertyType = "فيلا";
      propertySize = 200;
    } else {
      propertyType = "دوبلكس";
      propertySize = 160;
    }
  } else {
    propertyType = "فيلا";
    propertySize = 250;
  }

  // Calculate estimated price based on property size and city
  const estimatedPrice = propertySize * cityData.pricePerSqm;
  const monthlyRent = Math.round(estimatedPrice * 0.004); // 4% annual rent yield

  // Determine ownership recommendation
  const yearsUntilRetirement = Math.max(0, 65 - age);
  let ownershipRecommendation: "buy" | "rent" = "buy";
  
  if (yearsUntilRetirement < 10) {
    ownershipRecommendation = "rent";
  } else if (budget < estimatedPrice * 0.8) {
    ownershipRecommendation = "rent";
  }

  // Select appropriate district
  const districts = cityData.districts || ["المنطقة المركزية"];
  const district = districts[Math.floor(Math.random() * districts.length)];

  // Generate reasons for recommendation
  const reasons = [];
  const propertyReasons = [];

  if (ownershipRecommendation === "buy") {
    reasons.push("لديك فترة كافية حتى التقاعد لسداد القرض العقاري");
    reasons.push("التملك يوفر استقرار سكني طويل المدى");
    reasons.push("العقار استثمار جيد في المملكة العربية السعودية");
    if (budget >= estimatedPrice) {
      reasons.push("ميزانيتك تسمح بشراء العقار المناسب");
    }
  } else {
    reasons.push("الإيجار يوفر مرونة أكبر في الانتقال");
    reasons.push("لا يتطلب دفعة أولى كبيرة");
    if (yearsUntilRetirement < 10) {
      reasons.push("قرب سن التقاعد يجعل الإيجار خياراً أكثر أماناً");
    }
    if (budget < estimatedPrice * 0.8) {
      reasons.push("الميزانية الحالية لا تكفي لشراء العقار المناسب");
    }
  }

  propertyReasons.push(`${propertyType} مناسب لحجم أسرتك (${familySize} أفراد)`);
  propertyReasons.push(`المساحة ${propertySize} م² توفر راحة كافية`);
  propertyReasons.push(`حي ${district} قريب من منطقة عملك`);
  propertyReasons.push(`الأسعار في ${city} مناسبة لميزانيتك`);

  return {
    propertyType,
    propertySize,
    estimatedPrice,
    monthlyRent,
    ownershipRecommendation,
    district,
    reasons,
    propertyReasons,
    isAffordable: budget >= estimatedPrice * 0.8,
    loanAmount: estimatedPrice * 0.8,
    financingOption: "تمويل عقاري تقليدي"
  };
};