import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { db } from '../config/db';

export async function getAnalysisById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const analysis = await db.getAnalysisById(id, userId);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis record not found.' });
    }

    const contract = await db.getContractById(analysis.contractId, userId);

    return res.json({
      analysis,
      contract: contract
        ? {
            id: contract._id,
            contractName: contract.contractName,
            contractType: contract.contractType,
            originalFileName: contract.originalFileName,
            extractedText: contract.extractedText,
            uploadDate: contract.uploadDate,
          }
        : null,
    });
  } catch (error: any) {
    console.error('Error fetching analysis:', error);
    return res.status(500).json({ error: 'Failed to retrieve analysis report.' });
  }
}

export async function getAnalysisHistory(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId || 'guest-user';
    let analyses = await db.getUserAnalyses(userId);

    const { search, category, riskLevel, sortBy, sortOrder } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      analyses = analyses.filter(
        a =>
          a.contractName.toLowerCase().includes(q) ||
          a.contractType.toLowerCase().includes(q) ||
          a.analysisSummary.toLowerCase().includes(q)
      );
    }

    if (category && typeof category === 'string' && category !== 'All') {
      analyses = analyses.filter(a => a.contractType.toLowerCase() === category.toLowerCase());
    }

    if (riskLevel && typeof riskLevel === 'string' && riskLevel !== 'All') {
      analyses = analyses.filter(a => a.riskLevel.toLowerCase() === riskLevel.toLowerCase());
    }

    if (sortBy === 'score') {
      analyses.sort((a, b) =>
        sortOrder === 'asc' ? a.riskScore - b.riskScore : b.riskScore - a.riskScore
      );
    } else {
      // default: date desc
      analyses.sort((a, b) =>
        sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return res.json({ analyses });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch analysis history.' });
  }
}

export async function getDashboard(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId || 'guest-user';
    const stats = await db.getDashboardStats(userId);
    const analyses = await db.getUserAnalyses(userId);

    // Distribution data for Recharts Pie Chart
    const riskDistribution = [
      { name: 'Critical/High Risk', value: stats.highRiskContracts, color: '#DC2626' },
      { name: 'Moderate Risk', value: stats.mediumRiskContracts, color: '#F59E0B' },
      { name: 'Low Risk', value: stats.lowRiskContracts, color: '#16A34A' },
    ];

    // Activity trend data over time
    const monthlyMap: Record<string, number> = {};
    for (const a of analyses) {
      const dateKey = new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      monthlyMap[dateKey] = (monthlyMap[dateKey] || 0) + 1;
    }

    const activityTrend = Object.keys(monthlyMap).map(k => ({
      date: k,
      analyses: monthlyMap[k],
    })).slice(-7);

    return res.json({
      ...stats,
      riskDistribution,
      activityTrend: activityTrend.length ? activityTrend : [{ date: 'Today', analyses: analyses.length }],
    });
  } catch (error: any) {
    console.error('Error in getDashboard:', error);
    return res.status(500).json({ error: 'Failed to load dashboard data.' });
  }
}
