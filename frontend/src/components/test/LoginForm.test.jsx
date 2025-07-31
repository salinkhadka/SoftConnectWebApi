// src/components/test/LoginForm.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthProvider';
import { useToast } from '../../contexts/ToastContext';
import { useLogin } from '../../hooks/useLogin';
import LoginForm from '../LoginComponent'; // ✅ FIX: Corrected the import path

// ----- MOCKS -----
// ✅ FIX: Mock the entire firebase module to prevent side effects in the test environment
jest.mock('../../auth/firebase', () => ({
  auth: {},
  provider: {},
  signInWithPopup: jest.fn(),
}));

// Mock the useLogin hook
jest.mock('../../hooks/useLogin', () => ({
  useLogin: jest.fn(),
}));

// Mock the useToast context hook
jest.mock('../../contexts/ToastContext', () => ({
  useToast: jest.fn(),
}));

// Mock the image import, which Jest cannot handle by default
jest.mock('../../assets/logo.png', () => 'test-logo-stub.png');

describe('LoginForm Component', () => {
  // Define mock functions that we can reuse in our tests
  let mockMutate;
  let mockToast;

  beforeEach(() => {
    // Reset mocks before each test to ensure they are clean
    jest.clearAllMocks(); // Clear all mocks to ensure test isolation
    mockMutate = jest.fn();
    mockToast = {
      success: jest.fn(),
      error: jest.fn(),
    };

    // Provide a default return value for our mocked hooks
    useLogin.mockReturnValue({
      mutate: mockMutate,
      isPending: false, // Default to not pending
    });

    useToast.mockReturnValue(mockToast);
  });

  // Helper function to render the component with all necessary providers
  const renderComponent = () => {
    render(
      <AuthContext.Provider value={{ user: null, login: jest.fn() }}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  // TEST 1: Check for validation errors on empty submission
  test('displays validation errors when submitting with empty fields', async () => {
    renderComponent();

    // ✅ FIX: Use a more specific query to select only the submit button.
    // The anchors `^` and `$` ensure it matches "Sign In" exactly and not "Sign in with Google".
    const signInButton = screen.getByRole('button', { name: /^Sign In$/i });

    // Simulate a user click without filling in the form
    fireEvent.click(signInButton);

    // `waitFor` is needed because Formik's validation is asynchronous.
    // We wait until the error messages appear in the document.
    await waitFor(() => {
      // Check for the email error message
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      // Check for the password error message
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    // Ensure the login function was NOT called because validation failed
    expect(mockMutate).not.toHaveBeenCalled();
  });

  // TEST 2: Check for successful submission with valid data
  test('calls the login mutation with form data upon successful submission', async () => {
    renderComponent();

    // Find the input fields by their labels
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    // ✅ FIX: Use the specific query for the sign-in button
    const signInButton = screen.getByRole('button', { name: /^Sign In$/i });

    // Simulate a user typing valid data into the form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Simulate submitting the form
    fireEvent.click(signInButton);

    // `waitFor` is used to ensure the asynchronous submission process completes.
    await waitFor(() => {
      // Check that our mock `mutate` function was called
      expect(mockMutate).toHaveBeenCalledTimes(1);

      // Check that `mutate` was called with the exact values from the form
      expect(mockMutate).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          password: 'password123',
        },
        // We can use expect.any(Object) for the callbacks since their implementation
        // is tested implicitly by the success/error toast messages.
        expect.any(Object) 
      );
    });
  });
});