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

export interface Caregiver {
  _id: string;
  name: string;
  email: string;
}

export interface QuizAttemptRaw {
  _id: string;
  quiz: { _id: string; title: string } | null;
  score: number;
  total: number;
  createdAt: string;
}

export interface PuzzleAttemptRaw {
  _id: string;
  puzzle: { _id: string; title: string } | null;
  correctPairs: number;
  totalPairs: number;
  createdAt: string;
}

export interface ResonanceAttemptRaw {
  _id: string;
  game: { _id: string; title: string } | null;
  correctSelections: number;
  incorrectSelections: number;
  totalTargets: number;
  createdAt: string;
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

async function authGet<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Failed to fetch ${path}`);
  return data;
}

export function getMyQuizAttempts(token: string) {
  return authGet<QuizAttemptRaw[]>("/quizzes/my-stats", token);
}

export function getMyPuzzleAttempts(token: string) {
  return authGet<PuzzleAttemptRaw[]>("/puzzles/my-stats", token);
}

export function getMyResonanceAttempts(token: string) {
  return authGet<ResonanceAttemptRaw[]>("/resonance/my-stats", token);
}
