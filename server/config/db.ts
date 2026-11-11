import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { DEMO_INTERNSHIP_CONTRACT } from '../data/demoContract';
import { analyzeContractWithRules } from '../services/ruleEngine';
import { calculateRiskScore } from '../services/riskScoring';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface IContract {
  _id: string;
  userId: string;
  contractName: string;
  contractType: string;
  originalFileName: string;
  extractedText: string;
  fileReference?: string;
  uploadDate: string;
  status: 'analyzed' | 'pending' | 'failed';
}

export interface IAnalysis {
  _id: string;
  userId: string;
  contractId: string;
  contractName: string;
  contractType: string;
  riskScore: number;
  riskLevel: string;
  totalIssues: number;
  severityBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  detectedClauses: any[];
  analysisSummary: string;
  aiEnhancement?: any;
  createdAt: string;
}

interface DatabaseSchema {
  users: IUser[];
  contracts: IContract[];
  analyses: IAnalysis[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let memoryDb: DatabaseSchema = {
  users: [],
  contracts: [],
  analyses: [],
};

function loadDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(content);
      return memoryDb;
    }
  } catch (err) {
    console.error('Error reading local db file, initializing fresh db:', err);
  }
  saveDb(memoryDb);
  return memoryDb;
}

function saveDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local db file:', err);
  }
}

let isMongooseConnected = false;

export async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      console.log('Attempting MongoDB connection via MONGODB_URI...');
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
      isMongooseConnected = true;
      console.log('MongoDB connected successfully via Mongoose.');
    } catch (err: any) {
      console.warn('MongoDB connection failed, falling back to persistent JSON engine:', err.message);
      isMongooseConnected = false;
    }
  } else {
    console.log('No MONGODB_URI configured. Running persistent local document store.');
  }

  // Load or initialize local file db
  loadDb();

  // Seed demo contract for testing if empty
  seedDemoDataIfNeeded();
}

function seedDemoDataIfNeeded() {
  if (memoryDb.contracts.length === 0) {
    const demoContractId = 'demo-contract-101';
    const demoUserId = 'demo-user-system';

    const detected = analyzeContractWithRules(DEMO_INTERNSHIP_CONTRACT);
    const scoreResult = calculateRiskScore(detected);

    const demoContract: IContract = {
      _id: demoContractId,
      userId: demoUserId,
      contractName: 'Sample Apex Internship Agreement',
      contractType: 'Internship Offer Letter',
      originalFileName: 'Apex_Internship_Offer.pdf',
      extractedText: DEMO_INTERNSHIP_CONTRACT,
      uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: 'analyzed',
    };

    const demoAnalysis: IAnalysis = {
      _id: 'demo-analysis-201',
      userId: demoUserId,
      contractId: demoContractId,
      contractName: demoContract.contractName,
      contractType: demoContract.contractType,
      riskScore: scoreResult.riskScore,
      riskLevel: scoreResult.riskLevel,
      totalIssues: scoreResult.totalIssues,
      severityBreakdown: scoreResult.severityBreakdown,
      detectedClauses: detected,
      analysisSummary: scoreResult.summary,
      createdAt: demoContract.uploadDate,
    };

    memoryDb.contracts.push(demoContract);
    memoryDb.analyses.push(demoAnalysis);
    saveDb(memoryDb);
    console.log('Demo contract and analysis pre-seeded.');
  }
}

