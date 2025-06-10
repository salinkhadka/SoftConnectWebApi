import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLogin } from '../hooks/useLogin'; // Consistent hook name
import { AuthContext } from '../auth/AuthProvider';
import { toast } from 'react-toastify';

export default function LoginForm() {
  const { mutate, isPending } = useLogin();
  const { user, logout } = useContext(AuthContext);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: () => toast.success('Login successful!'),
        onError: (error) => toast.error(error?.message || 'Login failed!'),
      });
    },
  });

  return (
    <div>
      <h2>Login Form</h2>

      {user ? (
        <>
          <h3>Welcome, {user.name || user.username || 'User'}!</h3>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <p>{formik.errors.email}</p>
          )}

          <label>Password</label>
          <input
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p>{formik.errors.password}</p>
          )}

          <button type="submit" disabled={isPending}>
            {isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}
    </div>
  );
}