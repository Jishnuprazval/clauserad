import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { db } from '../config/db';

export async function compareContracts(req: AuthRequest, res: Response) {
  try {
    const { contractIds } = req.body;
    if (!contractIds || !Array.isArray(contractIds) || contractIds.length < 2) {
      return res.status(400).json({ error: 'Please select at least two contracts to compare.' });
    }

    const userId = req.user?.userId;
    const analyses: any[] = [];

    for (const cid of contractIds) {
      const analysis = await db.getAnalysisByContractId(cid, userId);
      if (analysis) {
        analyses.push(analysis);
      }
    }

    if (analyses.length < 2) {
      return res.status(404).json({ error: 'Could not find sufficient analysis records for the selected contracts.' });
    }

    // Determine lowest and highest risk
    const sortedByScore = [...analyses].sort((a, b) => a.riskScore - b.riskScore);
    const lowestRisk = sortedByScore[0];
    const highestRisk = sortedByScore[sortedByScore.length - 1];

    // Key categories to compare
    const categoriesToCheck = [
      'Service Bond',
      'Non-Compete Restrictions',
      'Automatic Renewal',
      'Unilateral Modification',
      'Salary Deductions',
      'Unpaid Notice Period',
      'Data Sharing Permissions',
      'Termination Restrictions',
      'Intellectual Property Ownership',
      'Liability and Indemnification',
    ];

    const categoryMatrix = categoriesToCheck.map(cat => {
      const row: Record<string, any> = { category: cat };
      analyses.forEach((a, idx) => {
        const found = a.detectedClauses.find((c: any) => c.riskCategory.toLowerCase() === cat.toLowerCase());
        row[`contract_${idx}`] = found
          ? {
              detected: true,
              severity: found.severity,
              snippet: found.matchedClauseText.slice(0, 140) + '...',
              ruleId: found.ruleId,
            }
          : {
              detected: false,
              severity: 'None',
              snippet: 'No restrictive clause detected under this category.',
            };
      });
      return row;
    });

    // Identify major differences
    const differences: string[] = [];
    categoriesToCheck.forEach(cat => {
      const presence = analyses.map(a =>
        a.detectedClauses.some((c: any) => c.riskCategory.toLowerCase() === cat.toLowerCase())
      );
      const allSame = presence.every(v => v === presence[0]);
      if (!allSame) {
        const presentNames = analyses.filter((_, i) => presence[i]).map(a => `"${a.contractName}"`);
        const absentNames = analyses.filter((_, i) => !presence[i]).map(a => `"${a.contractName}"`);
        differences.push(
          `${cat}: Detected in ${presentNames.join(', ')}, but absent in ${absentNames.join(', ')}.`
        );
      }
    });

    return res.json({
      comparison: {
        contracts: analyses.map(a => ({
          contractId: a.contractId,
          analysisId: a._id,
          name: a.contractName,
          type: a.contractType,
          riskScore: a.riskScore,
          riskLevel: a.riskLevel,
          totalIssues: a.totalIssues,
          severityBreakdown: a.severityBreakdown,
          summary: a.analysisSummary,
        })),
        lowestRisk: {
          id: lowestRisk.contractId,
          name: lowestRisk.contractName,
          score: lowestRisk.riskScore,
        },
        highestRisk: {
          id: highestRisk.contractId,
          name: highestRisk.contractName,
          score: highestRisk.riskScore,
        },
        categoryMatrix,
        differences,
        disclaimer:
          'This automated comparison identifies differences in screened risk factors. A lower score indicates fewer automated red flags, but does not constitute formal legal counsel or guarantee overall fairness.',
      },
    });
  } catch (error: any) {
    console.error('Error in comparison controller:', error);
    return res.status(500).json({ error: 'Failed to generate contract comparison.' });
  }
}
