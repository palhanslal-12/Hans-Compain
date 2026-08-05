export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  imagePreviewUrl?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface BusinessCalculation {
  productType: "Ginger" | "Turmeric" | "Medicinal";
  rawCostPerKg: number;
  monthlyQuantityKg: number;
  sellingCostPerKg: number;
  machineryCost: number;
  subsidyPercentage: number;
  yieldPercentage: number;
}

export interface BusinessResult {
  rawMaterialCost: number;
  processedYieldKg: number;
  grossRevenue: number;
  netProfit: number;
  machineryWithSubsidy: number;
  subsidySaved: number;
}