// Database helper functions
export const db = {
  // Users
  async findUserByEmail(email: string): Promise<IUser | null> {
    const data = loadDb();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id: string): Promise<IUser | null> {
    const data = loadDb();
    return data.users.find(u => u._id === id) || null;
  },

  async createUser(userData: { name: string; email: string; passwordHash: string }): Promise<IUser> {
    const data = loadDb();
    const newUser: IUser = {
      _id: 'usr_' + crypto.randomUUID(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash: userData.passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.users.push(newUser);
    saveDb(data);
    return newUser;
  },

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    const data = loadDb();
    const idx = data.users.findIndex(u => u._id === id);
    if (idx === -1) return null;
    data.users[idx] = {
      ...data.users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDb(data);
    return data.users[idx];
  },

  // Contracts
  async createContract(contractData: Omit<IContract, '_id' | 'uploadDate'>): Promise<IContract> {
    const data = loadDb();
    const newContract: IContract = {
      _id: 'cnt_' + crypto.randomUUID(),
      ...contractData,
      uploadDate: new Date().toISOString(),
    };
    data.contracts.push(newContract);
    saveDb(data);
    return newContract;
  },

  async getContractById(id: string, userId?: string): Promise<IContract | null> {
    const data = loadDb();
    const c = data.contracts.find(item => item._id === id);
    if (!c) return null;
    if (userId && c.userId !== userId && c.userId !== 'demo-user-system') {
      return null;
    }
    return c;
  },

  async getUserContracts(userId: string): Promise<IContract[]> {
    const data = loadDb();
    return data.contracts.filter(c => c.userId === userId || c.userId === 'demo-user-system');
  },

  async deleteContract(id: string, userId?: string): Promise<boolean> {
    const data = loadDb();
    
    // Find contract by contract ID or analysis ID
    let contractIdToDelete = id;
    let index = data.contracts.findIndex(c => c._id === id);

    if (index === -1) {
      // Check if id passed was actually an analysis ID
      const analysis = data.analyses.find(a => a._id === id);
      if (analysis) {
        contractIdToDelete = analysis.contractId;
        index = data.contracts.findIndex(c => c._id === contractIdToDelete);
      }
    }

    if (index !== -1) {
      const contract = data.contracts[index];
      // Check ownership if userId is present and not demo or guest
      if (userId && contract.userId !== userId && contract.userId !== 'demo-user-system' && !contract.userId.startsWith('guest-user')) {
        return false;
      }
      data.contracts.splice(index, 1);
    }

    // Always clean up any matching analyses
    const prevAnalysesLen = data.analyses.length;
    data.analyses = data.analyses.filter(
      a => a.contractId !== contractIdToDelete && a._id !== id && a.contractId !== id
    );

    saveDb(data);
    return index !== -1 || data.analyses.length < prevAnalysesLen;
  },

  // Analyses
  async createAnalysis(analysisData: Omit<IAnalysis, '_id' | 'createdAt'>): Promise<IAnalysis> {
    const data = loadDb();
    const newAnalysis: IAnalysis = {
      _id: 'anl_' + crypto.randomUUID(),
      ...analysisData,
      createdAt: new Date().toISOString(),
    };
    data.analyses.push(newAnalysis);
    saveDb(data);
    return newAnalysis;
  },

  async getAnalysisById(id: string, userId?: string): Promise<IAnalysis | null> {
    const data = loadDb();
    const a = data.analyses.find(item => item._id === id);
    if (!a) return null;
    if (userId && a.userId !== userId && a.userId !== 'demo-user-system') {
      return null;
    }
    return a;
  },

  async getAnalysisByContractId(contractId: string, userId?: string): Promise<IAnalysis | null> {
    const data = loadDb();
    const a = data.analyses.find(item => item.contractId === contractId);
    if (!a) return null;
    if (userId && a.userId !== userId && a.userId !== 'demo-user-system') {
      return null;
    }
    return a;
  },

  async getUserAnalyses(userId: string): Promise<IAnalysis[]> {
    const data = loadDb();
    return data.analyses
      .filter(a => a.userId === userId || a.userId === 'demo-user-system')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getDashboardStats(userId: string) {
    const analyses = await this.getUserAnalyses(userId);
    const total = analyses.length;
    let high = 0;
    let medium = 0;
    let low = 0;

    for (const a of analyses) {
      if (a.riskScore >= 50) high++;
      else if (a.riskScore >= 25) medium++;
      else low++;
    }

    return {
      totalContractsAnalyzed: total,
      highRiskContracts: high,
      mediumRiskContracts: medium,
      lowRiskContracts: low,
      recentAnalyses: analyses.slice(0, 5),
    };
  },
};
