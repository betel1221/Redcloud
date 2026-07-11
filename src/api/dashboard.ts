// src/api/dashboard.ts
interface HealthData {
  db_health: number;
  server_health: number;
  security_score: number;
  ai_status: string;
}

interface Alert {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  message: string;
  timestamp: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
}

interface Notification {
  id: string;
  title: string;
  timestamp: string;
}

const API_BASE = '/api';

export async function fetchHealth(): Promise<HealthData> {
  const resp = await fetch(`${API_BASE}/health`);
  if (!resp.ok) throw new Error('Failed to fetch health');
  return resp.json();
}

export async function fetchAlerts(page: number = 1, pageSize: number = 20): Promise<{alerts: Alert[]; total: number}> {
  const resp = await fetch(`${API_BASE}/alerts?page=${page}&pageSize=${pageSize}`);
  if (!resp.ok) throw new Error('Failed to fetch alerts');
  return resp.json();
}

export async function fetchRecommendations(): Promise<Recommendation[]> {
  const resp = await fetch(`${API_BASE}/recommendations`);
  if (!resp.ok) throw new Error('Failed to fetch recommendations');
  return resp.json();
}

export async function fetchNotifications(page: number = 1, pageSize: number = 20): Promise<{notifications: Notification[]; total: number}> {
  const resp = await fetch(`${API_BASE}/notifications?page=${page}&pageSize=${pageSize}`);
  if (!resp.ok) throw new Error('Failed to fetch notifications');
  return resp.json();
}
