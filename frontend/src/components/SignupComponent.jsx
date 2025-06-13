import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useRegisterUser } from "../hooks/useRegister";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function SignupForm() {
  const fileInputRef = useRef();
  const registerUserMutation = useRegisterUser();
  

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    StudentId: Yup.string().required("Student ID is required"),
    role: Yup.string().required("Role is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

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
      const formData = new FormData();
      const generatedUserId = uuidv4(); // Generate userId

      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("StudentId", values.StudentId);
      formData.append("bio", values.bio);
      formData.append("role", values.role);
      formData.append("userId", generatedUserId); // Use generated ID
      formData.append("password", values.password);
      if (values.profilePhoto) {
        formData.append("profilePhoto", values.profilePhoto);
      }

      registerUserMutation.mutate(formData);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-2 py-6">
      <div className="flex flex-col md:flex-row w-full max-w-5xl min-h-[650px] shadow-2xl rounded-3xl bg-gradient-to-br from-[#31125f] via-[#502580] to-[#a084e8] border border-gray-100">
        {/* Left - Logo */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 py-14 px-6 md:px-10">
          <img src={logo} alt="Logo" className="rounded-2xl w-40 h-40 object-contain border-4 border-white shadow-lg mb-4" />
          <span className="mt-4 font-extrabold text-4xl text-white tracking-wide text-center">SoftConnect</span>
          <span className="mt-2 text-lg text-white/80 font-semibold text-center">Create your SoftConnect account!</span>
        </div>

        {/* Right - Form */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-16 bg-white rounded-r-3xl">
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-[#502580] tracking-tight">Sign up for an account</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <input
                id="username"
                name="username"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                className="w-full border rounded-lg px-4 py-2 bg-gray-50 shadow-sm text-sm"
                placeholder="Username"
              />
              {formik.touched.username && formik.errors.username && <p className="text-pink-500 text-xs">{formik.errors.username}</p>}

              <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full border rounded-lg px-4 py-2 bg-gray-50 shadow-sm text-sm"
                placeholder="Email"
              />
              {formik.touched.email && formik.errors.email && <p className="text-pink-500 text-xs">{formik.errors.email}</p>}

              <input
                id="StudentId"
                name="StudentId"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.StudentId}
                className="w-full border rounded-lg px-4 py-2 bg-gray-50 shadow-sm text-sm"
                placeholder="Student ID"
              />
              {formik.touched.StudentId && formik.errors.StudentId && <p className="text-pink-500 text-xs">{formik.errors.StudentId}</p>}

              <input
                id="bio"
                name="bio"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.bio}
                className="w-full border rounded-lg px-4 py-2 bg-gray-50 shadow-sm text-sm"
                placeholder="Bio (optional)"
              />

              <div>
  <select
    id="role"
    name="role"
    value={formik.values.role}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    className="w-full border rounded-lg px-4 py-2 bg-gray-50 shadow-sm text-sm"
  >
    <option value="">Select your role</option>
    <option value="Student">Student</option>
    <option value="Faculty Member">Faculty Member</option>
    <option value="Marketing Department">Marketing Department</option>
    <option value="Teaching Assistant">Teaching Assistant</option>
  </select>
  {formik.touched.role && formik.errors.role && (
    <p className="text-pink-500 text-xs">{formik.errors.role}</p>
  )}
</div>

              <input
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full border rounded-lg px-4 py-2 bg-gray-50 shadow-sm text-sm"
                placeholder="Password"
              />
              {formik.touched.password && formik.errors.password && <p className="text-pink-500 text-xs">{formik.errors.password}</p>}

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                className="w-full border rounded-lg px-4 py-2 bg-gray-50 shadow-sm text-sm"
                placeholder="Confirm Password"
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-pink-500 text-xs">{formik.errors.confirmPassword}</p>}

              {/* File upload */}
              <div>
                <label
                  htmlFor="profilePhoto"
                  className="inline-block px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer text-sm"
                >
                  Choose Profile Picture
                </label>
                <input
                  id="profilePhoto"
                  name="profilePhoto"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(event) => {
                    formik.setFieldValue("profilePhoto", event.currentTarget.files[0]);
                  }}
                  className="hidden"
                />
                {formik.values.profilePhoto && (
                  <p className="text-sm mt-2 text-gray-600">
                    Selected: <strong>{formik.values.profilePhoto.name}</strong>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={registerUserMutation.isPending}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-[#502580] via-[#a084e8] to-[#ed64a6] text-white font-semibold text-lg shadow"
              >
                {registerUserMutation.isPending ? "Registering..." : "Sign up"}
              </button>
            </form>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm py-4 mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[#502580] hover:text-pink-600 font-semibold underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
