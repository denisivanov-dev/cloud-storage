import { api } from "@/shared/lib/axios";
import type { LoginDto, RegisterDto } from "./types";

export const login = async (data: LoginDto) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const register = async (data: RegisterDto) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const refresh = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};