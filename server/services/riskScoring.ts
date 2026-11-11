import { CONTRACT_RULES, DetectedClause, RiskSeverity } from './ruleEngine';

export interface SeverityBreakdown {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export type RiskLevel = 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Very High Risk';

export interface RiskScoreResult {
  riskScore: number;
  riskLevel: RiskLevel;
  totalIssues: number;
  severityBreakdown: SeverityBreakdown;
  summary: string;
}

const SEVERITY_WEIGHTS: Record<RiskSeverity, number> = {
  Critical: 10,
  High: 8,
  Medium: 5,
  Low: 2,
};

export function calculateRiskScore(detectedClauses: DetectedClause[]): RiskScoreResult {
  const breakdown: SeverityBreakdown = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  let totalPoints = 0;

  for (const clause of detectedClauses) {
    const sev = clause.severity;
    totalPoints += SEVERITY_WEIGHTS[sev] || 0;
    if (sev === 'Critical') breakdown.critical++;
    else if (sev === 'High') breakdown.high++;
    else if (sev === 'Medium') breakdown.medium++;
    else if (sev === 'Low') breakdown.low++;
  }

  // Maximum possible points = 10 rules evaluated * maximum rule weight (10) = 100 points
  const maxPossiblePoints = CONTRACT_RULES.length * 10;
  let rawScore = Math.round((totalPoints / maxPossiblePoints) * 100);

  // If critical clauses exist (like Service Bond or Salary Deductions), ensure minimum elevated score
  if (breakdown.critical >= 2 && rawScore < 55) {
    rawScore = 55;
  } else if (breakdown.critical >= 1 && rawScore < 35) {
    rawScore = 35;
  }

  const riskScore = Math.min(100, Math.max(0, rawScore));

  let riskLevel: RiskLevel = 'Low Risk';
  if (riskScore >= 75) {
    riskLevel = 'Very High Risk';
  } else if (riskScore >= 50) {
    riskLevel = 'High Risk';
  } else if (riskScore >= 25) {
    riskLevel = 'Moderate Risk';
  } else {
    riskLevel = 'Low Risk';
  }

  // Generate automated executive summary
  let summary = '';
  if (detectedClauses.length === 0) {
    summary =
      'No common high-risk red flag clauses were detected by the automated rule screening engine. However, always review terms thoroughly or consult a legal advisor before signing.';
  } else if (riskScore >= 75) {
    summary = `Critical risk detected. This contract contains ${breakdown.critical} critical and ${breakdown.high} high-severity clauses (including potential service bonds, penalty fees, or wage deductions). Signing without substantive negotiation is strongly discouraged.`;
  } else if (riskScore >= 50) {
    summary = `High risk detected across ${detectedClauses.length} distinct clauses. Important areas of concern include ${breakdown.critical > 0 ? 'liquidated penalties, ' : ''}restrictive non-compete clauses, or unbalanced termination policies.`;
  } else if (riskScore >= 25) {
    summary = `Moderate risk identified. Found ${detectedClauses.length} clauses that warrant clarification or negotiation, notably around notice periods, unilateral modification, or data sharing.`;
  } else {
    summary = `Low overall risk score. Minor potential issues detected (${detectedClauses.length} clause(s)), which can likely be clarified through informal dialogue with the drafting party.`;
  }

  return {
    riskScore,
    riskLevel,
    totalIssues: detectedClauses.length,
    severityBreakdown: breakdown,
    summary,
  };
}
