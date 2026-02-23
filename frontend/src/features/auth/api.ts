import { api } from "@/shared/lib/axios";
import type { RegisterDto } from "./types";

export const register = async (data: RegisterDto) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};