export const sampleDocuments = [
  {
    id: "doc_001",
    productName: "MacBook Pro 16\" M3 Max",
    brand: "Apple",
    modelNumber: "A2991 (MRW23LL/A)",
    serialNumber: "C02G8490MD6R",
    invoiceNumber: "INV-APL-2024-88912",
    retailer: "Apple Store Regent Street",
    paymentMethod: "Apple Pay (Visa ****4821)",
    purchaseDate: "2024-01-15",
    purchasePrice: 3499.00,
    currency: "USD",
    warrantyType: "AppleCare+ Extended",
    warrantyPeriodMonths: 36,
    warrantyExpiryDate: "2027-01-15",
    extendedWarranty: {
      hasExtended: true,
      provider: "AppleCare+ with Theft and Loss",
      expiryDate: "2027-01-15",
      cost: 399.00,
      status: "Active"
    },
    status: "Valid",
    category: "Laptops & Computers",
    vaultId: "family_main",
    assignedTo: "Dhyey Bhatt",
    confidenceScore: 0.98,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    receiptUrl: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80",
    tags: ["Work", "Primary Device", "High Value"],
    notes: "Includes 3 years of accidental damage coverage with $99 tier 1 deductible.",
    claimHistory: [],
    extractedFields: {
      productName: { value: "MacBook Pro 16\" M3 Max", confidence: 0.99 },
      brand: { value: "Apple", confidence: 0.99 },
      modelNumber: { value: "A2991", confidence: 0.97 },
      serialNumber: { value: "C02G8490MD6R", confidence: 0.98 },
      invoiceNumber: { value: "INV-APL-2024-88912", confidence: 0.96 },
      paymentMethod: { value: "Apple Pay (Visa)", confidence: 0.95 },
      warrantyType: { value: "AppleCare+ Extended", confidence: 0.98 },
      extendedWarranty: { value: "3 Years Comprehensive", confidence: 0.97 }
    }
  },
  {
    id: "doc_002",
    productName: "Galaxy S24 Ultra 512GB",
    brand: "Samsung",
    modelNumber: "SM-S928B/DS",
    serialNumber: "R5CW1098KLZ",
    invoiceNumber: "SAM-US-9902341",
    retailer: "Best Buy Electronics",
    paymentMethod: "Credit Card (Mastercard ****9012)",
    purchaseDate: "2024-02-10",
    purchasePrice: 1419.99,
    currency: "USD",
    warrantyType: "Manufacturer Standard",
    warrantyPeriodMonths: 12,
    warrantyExpiryDate: "2025-02-10",
    extendedWarranty: {
      hasExtended: false,
      provider: "Samsung Care+ (Eligible for purchase)",
      expiryDate: null,
      cost: 169.00,
      status: "Not Enrolled"
    },
    status: "Expiring Soon",
    category: "Smartphones & Tablets",
    vaultId: "family_main",
    assignedTo: "Sarah Bhatt",
    confidenceScore: 0.95,
    imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80",
    receiptUrl: "https://images.unsplash.com/photo-1554415707-9e4c018a482d?auto=format&fit=crop&w=600&q=80",
    tags: ["Personal", "Mobile", "OLED Display"],
    notes: "1 year manufacturer limited warranty covering hardware defects.",
    claimHistory: [],
    extractedFields: {
      productName: { value: "Galaxy S24 Ultra 512GB", confidence: 0.96 },
      brand: { value: "Samsung", confidence: 0.99 },
      modelNumber: { value: "SM-S928B/DS", confidence: 0.94 },
      serialNumber: { value: "R5CW1098KLZ", confidence: 0.95 },
      invoiceNumber: { value: "SAM-US-9902341", confidence: 0.98 },
      paymentMethod: { value: "Mastercard ****9012", confidence: 0.92 },
      warrantyType: { value: "Manufacturer Standard", confidence: 0.95 },
      extendedWarranty: { value: "None Detected", confidence: 0.90 }
    }
  },
  {
    id: "doc_003",
    productName: "OLED Evo 65\" 4K Smart TV",
    brand: "LG",
    modelNumber: "OLED65C3PUA",
    serialNumber: "305NDTK8Y321",
    invoiceNumber: "CRTC-INV-77401",
    retailer: "Costco Wholesale",
    paymentMethod: "Debit Card (Visa ****3341)",
    purchaseDate: "2023-08-20",
    purchasePrice: 1699.00,
    currency: "USD",
    warrantyType: "Extended Plan (Allstate 5-Yr)",
    warrantyPeriodMonths: 60,
    warrantyExpiryDate: "2028-08-20",
    extendedWarranty: {
      hasExtended: true,
      provider: "Allstate 5-Year Protection Plan",
      expiryDate: "2028-08-20",
      cost: 149.00,
      status: "Active"
    },
    status: "Valid",
    category: "Home Appliances",
    vaultId: "family_main",
    assignedTo: "Family Shared",
    confidenceScore: 0.96,
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80",
    receiptUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80",
    tags: ["Living Room", "Entertainment", "Allstate 5Yr"],
    notes: "Covered for burn-in, power surges, and panel replacement.",
    claimHistory: [],
    extractedFields: {
      productName: { value: "LG OLED Evo 65\" C3", confidence: 0.97 },
      brand: { value: "LG Electronics", confidence: 0.99 },
      modelNumber: { value: "OLED65C3PUA", confidence: 0.96 },
      serialNumber: { value: "305NDTK8Y321", confidence: 0.95 },
      invoiceNumber: { value: "CRTC-INV-77401", confidence: 0.94 },
      paymentMethod: { value: "Visa Debit", confidence: 0.93 },
      warrantyType: { value: "Allstate 5-Year Extended", confidence: 0.97 },
      extendedWarranty: { value: "Enrolled (5 Years)", confidence: 0.98 }
    }
  },
  {
    id: "doc_004",
    productName: "WH-1000XM5 Wireless Headphones",
    brand: "Sony",
    modelNumber: "WH1000XM5/B",
    serialNumber: "SN5829104",
    invoiceNumber: "AMZN-2023-4412",
    retailer: "Amazon.com",
    paymentMethod: "Amazon Store Card",
    purchaseDate: "2023-03-10",
    purchasePrice: 398.00,
    currency: "USD",
    warrantyType: "Manufacturer Standard",
    warrantyPeriodMonths: 12,
    warrantyExpiryDate: "2024-03-10",
    extendedWarranty: {
      hasExtended: false,
      provider: "None",
      expiryDate: null,
      cost: 0,
      status: "Expired"
    },
    status: "Expired",
    category: "Audio & Wearables",
    vaultId: "family_main",
    assignedTo: "Dhyey Bhatt",
    confidenceScore: 0.94,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    receiptUrl: "https://images.unsplash.com/photo-1554415707-9e4c018a482d?auto=format&fit=crop&w=600&q=80",
    tags: ["Audio", "Travel", "ANC"],
    notes: "Original 1-year warranty has lapsed. Eligible for out-of-warranty authorized battery service.",
    claimHistory: [],
    extractedFields: {
      productName: { value: "Sony WH-1000XM5", confidence: 0.98 },
      brand: { value: "Sony", confidence: 0.99 },
      modelNumber: { value: "WH1000XM5/B", confidence: 0.95 },
      serialNumber: { value: "SN5829104", confidence: 0.92 },
      invoiceNumber: { value: "AMZN-2023-4412", confidence: 0.96 },
      paymentMethod: { value: "Amazon Store Card", confidence: 0.94 },
      warrantyType: { value: "1 Year Limited", confidence: 0.96 },
      extendedWarranty: { value: "None", confidence: 0.97 }
    }
  },
  {
    id: "doc_005",
    productName: "Dyson V15 Detect Cordless Vacuum",
    brand: "Dyson",
    modelNumber: "368340-01",
    serialNumber: "DYS-99482-V15",
    invoiceNumber: "DYS-DIR-40912",
    retailer: "Dyson Official Store",
    paymentMethod: "PayPal (Amex ****1004)",
    purchaseDate: "2023-11-28",
    purchasePrice: 749.99,
    currency: "USD",
    warrantyType: "Manufacturer 2-Year Full",
    warrantyPeriodMonths: 24,
    warrantyExpiryDate: "2025-11-28",
    extendedWarranty: {
      hasExtended: false,
      provider: "Dyson Complete Care (Optional)",
      expiryDate: null,
      cost: 89.00,
      status: "Eligible"
    },
    status: "Valid",
    category: "Home Appliances",
    vaultId: "family_main",
    assignedTo: "Family Shared",
    confidenceScore: 0.97,
    imageUrl: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80",
    receiptUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80",
    tags: ["Cleaning", "Home", "2-Year Warranty"],
    notes: "Official 2-year warranty covers motor, battery replacement, and cyclone assembly.",
    claimHistory: [],
    extractedFields: {
      productName: { value: "Dyson V15 Detect", confidence: 0.98 },
      brand: { value: "Dyson", confidence: 0.99 },
      modelNumber: { value: "368340-01", confidence: 0.94 },
      serialNumber: { value: "DYS-99482-V15", confidence: 0.96 },
      invoiceNumber: { value: "DYS-DIR-40912", confidence: 0.95 },
      paymentMethod: { value: "PayPal", confidence: 0.93 },
      warrantyType: { value: "2-Year Dyson Manufacturer", confidence: 0.97 },
      extendedWarranty: { value: "Not Active", confidence: 0.92 }
    }
  },
  {
    id: "doc_006",
    productName: "800 Series Smart Dishwasher",
    brand: "Bosch",
    modelNumber: "SHPM78Z55N",
    serialNumber: "BSH-9182049",
    invoiceNumber: "HD-PRO-981245",
    retailer: "The Home Depot",
    paymentMethod: "Home Depot Commercial Card",
    purchaseDate: "2024-05-12",
    purchasePrice: 1299.00,
    currency: "USD",
    warrantyType: "Manufacturer Standard + Tub Guarantee",
    warrantyPeriodMonths: 12,
    warrantyExpiryDate: "2025-05-12",
    extendedWarranty: {
      hasExtended: true,
      provider: "Home Depot 3-Year Protection Plan",
      expiryDate: "2027-05-12",
      cost: 129.00,
      status: "Active"
    },
    status: "Valid",
    category: "Home Appliances",
    vaultId: "family_main",
    assignedTo: "Family Shared",
    confidenceScore: 0.97,
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    receiptUrl: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80",
    tags: ["Kitchen", "Major Appliance", "Water Protection"],
    notes: "Lifetime warranty against rust-through of stainless steel inner tub.",
    claimHistory: [],
    extractedFields: {
      productName: { value: "Bosch 800 Series Dishwasher", confidence: 0.98 },
      brand: { value: "Bosch", confidence: 0.99 },
      modelNumber: { value: "SHPM78Z55N", confidence: 0.96 },
      serialNumber: { value: "BSH-9182049", confidence: 0.95 },
      invoiceNumber: { value: "HD-PRO-981245", confidence: 0.97 },
      paymentMethod: { value: "Home Depot Card", confidence: 0.94 },
      warrantyType: { value: "1-Yr Base + Lifetime Rust", confidence: 0.96 },
      extendedWarranty: { value: "3-Yr HD Protection Plan", confidence: 0.98 }
    }
  }
];

