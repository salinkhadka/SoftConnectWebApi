// src/components/test/SignupForm.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignupForm from '../SignupComponent'; // Adjust path if necessary
import { useRegisterUser } from '../../hooks/useRegister';

// ----- MOCKS -----
// We mock all external dependencies to isolate the component for testing.

// Mock the custom hook for user registration
jest.mock('../../hooks/useRegister', () => ({
  useRegisterUser: jest.fn(),
}));

// Mock the 'uuid' library to return a predictable value for tests
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-12345',
}));

// Mock the logo image import
jest.mock('../../assets/logo.png', () => 'test-logo.png');

describe('SignupForm Component', () => {
  let mockMutate;

  // Before each test, reset the mocks to ensure a clean slate
  beforeEach(() => {
    mockMutate = jest.fn();
    useRegisterUser.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  // Helper function to render the component within a router
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );
  };

  // TEST 1: Check that validation errors appear for required fields
  test('displays validation errors when submitting with empty required fields', async () => {
    renderComponent();

    // Find the submit button and click it without filling out the form
    const createButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(createButton);

    // Wait for Formik's asynchronous validation to complete and display errors
    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Student ID is required')).toBeInTheDocument();
      expect(screen.getByText('Role is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('Confirm password is required')).toBeInTheDocument();
    });

    // Ensure the registration mutation was NOT called because validation failed
    expect(mockMutate).not.toHaveBeenCalled();
  });

  // TEST 2: Check that the form submits correctly with valid data (and NO image)
  test('calls register mutation with form data (without image) on successful submission', async () => {
    renderComponent();

    // Fill out all the required form fields with valid data
    // We will find the elements by their accessible label text
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/student id/i), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText(/^role$/i), { target: { value: 'Student' } }); // Use regex for an exact match on "Role"
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

    // We completely ignore the file input, as it's optional.

    // Find and click the submit button
    const createButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(createButton);

    // Wait for the asynchronous submission to be processed
    await waitFor(() => {
      // Check that the mutate function was called exactly once
      expect(mockMutate).toHaveBeenCalledTimes(1);

      // Grab the FormData object that was passed to our mock mutate function
      const submittedFormData = mockMutate.mock.calls[0][0];

      // Verify the content of the FormData object
      expect(submittedFormData.get('username')).toBe('testuser');
      expect(submittedFormData.get('email')).toBe('test@example.com');
      expect(submittedFormData.get('StudentId')).toBe('12345');
      expect(submittedFormData.get('role')).toBe('Student');
      expect(submittedFormData.get('password')).toBe('password123');
      expect(submittedFormData.get('userId')).toBe('test-uuid-12345');
      
      // CRITICAL CHECK: Verify that no profile photo was appended to the form data
      expect(submittedFormData.get('profilePhoto')).toBeNull();
    });
  });
});