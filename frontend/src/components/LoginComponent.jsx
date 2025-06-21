import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLogin } from "../hooks/useLogin";
import { AuthContext } from "../auth/AuthProvider";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LoginForm() {
  const { mutate, isPending, isSuccess, data } = useLogin();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();



  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: () => toast.success("Login successful!"),
        onError: (error) => toast.error(error?.message || "Login failed!"),
      });
    },
  });
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-2 py-6">
      <div className="flex flex-col md:flex-row w-full max-w-5xl min-h-[650px] shadow-2xl rounded-3xl bg-gradient-to-br from-[#31125f] via-[#502580] to-[#a084e8] border border-gray-100 transition-all duration-300">
        {/* Left - Logo Panel */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 py-14 px-6 md:px-10">
          <img
            src={logo}
            alt="Logo"
            className="rounded-2xl w-40 h-40 object-contain border-4 border-white shadow-lg mb-4"
          />
          <span className="mt-4 font-extrabold text-4xl text-white tracking-wide text-center">
            SoftConnect
          </span>
          <span className="mt-2 text-lg text-white/80 font-semibold text-center">
            Welcome to SoftConnect!
          </span>
        </div>
        {/* Right - Form */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-16 bg-white rounded-r-3xl">
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-[#502580] tracking-tight">
              Log in to your account
            </h2>
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`w-full border rounded-lg px-4 py-2 bg-gray-50 shadow-sm focus:outline-none focus:ring-2 text-sm ${
                  formik.touched.email && formik.errors.email
                    ? "border-pink-400 focus:ring-pink-300"
                    : "border-gray-200 focus:ring-[#a084e8]"
                }`}
                placeholder="Email"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-pink-500 text-xs">{formik.errors.email}</p>
              )}
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`w-full border rounded-lg px-4 py-2 bg-gray-50 shadow-sm focus:outline-none focus:ring-2 text-sm ${
                  formik.touched.password && formik.errors.password
                    ? "border-pink-400 focus:ring-pink-300"
                    : "border-gray-200 focus:ring-[#a084e8]"
                }`}
                placeholder="Password"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-pink-500 text-xs">{formik.errors.password}</p>
              )}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-[#502580] via-[#a084e8] to-[#ed64a6] hover:from-[#6c36a6] hover:to-[#d53f8c] text-white font-semibold text-lg shadow transition-all duration-150"
              >
                {isPending ? "Logging in..." : "Log in"}
              </button>
              <div className="text-right mt-2">
                <Link to="/forgot-password" className="text-xs text-[#502580] hover:underline">
                  Forgot password?
                </Link>
              </div>
            </form>
            {/* Sign Up link */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm py-4 mt-6 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-[#502580] hover:text-pink-600 font-semibold underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