export const failureRiskKnowledgeBase = {
  "Laptops & Computers": {
    failureModes: [
      {
        component: "Display Hinge & Cable Flex",
        typicalOnsetMonths: 18,
        failureProbability24m: 0.28,
        severity: "Medium-High",
        estimatedRepairCost: 350,
        symptoms: "Stiff resistance when opening, clicking noise, intermittent screen flickering when tilted.",
        communityInsight: "Over 2,400 user reports indicate hinge torque looseness or overtightening occurring at 14-20 months of regular daily usage."
      },
      {
        component: "Lithium Polymer Battery Degradation",
        typicalOnsetMonths: 24,
        failureProbability24m: 0.42,
        severity: "Medium",
        estimatedRepairCost: 249,
        symptoms: "Health drops below 80%, unexpected shutdown at 20% capacity, trackpad click stiffness.",
        communityInsight: "High cycle counts (500+) combined with high heat cause accelerated capacity loss after 20 months."
      },
      {
        component: "SSD Controller / NAND Wearout",
        typicalOnsetMonths: 48,
        failureProbability24m: 0.08,
        severity: "Critical",
        estimatedRepairCost: 800,
        symptoms: "Read-only file system lock, kernel panic, freeze during high disk write.",
        communityInsight: "Soldered memory units require full logic board replacement if failure occurs out of warranty."
      }
    ]
  },
  "Smartphones & Tablets": {
    failureModes: [
      {
        component: "AMOLED / OLED Screen Vertical Line Issue",
        typicalOnsetMonths: 14,
        failureProbability24m: 0.22,
        severity: "High",
        estimatedRepairCost: 280,
        symptoms: "Green/pink vertical line appearing after minor software update or thermal spike.",
        communityInsight: "Bonding wire degradation near flex connector is widely documented across Reddit and community forums."
      },
      {
        component: "USB-C Fast Charging Port Wear",
        typicalOnsetMonths: 20,
        failureProbability24m: 0.31,
        severity: "Low-Medium",
        estimatedRepairCost: 85,
        symptoms: "Loose cable fit, moisture detected false alert, only charges at 5W rate.",
        communityInsight: "Debris accumulation & pin flex fatigue after ~800 plug/unplug cycles."
      },
      {
        component: "Camera Optical Image Stabilization (OIS) Actuator",
        typicalOnsetMonths: 22,
        failureProbability24m: 0.15,
        severity: "Medium",
        estimatedRepairCost: 190,
        symptoms: "Buzzing sound when opening camera, blurred focus, vibration waves in video.",
        communityInsight: "Motorcycle mount vibrations and high drop shocks accelerate actuator failure."
      }
    ]
  },
  "Home Appliances": {
    failureModes: [
      {
        component: "Inverter Compressor / Heat Pump Motor",
        typicalOnsetMonths: 42,
        failureProbability24m: 0.12,
        severity: "Critical",
        estimatedRepairCost: 480,
        symptoms: "Loud humming rattle, inability to reach target temperature, tripping circuit breaker.",
        communityInsight: "Voltage fluctuations and condenser coil dust accumulation increase thermal stress on the inverter board."
      },
      {
        component: "Main PCB Control Board",
        typicalOnsetMonths: 30,
        failureProbability24m: 0.18,
        severity: "High",
        estimatedRepairCost: 290,
        symptoms: "Error code E09/E15, unresponsive touch control, program mid-cycle termination.",
        communityInsight: "Power surges and micro-moisture seepage account for 68% of PCB failures between months 24-36."
      },
      {
        component: "Water Drainage Pump & Impeller",
        typicalOnsetMonths: 26,
        failureProbability24m: 0.24,
        severity: "Medium",
        estimatedRepairCost: 160,
        symptoms: "Water not draining completely, high pitch whining during drain cycle.",
        communityInsight: "Mineral scaling and foreign debris wear out impeller bearings over 2-3 years."
      }
    ]
  },
  "Audio & Wearables": {
    failureModes: [
      {
        component: "Headband Swivel & Friction Joint",
        typicalOnsetMonths: 15,
        failureProbability24m: 0.35,
        severity: "Medium",
        estimatedRepairCost: 120,
        symptoms: "Hairline crack at extension slider, loss of clamping force, creaking audio.",
        communityInsight: "Stress fatigue on polymer hinges is cited in 40% of extended user reviews after 1 year."
      },
      {
        component: "Active Noise Cancellation (ANC) Microphones",
        typicalOnsetMonths: 20,
        failureProbability24m: 0.19,
        severity: "Medium-High",
        estimatedRepairCost: 180,
        symptoms: "High-pitched screeching/feedback loop when moving earcups or touching mesh.",
        communityInsight: "Moisture ingress into feedback mic cavity causes diaphragm resonance issues."
      }
    ]
  }
};

