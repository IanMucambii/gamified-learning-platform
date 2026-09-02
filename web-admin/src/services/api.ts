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

export interface AdminPatient {
  id: string;
  name: string;
  email: string;
  caregiver: string;
  isApproved: boolean;
  activities: number;
  lastActive: string | null;
}

export interface Caregiver {
  id: string;
  name: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "Patient" | "Doctor" | "admin";
}

export interface RegisterResponse {
  id: string;
  name: string;
  role: string;
  isApproved: boolean;
}

export interface AdminCaregiver {
  id: string;
  name: string;
  email: string;
  isApproved: boolean;
  patientCount: number;
  patientNames: string[];
}

export const getCaregiversDetailed = async (token: string): Promise<AdminCaregiver[]> => {
  const res = await fetch(`${API_URL}/admin/caregivers/detailed`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch caregivers");
  return res.json();
};

export const updateCaregiver = async (
  token: string,
  id: string,
  data: { name: string; email: string }
) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update caregiver");
  return res.json();
};

export const approveCaregiver = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/users/${id}/approve`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to approve caregiver");
  return res.json();
};

// Public endpoint — no auth header. Adjust the path below if your register
// route lives somewhere other than /api/auth/register.
export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to add patient");
  }
  return res.json();
};

export const getPatients = async (token: string): Promise<AdminPatient[]> => {
  const res = await fetch(`${API_URL}/admin/patients`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
};

export const getCaregivers = async (token: string): Promise<Caregiver[]> => {
  const res = await fetch(`${API_URL}/admin/caregivers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch caregivers");
  return res.json();
};

export const updatePatient = async (
  token: string,
  id: string,
  data: { name: string; supervisor: string | null }
) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update patient");
  return res.json();
};

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