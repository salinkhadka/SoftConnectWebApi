// src/components/test/HomePage.test.jsx
import React from 'react';
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import { AuthContext } from "../../auth/AuthProvider";

// ----- MOCKS & POLYFILLS -----

// Polyfill for window.matchMedia for the Jest/JSDOM environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock hooks to prevent API calls and 'import.meta.env' errors
jest.mock("../../hooks/notificationHooks", () => ({
  useNotifications: jest.fn(() => ({ data: [] })),
}));
jest.mock("../../hooks/messagehooks", () => ({
  useConversations: jest.fn(() => ({ data: [] })),
}));

// Mock child components to simplify the test
jest.mock("../../components/AddPostModal", () => () => <div />);
jest.mock("../../components/SearchModal", () => () => <div />);
jest.mock("../../components/ui/ConfirmationModal", () => () => <div />);

// Mock image import
jest.mock('../../assets/logo.png', () => 'test-logo-stub');

describe("HomePage Component", () => {
  const mockUser = { _id: "123", username: "testuser", email: "test@test.com", profilePhoto: "" };
  const mockAuthContext = { user: mockUser, logout: jest.fn() };

  const renderHomePage = () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  // --- FIX: Adjusted this test ---
  test("renders the brand name 'Soft' and 'Connect'", () => {
    renderHomePage();
    
    // Query for the two parts of the name separately, since they are in different spans.
    // We use getAllByText because the name appears in the header and footer.
    const softElements = screen.getAllByText(/Soft/i);
    const connectElements = screen.getAllByText(/Connect/i);

    // Assert that at least one of each part is found
    expect(softElements.length).toBeGreaterThan(0);
    expect(connectElements.length).toBeGreaterThan(0);
  });

  test("renders the 'Home' navigation link", () => {
    renderHomePage();
    const homeLinks = screen.getAllByText("Home");
    expect(homeLinks.length).toBeGreaterThan(0);
  });
});