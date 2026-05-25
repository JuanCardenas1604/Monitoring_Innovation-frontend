import client from "./client";
import type { Vehicle, VehicleFormData, VehicleListResponse } from "../types";

export interface VehicleFilters {
  q?: string;
  brand?: string;
  location?: string;
  applicant?: string;
  skip?: number;
  limit?: number;
}

export const vehiclesApi = {
  list: (filters?: VehicleFilters) =>
    client.get<VehicleListResponse>("/vehicles/", { params: filters }).then((r) => r.data),

  create: (data: VehicleFormData) =>
    client.post<Vehicle>("/vehicles/", data).then((r) => r.data),

  update: (id: string, data: Partial<VehicleFormData>) =>
    client.put<Vehicle>(`/vehicles/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    client.delete(`/vehicles/${id}`),
};
