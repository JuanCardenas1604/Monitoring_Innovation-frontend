import client from "./client";
import type { AuthResponse, LoginCredentials, RegisterData } from "../types";

export const authApi = {
  login: (data: LoginCredentials) =>
    client.post<AuthResponse>("/auth/login", data).then((r) => r.data),

  register: (data: RegisterData) =>
    client.post<AuthResponse>("/auth/register", data).then((r) => r.data),

  forgotPassword: (data: { email: string }) =>
    client.post<{ message: string; reset_token: string }>("/auth/forgot-password", data).then((r) => r.data),

  resetPassword: (data: { token: string; password: string }) =>
    client.post<{ message: string }>("/auth/reset-password", data).then((r) => r.data),
};
