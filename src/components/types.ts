export type RiskLevel = 'high' | 'moderate' | 'low' | 'healthy';

export interface CropReport {
  id: string;
  date: string;
  cropName: string;
  cropCode: string;
  cropImage?: string;
  disease: string;
  riskLevel: RiskLevel;
  damage: number;
  confidence: number;
  recommendation: string;
}
