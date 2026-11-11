export type RiskSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type RiskLevel = 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Very High Risk';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface DetectedClause {
  ruleId: string;
  riskCategory: string;
  matchedClauseText: string;
  pageNumber: number | null;
  startIndex: number;
  endIndex: number;
  severity: RiskSeverity;
  riskExplanation: string;
  whyItMatters: string;
  suggestedQuestions: string[];
  suggestedNegotiationPoints: string[];
}

export interface SeverityBreakdown {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface AiEnhancement {
  executiveSummary?: string;
  contextualConcerns?: string[];
  negotiationStrategy?: string[];
  enhancedClauses?: {
    ruleId: string;
    plainEnglishExplanation?: string;
    laymanTakeaway?: string;
    specificCounterProposal?: string;
  }[];
}

export interface Analysis {
  _id: string;
  userId: string;
  contractId: string;
  contractName: string;
  contractType: string;
  riskScore: number;
  riskLevel: RiskLevel;
  totalIssues: number;
  severityBreakdown: SeverityBreakdown;
  detectedClauses: DetectedClause[];
  analysisSummary: string;
  aiEnhancement?: AiEnhancement;
  createdAt: string;
}

export interface Contract {
  id: string;
  contractName: string;
  contractType: string;
  originalFileName: string;
  extractedText: string;
  uploadDate: string;
}

export interface DashboardData {
  totalContractsAnalyzed: number;
  highRiskContracts: number;
  mediumRiskContracts: number;
  lowRiskContracts: number;
  recentAnalyses: Analysis[];
  riskDistribution: { name: string; value: number; color: string }[];
  activityTrend: { date: string; analyses: number }[];
}

export interface ComparisonData {
  contracts: {
    contractId: string;
    analysisId: string;
    name: string;
    type: string;
    riskScore: number;
    riskLevel: RiskLevel;
    totalIssues: number;
    severityBreakdown: SeverityBreakdown;
    summary: string;
  }[];
  lowestRisk: {
    id: string;
    name: string;
    score: number;
  };
  highestRisk: {
    id: string;
    name: string;
    score: number;
  };
  categoryMatrix: {
    category: string;
    [key: string]: any;
  }[];
  differences: string[];
  disclaimer: string;
}
