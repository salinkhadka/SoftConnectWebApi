import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useRegisterUser} from '../hooks/useRegister'
import { toast } from 'react-toastify';

export default function RegisterForm() {
  const { mutate, isPending } = useRegisterUser();

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    role: Yup.string().required('Role is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'normal',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const { confirmPassword, ...formData } = values;
      mutate(formData, {
        onSuccess: () => {
          toast.success('Registration successful!');
          resetForm();
        },
        onError: (error) => {
          toast.error(error?.message || 'Registration failed!');
        },
      });
    },
  });

  return (
    <div>
      <h2>Register Form</h2>
      <form onSubmit={formik.handleSubmit}>
        <label>Username</label>
        <input
          name="username"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username && (
          <p>{formik.errors.username}</p>
        )}

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

        <label>Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p>{formik.errors.confirmPassword}</p>
        )}

        <label>Role</label>
        <select
          name="role"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.role}
        >
          <option value="normal">Normal</option>
          <option value="admin">Admin</option>
        </select>
        {formik.touched.role && formik.errors.role && (
          <p>{formik.errors.role}</p>
        )}

        <button type="submit" disabled={isPending}>
          {isPending ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
