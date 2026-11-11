import { Analysis, Contract, DashboardData, ComparisonData, User } from '../types';

const API_BASE = '/api';

function getHeaders(isFormData = false): HeadersInit {
  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('clauseradar_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data as T;
}

export const api = {
  auth: {
    async register(payload: { name: string; email: string; password: string; confirmPassword?: string }) {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse<{ token: string; user: User; message: string }>(res);
    },

    async login(payload: { email: string; password: string }) {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse<{ token: string; user: User; message: string }>(res);
    },

    async getMe() {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders(),
      });
      return handleResponse<{ user: User }>(res);
    },

    async forgotPassword(email: string) {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email }),
      });
      return handleResponse<{ message: string; resetToken?: string }>(res);
    },

    async resetPassword(payload: { resetToken: string; newPassword: string }) {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse<{ message: string }>(res);
    },
  },

  contracts: {
    async uploadPdf(formData: FormData) {
      const res = await fetch(`${API_BASE}/contracts/upload`, {
        method: 'POST',
        headers: getHeaders(true),
        body: formData,
      });
      return handleResponse<{ message: string; contractId: string; analysisId: string; analysis: Analysis; contract: Contract }>(res);
    },

    async analyzeText(payload: { contractName: string; contractType: string; contractText: string }) {
      const res = await fetch(`${API_BASE}/contracts/analyze-text`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse<{ message: string; contractId: string; analysisId: string; analysis: Analysis; contract: Contract }>(res);
    },

    async getSampleDemo() {
      const res = await fetch(`${API_BASE}/contracts/sample-demo`);
      return handleResponse<{ contractName: string; contractType: string; contractText: string; description: string }>(res);
    },

    async getAll() {
      const res = await fetch(`${API_BASE}/contracts`, {
        headers: getHeaders(),
      });
      return handleResponse<{ contracts: any[] }>(res);
    },

    async getById(id: string) {
      const res = await fetch(`${API_BASE}/contracts/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse<{ contract: Contract }>(res);
    },

    async delete(id: string) {
      const res = await fetch(`${API_BASE}/contracts/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse<{ message: string }>(res);
    },
  },

  analysis: {
    async getById(analysisId: string) {
      const res = await fetch(`${API_BASE}/analysis/${analysisId}`, {
        headers: getHeaders(),
      });
      return handleResponse<{ analysis: Analysis; contract: Contract | null }>(res);
    },

    async getHistory(params?: { search?: string; category?: string; riskLevel?: string; sortBy?: string; sortOrder?: string }) {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.category) query.append('category', params.category);
      if (params?.riskLevel) query.append('riskLevel', params.riskLevel);
      if (params?.sortBy) query.append('sortBy', params.sortBy);
      if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

      const res = await fetch(`${API_BASE}/analysis/history?${query.toString()}`, {
        headers: getHeaders(),
      });
      return handleResponse<{ analyses: Analysis[] }>(res);
    },

    async getDashboard() {
      const res = await fetch(`${API_BASE}/analysis/dashboard`, {
        headers: getHeaders(),
      });
      return handleResponse<DashboardData>(res);
    },
  },

  comparison: {
    async compare(contractIds: string[]) {
      const res = await fetch(`${API_BASE}/comparison`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ contractIds }),
      });
      return handleResponse<{ comparison: ComparisonData }>(res);
    },
  },

  users: {
    async getProfile() {
      const res = await fetch(`${API_BASE}/users/profile`, {
        headers: getHeaders(),
      });
      return handleResponse<{ user: User }>(res);
    },

    async updateProfile(payload: { name: string }) {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse<{ user: User; message: string }>(res);
    },

    async changePassword(payload: { currentPassword: string; newPassword: string }) {
      const res = await fetch(`${API_BASE}/users/change-password`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse<{ message: string }>(res);
    },
  },
};
