const API_URL = "http://localhost:3000/api";

export interface DoctorUser { id: string; name: string; role: "Doctor" | "Patient" | "admin"; }
export interface Material { _id: string; title: string; type: "pdf" | "text"; content?: string; filePath?: string; phrases: string[]; uploadedBy: { name: string; role: string } | string; createdAt: string; }

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data as T;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), password }) });
  return parseResponse<{ token: string; user: DoctorUser }>(response);
}
export async function getMaterials(token: string) {
  const response = await fetch(`${API_URL}/materials`, { headers: { Authorization: `Bearer ${token}` } });
  return parseResponse<Material[]>(response);
}
export async function uploadMaterial(token: string, input: { title: string; type: "text"; content: string } | { title: string; type: "pdf"; file: File }) {
  const form = new FormData(); form.append("title", input.title.trim()); form.append("type", input.type);
  if (input.type === "text") form.append("content", input.content.trim()); else form.append("file", input.file);
  const response = await fetch(`${API_URL}/materials`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
  return parseResponse<Material>(response);
}
