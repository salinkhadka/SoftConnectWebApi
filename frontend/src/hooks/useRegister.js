import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerUserService } from "../services/authService";
import { toast } from "react-toastify";

export const useRegisterUser = () => {
  const navigate = useNavigate(); // ✅ Hook at top level

  return useMutation({
    mutationFn: registerUserService,
    mutationKey: ["register"],
    onSuccess: (data) => {
      toast.success(data?.message || "Registration success");
      navigate("/login", { replace: true }); // ✅ Navigate after success
    },
    onError: (err) => {
      toast.error(err?.message || "Registration failed");
    },
  });
};
