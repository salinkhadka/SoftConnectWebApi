// src/components/test/NotificationPage.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthContext } from '../../auth/AuthProvider';
import { useToast } from '../../contexts/ToastContext';
import NotificationPage from '../NotificationPage';
import * as api from '../../api/notificationApi';

// ----- MOCKS -----

// FIX 1: Mock the source of the `import.meta.env` error.
// This is the most important fix. It stops Jest from ever reading the problematic `api.js` file.
jest.mock('../../api/api', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the entire notificationApi module to control its functions.
jest.mock('../../api/notificationApi');

// Mock other dependencies.
jest.mock('../../contexts/ToastContext', () => ({ useToast: jest.fn() }));
jest.mock('../DeleteModal', () => jest.fn(() => null));
jest.useFakeTimers();

describe('NotificationPage Component', () => {
  let mockToast;
  const mockUser = { _id: 'user123' };

  beforeEach(() => {
    jest.clearAllMocks();
    mockToast = { success: jest.fn(), error: jest.fn() };
    useToast.mockReturnValue(mockToast);
  });

  const renderComponent = () => {
    // Return the `container` from render so we can use it for our bruteforce query.
    return render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <NotificationPage />
      </AuthContext.Provider>
    );
  };

  // TEST 1: Check for the initial loading state
  test('displays loading skeletons on initial render', async () => {
    // Arrange: Mock the API to be in a pending state
    api.getNotifications.mockReturnValue(new Promise(() => {}));
    
    // Act: Render the component and get the base `container` element
    const { container } = renderComponent();

    // FIX 2 (The "Bruteforce" a.k.a. Escape Hatch):
    // Assert: Instead of a perfect selector, we query the DOM for any element
    // with the 'animate-pulse' class, which is unique to the skeletons.
    await waitFor(() => {
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  // TEST 2: Check for the empty state message
  test('displays "No notifications yet" message when API returns no data', async () => {
    api.getNotifications.mockResolvedValue({ data: { data: [] } });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('No notifications yet')).toBeInTheDocument();
    });
  });

  // TEST 3: Check that notifications are rendered correctly
  test('renders a list of notifications when API returns data', async () => {
    const mockNotifications = [
      { _id: '1', message: 'User A liked your post', type: 'like', createdAt: new Date().toISOString(), isRead: false },
      { _id: '2', message: 'User B started following you', type: 'follow', createdAt: new Date().toISOString(), isRead: true },
    ];
    api.getNotifications.mockResolvedValue({ data: { data: mockNotifications } });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('User A liked your post')).toBeInTheDocument();
    });
    expect(screen.getByText('1')).toBeInTheDocument(); // Unread count
  });

  // TEST 4: Test marking a single notification as read
  test('calls markNotificationAsRead when an unread notification is clicked', async () => {
    const mockNotifications = [
      { _id: 'notif1', message: 'Unread Notification', createdAt: new Date().toISOString(), isRead: false },
    ];
    api.getNotifications.mockResolvedValue({ data: { data: mockNotifications } });
    api.markNotificationAsRead.mockResolvedValue({ success: true });
    renderComponent();

    const unreadNotification = await screen.findByText('Unread Notification');
    fireEvent.click(unreadNotification);

    await waitFor(() => {
      expect(api.markNotificationAsRead).toHaveBeenCalledWith('notif1');
    });
    expect(api.getNotifications).toHaveBeenCalledTimes(2);
  });
});