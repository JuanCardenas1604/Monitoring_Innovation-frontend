export interface User {
  id: string;
  email: string;
  username: string;
  role: "admin" | "viewer";
  is_active: boolean;
  created_at: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  location: string;
  applicant: string;
  year: number | null;
  price: number | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleListResponse {
  items: Vehicle[];
  total: number;
}

export interface VehicleFormData {
  brand: string;
  location: string;
  applicant: string;
  year?: number | null;
  price?: number | null;
  description?: string | null;
  image_url?: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
