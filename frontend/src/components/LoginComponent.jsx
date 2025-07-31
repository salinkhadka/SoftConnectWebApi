"use client"
import React from 'react';
import { useContext } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useLogin } from "../hooks/useLogin"
import { AuthContext} from "../auth/AuthProvider"
import { useToast } from "../contexts/ToastContext"
import { Link } from "react-router-dom"
import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../auth/firebase"
import axios from 'axios';

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

export default function LoginForm() {
  const { mutate, isPending, isSuccess, data } = useLogin()
  const { user,login } = useContext(AuthContext)
  const navigate = useNavigate()
  const toast = useToast()

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  })


  


const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // Get the ID token from Firebase
    const idToken = await firebaseUser.getIdToken();

    // Send the ID token to your backend
    const res = await axios.post("http://localhost:2000/user/google-login", {
      idToken: idToken
    });

    // Handle the response
    const backendResponse = res.data;
    
    if (backendResponse.success) {
      // Store additional data in localStorage (optional, since login() already stores token and user)
      localStorage.setItem("userId", backendResponse.data._id);
      localStorage.setItem("userType", backendResponse.data.role);
      localStorage.setItem("isLoggedIn", "true");

      // Set axios default authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${backendResponse.token}`;

      // 🔥 FIXED: Now login is available from the destructured context above
      login(backendResponse.data, backendResponse.token);

      toast.success("Welcome back!");
      
      // Navigate based on user role - the navigation will work now because AuthContext is updated
      if (backendResponse.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/"); // Navigate to root, which will redirect to feed via your route structure
      }
    } else {
      toast.error(backendResponse.message || "Login failed");
    }

  } catch (error) {
    console.error("Google login failed", error);
    
    // Handle different types of errors
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.code === 'auth/popup-closed-by-user') {
      toast.error("Login cancelled");
    } else if (error.code === 'auth/popup-blocked') {
      toast.error("Popup blocked. Please allow popups and try again.");
    } else {
      toast.error("Login failed. Please try again.");
    }
  }
};


  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: () => toast.success("Welcome back!"),
        onError: (error) => toast.error(error?.message || "Login failed!"),
      })
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl min-h-[700px] shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300">
        {/* Left Panel - Logo & Branding */}
        <div
          className="flex flex-col items-center justify-center w-full lg:w-1/2 py-16 px-8 text-center"
          style={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
          }}
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
            <img
              src={logo || "/placeholder.svg"}
              alt="SoftConnect Logo"
              className="relative rounded-2xl w-32 h-32 sm:w-40 sm:h-40 object-contain border-4 border-white/30 shadow-2xl backdrop-blur-sm"
            />
          </div>

          <h1 className="font-bold text-4xl sm:text-5xl text-white mb-4 tracking-tight">SoftConnect</h1>
          <p className="text-lg sm:text-xl text-white/90 font-medium max-w-md leading-relaxed">
            Connect, Share, and Grow with Your Academic Community
          </p>

          <div className="mt-8 flex space-x-2">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-white dark:bg-gray-800">
          <div className="mx-auto w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: PURPLE }}>
                Welcome
              </h2>
              <p className="text-gray-600 dark:text-gray-300">Sign in to your account to continue</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-gray-700 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 ${formik.touched.email && formik.errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : `border-gray-200 dark:border-gray-600 focus:ring-2`
                    }`}
                  style={{
                    focusBorderColor: LAVENDER,
                    focusRingColor: `${LAVENDER}40`,
                  }}
                  placeholder="Enter your email"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-gray-700 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 ${formik.touched.password && formik.errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 dark:border-gray-600"
                    }`}
                  placeholder="Enter your password"
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 focus:ring-2"
                    style={{ accentColor: PURPLE }}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label> */}
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium hover:underline transition-colors"
                  style={{ color: PURPLE }}
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-4 rounded-xl font-semibold text-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
                  color: WHITE,
                }}
              >
                {isPending ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-2">or continue with</p>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 font-semibold text-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                style={{
                  borderColor: PURPLE,
                  color: PURPLE,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = LAVENDER
                  e.target.style.color = WHITE
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent"
                  e.target.style.color = PURPLE
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-6 h-6"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.15 0 5.97 1.2 8.15 3.16l6.08-6.08C34.85 3.1 29.7 1 24 1 14.95 1 7.2 6.6 3.88 14.14l7.36 5.7C13.07 13.77 17.93 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.12 24.46C46.12 22.73 45.93 21.1 45.58 19.58H24v9.26h12.4c-.54 3-2.3 5.54-4.89 7.2l7.36 5.7c4.3-3.97 6.25-9.83 6.25-16.74z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M11.24 28.4a14.5 14.5 0 010-8.8l-7.36-5.7A23.978 23.978 0 000 24c0 3.94.95 7.65 2.65 10.9l8.6-6.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M24 47c6.5 0 11.98-2.14 15.97-5.82l-7.36-5.7c-2.06 1.37-4.72 2.16-8.61 2.16-6.07 0-11.24-4.27-13.09-10.1l-8.6 6.5C7.2 41.4 14.95 47 24 47z"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>


            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">New to SoftConnect?</span>
                </div>
              </div>

              <Link
                to="/signup"
                className="mt-4 inline-flex items-center justify-center w-full py-3 px-4 rounded-xl border-2 font-semibold text-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                style={{
                  borderColor: PURPLE,
                  color: PURPLE,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = LAVENDER
                  e.target.style.color = WHITE
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent"
                  e.target.style.color = PURPLE
                }}
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
