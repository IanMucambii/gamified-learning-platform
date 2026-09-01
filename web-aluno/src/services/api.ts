const API_URL = "http://localhost:3000/api";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "Doctor" | "Patient";
  isApproved: boolean;
  supervisor: string | null; // unpopulated ref — as returned by GET /users
}

export interface LoginResponse {
  token: string;
  user?: User;
}

export interface ActivityStat {
  key: string;
  name: string;
  icon: string;
  completed: number;
  score: number;
}

export interface OverallStats {
  totalXp: number;
  activitiesCompleted: number;
  averageScore: number;
  currentStreak: number;
  weeklyGoal: { target: number; completed: number };
  byActivity: ActivityStat[];
}

export interface Caregiver {
  _id: string;
  name: string;
  email: string;
}

export interface MeResponse extends Omit<User, "supervisor"> {
  supervisor: Caregiver | null; // populated by GET /users/me
  createdAt: string;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function getUsers(token: string): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get users");
  }

  return data;
}

export async function getMe(token: string): Promise<MeResponse> {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to get profile");
  return data;
}

export async function getMyStats(token: string): Promise<OverallStats> {
  const response = await fetch(`${API_URL}/stats/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to get stats");
  return data;
}