export const familyVaultMembers = [
  {
    id: "user_01",
    name: "Dhyey Bhatt",
    email: "dhyey@vendorbridge.local",
    role: "Admin (Owner)",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    assignedDocumentsCount: 3,
    permissions: ["Full Access", "Manage Vault", "Export Datasets", "Trigger AI Training", "Delete Documents"]
  },
  {
    id: "user_02",
    name: "Sarah Bhatt",
    email: "sarah@vendorbridge.local",
    role: "Editor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    assignedDocumentsCount: 2,
    permissions: ["Upload Documents", "Edit Extracted Info", "Generate Claims", "View Risk Predictions"]
  },
  {
    id: "user_03",
    name: "Liam Bhatt",
    email: "liam@vendorbridge.local",
    role: "Viewer",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    assignedDocumentsCount: 1,
    permissions: ["View Documents", "Download Invoices", "Ask AI Assistant"]
  }
];

export const aiTrainingDataset = [
  {
    id: "train_001",
    documentType: "Electronics Receipt",
    imageFile: "receipt_apple_m3.jpg",
    ocrRawText: "APPLE STORE REGENT STREET\nINV-APL-2024-88912\nDate: 15/01/2024\nMacBook Pro 16 M3 Max A2991\nSerial: C02G8490MD6R\nTotal: $3,499.00\nAppleCare+ 3-Year Plan included\nPaid via Apple Pay",
    groundTruth: {
      productName: "MacBook Pro 16\" M3 Max",
      brand: "Apple",
      modelNumber: "A2991",
      serialNumber: "C02G8490MD6R",
      invoiceNumber: "INV-APL-2024-88912",
      paymentMethod: "Apple Pay",
      warrantyType: "AppleCare+ Extended",
      extendedWarranty: "3 Years Comprehensive",
      warrantyMonths: 36
    },
    userVerified: true,
    verificationTimestamp: "2024-01-16T10:45:00Z"
  },
  {
    id: "train_002",
    documentType: "Smartphone Tax Invoice",
    imageFile: "bestbuy_samsung_s24.jpg",
    ocrRawText: "BEST BUY RETAIL STORE #491\nInvoice: SAM-US-9902341\nDate: 10 Feb 2024\nSamsung Galaxy S24 Ultra 512GB (SM-S928B/DS)\nIMEI/SN: R5CW1098KLZ\nTotal Amount: $1419.99\n1 Yr Mfr Warranty applies\nMastercard ending in 9012",
    groundTruth: {
      productName: "Galaxy S24 Ultra 512GB",
      brand: "Samsung",
      modelNumber: "SM-S928B/DS",
      serialNumber: "R5CW1098KLZ",
      invoiceNumber: "SAM-US-9902341",
      paymentMethod: "Mastercard ****9012",
      warrantyType: "Manufacturer Standard",
      extendedWarranty: "None",
      warrantyMonths: 12
    },
    userVerified: true,
    verificationTimestamp: "2024-02-11T14:20:00Z"
  },
  {
    id: "train_003",
    documentType: "Appliance Warranty Card",
    imageFile: "lg_oled_costco_card.jpg",
    ocrRawText: "COSTCO WHOLESALE\nLG OLED Evo 65 4K Smart TV OLED65C3PUA\nSerial: 305NDTK8Y321\nInvoice Ref: CRTC-INV-77401\nPurchase Date: Aug 20 2023\nAllstate 5-Year Protection Plan Enrolled\nDebit Visa ****3341",
    groundTruth: {
      productName: "OLED Evo 65\" 4K Smart TV",
      brand: "LG",
      modelNumber: "OLED65C3PUA",
      serialNumber: "305NDTK8Y321",
      invoiceNumber: "CRTC-INV-77401",
      paymentMethod: "Debit Card",
      warrantyType: "Extended Plan (Allstate 5-Yr)",
      extendedWarranty: "Allstate 5-Year Protection Plan",
      warrantyMonths: 60
    },
    userVerified: true,
    verificationTimestamp: "2023-08-22T09:15:00Z"
  }
];
