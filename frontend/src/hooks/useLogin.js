import { useMutation } from "@tanstack/react-query";
import { loginUserService } from "../services/authService";
import { toast } from "react-toastify";
import { AuthContext } from "../auth/AuthProvider"; // ✅ Use context, not provider
import { useContext } from "react";

export const useLogin = () => {
  const { login } = useContext(AuthContext); // ✅ Correct usage

  return useMutation({
    mutationFn: loginUserService,
    mutationKey: ["login_key"],
    onSuccess: (data) => {
      login(data?.data, data?.token);
      toast.success(data?.message || "Login success");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err.message || "Login failed");
    },
  });
};
