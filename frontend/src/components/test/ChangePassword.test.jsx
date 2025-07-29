// src/components/test/ChangePassword.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Import Contexts: Paths go up two levels from 'test' to 'src', then into their respective folders.
import { AuthContext } from '../../auth/AuthProvider';
import { useToast } from '../../contexts/ToastContext';

// Import Component to Test: Path goes up one level to the parent 'components' directory.
import ChangePassword from '../ChangePassword';

// Import external libraries to mock.
import axios from 'axios';

// ----- MOCKS -----

// Mock the axios library. Jest will automatically intercept any calls to axios.
jest.mock('axios');

// Mock the useToast context hook. The path is relative to this test file.
jest.mock('../../contexts/ToastContext', () => ({
  useToast: jest.fn(),
}));

describe('ChangePassword Component', () => {
  let mockToast;
  const mockUser = { _id: 'user123' }; // A mock user for the AuthContext

  // Before each test, reset the mocks to ensure a clean state
  beforeEach(() => {
    axios.post.mockReset();
    mockToast = {
      success: jest.fn(),
      error: jest.fn(),
    };
    useToast.mockReturnValue(mockToast);
  });

  // Helper function to render the component with necessary context
  const renderComponent = () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <ChangePassword />
      </AuthContext.Provider>
    );
  };

  // TEST 1: Test successful verification of the current password
  test('advances to the "Set New Password" step after successful verification', async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: true, token: 'fake-token-123' },
    });
    renderComponent();

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    fireEvent.change(currentPasswordInput, { target: { value: 'my-old-password' } });

    const verifyButton = screen.getByRole('button', { name: /verify password/i });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith('Current password verified! Please enter new password.');
      expect(screen.getByText('Set Your New Password')).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith('http://localhost:2000/user/verify-password', {
      userId: mockUser._id,
      currentPassword: 'my-old-password',
    });
  });

  // TEST 2: Test the full password reset flow
  test('calls the reset password API with correct data upon final submission', async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: true, token: 'fake-token-123' },
    });
    axios.post.mockResolvedValueOnce({
      data: { success: true },
    });
    
    renderComponent();

    fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: 'my-old-password' } });
    fireEvent.click(screen.getByRole('button', { name: /verify password/i }));
    await screen.findByText('Set Your New Password');
    
    // Use specific regex with start (^) and end ($) anchors to avoid ambiguity
    fireEvent.change(screen.getByLabelText(/^new password$/i), { target: { value: 'my-new-password-!@#' } });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), { target: { value: 'my-new-password-!@#' } });
    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith('Password updated successfully!');
      expect(axios.post).toHaveBeenCalledWith('http://localhost:2000/user/reset-password/fake-token-123', {
        password: 'my-new-password-!@#',
      });
    });

    expect(axios.post).toHaveBeenCalledTimes(2);
  });
});