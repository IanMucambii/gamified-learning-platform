const API_URL = "http://localhost:3000/api";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "Doctor" | "Patient";
  isApproved: boolean;
  supervisor: string | null;
}

export interface LoginResponse {
  token: string;
  user?: User;
}

export interface MeResponse extends Omit<User, "supervisor"> {
  supervisor: { _id: string; name: string; email: string } | null;
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

  if (!response.ok) {
    throw new Error(data.message || "Failed to get profile");
  }

  return data;
}