import { useMutation } from "@tanstack/react-query";
import { loginUserService } from "../services/authService";
import { toast } from "react-toastify";
import { AuthContext } from "../auth/AuthProvider";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUserService,
    mutationKey: ["login_key"],
    onSuccess: (data) => {
      console.log("Login response:", data);

      const token = data?.token;
      const user = data?.data; // role is directly inside data

      if (token && user) {
        login(user, token);
        console.log("User role =", user.role); // should now log "admin" or "normal"

      } else {
        toast.error("Invalid login response");
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err.message || "Login failed");
    },
  });
};
