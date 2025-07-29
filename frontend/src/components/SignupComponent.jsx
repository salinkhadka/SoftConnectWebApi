"use client"
import React from "react"
import { useRef } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Link } from "react-router-dom"
import logo from "../assets/logo.png"
import { useRegisterUser } from "../hooks/useRegister"
import { v4 as uuidv4 } from "uuid"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

export default function SignupForm() {
  const fileInputRef = useRef()
  const registerUserMutation = useRegisterUser()

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    StudentId: Yup.string().required("Student ID is required"),
    role: Yup.string().required("Role is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  })

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      StudentId: "",
      bio: "",
      role: "",
      password: "",
      confirmPassword: "",
      profilePhoto: null,
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData()
      const generatedUserId = uuidv4()

      formData.append("username", values.username)
      formData.append("email", values.email)
      formData.append("StudentId", values.StudentId)
      formData.append("bio", values.bio)
      formData.append("role", values.role)
      formData.append("userId", generatedUserId)
      formData.append("password", values.password)
      if (values.profilePhoto) {
        formData.append("profilePhoto", values.profilePhoto)
      }

      registerUserMutation.mutate(formData)
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300">
        {/* Left Panel - Logo & Branding */}
        <div
          className="flex flex-col items-center justify-center w-full lg:w-2/5 py-16 px-8 text-center"
          style={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
          }}
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
            <img
              src={logo || "/placeholder.svg"}
              alt="SoftConnect Logo"
              className="relative rounded-2xl w-28 h-28 sm:w-36 sm:h-36 object-contain border-4 border-white/30 shadow-2xl backdrop-blur-sm"
            />
          </div>

          <h1 className="font-bold text-3xl sm:text-4xl text-white mb-4 tracking-tight">Join SoftConnect</h1>
          <p className="text-base sm:text-lg text-white/90 font-medium max-w-sm leading-relaxed">
            Create your account and start connecting with your academic community today
          </p>
        </div>

        {/* Right Panel - Signup Form */}
        <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-12 bg-white dark:bg-gray-800 overflow-y-auto max-h-screen">
          <div className="mx-auto w-full max-w-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: PURPLE }}>
                Create Account
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="space-y-1">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  className={`w-full px-4 py-2.5 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 text-sm ${
                    formik.touched.username && formik.errors.username
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  placeholder="Choose a username"
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`w-full px-4 py-2.5 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 text-sm ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  placeholder="Enter your email"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                )}
              </div>

              {/* Student ID */}
              <div className="space-y-1">
                <label htmlFor="StudentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Student ID
                </label>
                <input
                  id="StudentId"
                  name="StudentId"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.StudentId}
                  className={`w-full px-4 py-2.5 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 text-sm ${
                    formik.touched.StudentId && formik.errors.StudentId
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  placeholder="Enter your student ID"
                />
                {formik.touched.StudentId && formik.errors.StudentId && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.StudentId}</p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bio (Optional)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.bio}
                  className="w-full px-4 py-2.5 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 text-sm border-gray-200 dark:border-gray-600 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 text-sm ${
                    formik.touched.role && formik.errors.role
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <option value="">Select your role</option>
                  <option value="Student">Student</option>
                  <option value="Faculty Member">Faculty Member</option>
                  <option value="Marketing Department">Marketing Department</option>
                  <option value="Teaching Assistant">Teaching Assistant</option>
                </select>
                {formik.touched.role && formik.errors.role && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.role}</p>
                )}
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className={`w-full px-4 py-2.5 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 text-sm ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 dark:border-gray-600"
                    }`}
                    placeholder="Password"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    className={`w-full px-4 py-2.5 rounded-lg border-2 bg-gray-50 dark:bg-gray-700 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 text-sm ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 dark:border-gray-600"
                    }`}
                    placeholder="Confirm password"
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Profile Photo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Profile Picture (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: `${LAVENDER}20`,
                      color: PURPLE,
                      border: `2px solid ${LAVENDER}`,
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Choose Photo
                  </button>
                  <input
                    id="profilePhoto"
                    name="profilePhoto"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(event) => {
                      formik.setFieldValue("profilePhoto", event.currentTarget.files[0])
                    }}
                    className="hidden"
                  />
                  {formik.values.profilePhoto && (
                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                      {formik.values.profilePhoto.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={registerUserMutation.isPending}
                className="w-full py-3 px-4 rounded-xl font-semibold text-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-6"
                style={{
                  background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
                  color: WHITE,
                }}
              >
                {registerUserMutation.isPending ? (
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
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">Already have an account?</span>
                </div>
              </div>

              <Link
                to="/login"
                className="mt-4 inline-flex items-center justify-center font-semibold transition-all duration-200 hover:underline"
                style={{ color: PURPLE }}
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
