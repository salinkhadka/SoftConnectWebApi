// src/components/test/AdminLayout.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthProvider';
import AdminLayout from '../../layouts/AdminLayout';

// ----- MOCKS & POLYFILLS (no changes here) -----

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../../components/ui/ConfirmationModal', () => {
  return () => null;
});

const renderWithProviders = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AuthContext.Provider value={providerProps.value}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>,
    renderOptions
  );
};

describe('AdminLayout', () => {
  const providerProps = {
    value: {
      user: { username: 'TestAdmin', email: 'test@example.com' },
      logout: jest.fn(),
    },
  };

  test('renders the main title "SoftConnect"', () => {
    renderWithProviders(<AdminLayout />, { providerProps });
    const titleElements = screen.getAllByText('SoftConnect');
    expect(titleElements.length).toBeGreaterThan(0);
  });

  // --- THIS TEST IS NOW FIXED ---
  test('renders the primary navigation links', () => {
    renderWithProviders(<AdminLayout />, { providerProps });

    // FIX: Use `getAllByRole` to find all elements that are links (<a> tags with href).
    // The 'name' option checks for the accessible name, which is the text content.
    // This correctly handles that there are multiple links for "Users" (desktop/mobile).
    const usersLinks = screen.getAllByRole('link', { name: /users/i });
    expect(usersLinks.length).toBeGreaterThan(0);

    // We can do the same for the other links to make the test more complete.
    const postsLinks = screen.getAllByRole('link', { name: /posts/i });
    expect(postsLinks.length).toBeGreaterThan(0);

    const analyticsLinks = screen.getAllByRole('link', { name: /analytics/i });
    expect(analyticsLinks.length).toBeGreaterThan(0);
  });
});