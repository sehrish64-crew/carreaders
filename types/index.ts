export type AnalysisStatus = "Pending" | "Paid" | "Processing" | "Delivered";

export type Severity = "Low" | "Medium" | "High" | "Critical";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface AiIssue {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  repairEstimate: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  description: string;
  hidden: boolean;
}

export interface AiAnalysisResponse {
  score?: number;
  conditionScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  issues: AiIssue[];
  summary: string;
  rawPredictions?: any[];
}
