import client from "./client";
import type { User, AuthResponse } from "../types";

export interface RegisterAdminData {
  email: string;
  username: string;
  password: string;
  role: "admin" | "viewer";
}

export const usersApi = {
  list: () =>
    client.get<User[]>("/users/").then((r) => r.data),

  updateRole: (id: string, data: { role: "admin" | "viewer" }) =>
    client.put<User>(`/users/${id}/role`, data).then((r) => r.data),

  registerAdmin: (data: RegisterAdminData) =>
    client.post<AuthResponse>("/auth/register-admin", data).then((r) => r.data),

  delete: (id: string) =>
    client.delete(`/users/${id}`),
};
