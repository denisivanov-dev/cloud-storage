import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login, register } from "./api";
import { useAuthStore } from "./store";

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore.setState;

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      setAuth({
        accessToken: data.access_token,
        isAuthenticated: true,
      });

      navigate("/dashboard");
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: register,

    onSuccess: () => {
      navigate("/login");
    },
  });
};