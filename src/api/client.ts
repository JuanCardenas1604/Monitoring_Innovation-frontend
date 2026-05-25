import axios, { AxiosError } from "axios";
import { API_URL } from "../utils/constants";
import { connectionStore } from "../utils/connectionStore";

const client = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 12000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function isNetworkError(error: AxiosError): boolean {
  if (error.code === "ERR_NETWORK") return true;
  if (error.code === "ECONNABORTED") return true;
  if (!error.response && error.message?.toLowerCase().includes("network")) return true;
  if (!error.response && error.message?.toLowerCase().includes("timeout")) return true;
  return false;
}

client.interceptors.response.use(
  (response) => {
    connectionStore.setApiUp(true);
    return response;
  },
  (error: AxiosError) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (isNetworkError(error)) {
      connectionStore.setApiUp(false);
    } else if (error.response) {
      // Got a response (even 5xx). API is reachable.
      connectionStore.setApiUp(true);
    }

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login?expired=1";
    }
    return Promise.reject(error);
  }
);

export async function pingHealth(): Promise<boolean> {
  try {
    const res = await axios.get(`${API_URL}/health`, { timeout: 6000 });
    const ok = res.status === 200;
    connectionStore.setApiUp(ok);
    return ok;
  } catch {
    connectionStore.setApiUp(false);
    return false;
  }
}

export default client;
