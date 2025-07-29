// src/components/test/ForgotPassword.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useRequestPasswordReset } from '../../hooks/Admin/adminUserhook';
import { useToast } from '../../contexts/ToastContext';
import ForgotPassword from '../ForgotPassword'; // Adjust path if necessary

// ----- MOCKS -----
// We mock all external dependencies to isolate the component.

// Mock the custom hook for requesting a password reset
jest.mock('../../hooks/Admin/adminUserhook', () => ({
  useRequestPasswordReset: jest.fn(),
}));

// Mock the useToast context hook
jest.mock('../../contexts/ToastContext', () => ({
  useToast: jest.fn(),
}));

describe('ForgotPassword Component', () => {
  let mockMutate;
  let mockToast;

  // Before each test, reset the mocks to ensure a clean slate
  beforeEach(() => {
    // Reset the mock functions
    mockMutate = jest.fn();
    mockToast = {
      success: jest.fn(),
      error: jest.fn(),
    };

    // Provide default mock implementations for the hooks
    useRequestPasswordReset.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });
    useToast.mockReturnValue(mockToast);
  });

  // Helper function to render the component within necessary providers
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
  };

  // TEST 1: Check the initial state of the component
  test('renders the initial form correctly', () => {
    renderComponent();

    // Check for the main heading
    expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument();
    
    // Check for the email input field
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    
    // Check for the submit button
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    
    // Ensure no success or error messages are visible on initial render
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // TEST 2: Test the successful submission flow
  test('displays a success message and calls toast on successful submission', async () => {
    // Arrange: Configure the mock mutate function to simulate a success case.
    // It will immediately call its `onSuccess` callback when invoked.
    const successMessage = "A reset link has been sent.";
    mockMutate.mockImplementation((email, { onSuccess }) => {
      onSuccess({ message: successMessage });
    });

    renderComponent();

    // Act: Simulate a user typing their email and submitting the form
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // Assert: Wait for the asynchronous actions to complete
    await waitFor(() => {
      // Check that the mutate function was called with the correct email
      expect(mockMutate).toHaveBeenCalledWith('test@example.com', expect.any(Object));
      
      // Check that the success alert is now visible with the correct message
      const successAlert = screen.getByRole('alert');
      expect(successAlert).toHaveTextContent(successMessage);
      
      // Check that the success toast was called
      expect(mockToast.success).toHaveBeenCalledWith("Password reset link sent to your email");
    });
  });

  // TEST 3: Test the submission flow when an error occurs
  test('displays an error message and calls toast on a failed submission', async () => {
    // Arrange: Configure the mock mutate to simulate an error.
    // It will immediately call its `onError` callback.
    const errorMessage = "User not found.";
    mockMutate.mockImplementation((email, { onError }) => {
      onError({ message: errorMessage });
    });

    renderComponent();

    // Act: Simulate user input and form submission
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.click(submitButton);

    // Assert: Wait for the UI to update
    await waitFor(() => {
      // Check that the mutate function was still called
      expect(mockMutate).toHaveBeenCalledWith('wrong@example.com', expect.any(Object));
      
      // Check that the error alert is visible with the message from the mock error
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toHaveTextContent(errorMessage);
      
      // Check that the error toast was called
      expect(mockToast.error).toHaveBeenCalledWith("Failed to send reset email");
    });
  });
});