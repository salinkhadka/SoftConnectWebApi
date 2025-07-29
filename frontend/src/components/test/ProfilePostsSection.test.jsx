// src/components/test/ProfilePostsSection.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthContext } from '../../auth/AuthProvider';
import { useUserPosts } from '../../hooks/Admin/getPostByUser';
import { useFollowing } from '../../hooks/friendsHook';
import ProfilePostsSection from '../ProfilePostsSection';


jest.mock('../../hooks/Admin/getPostByUser', () => ({
  useUserPosts: jest.fn(),
}));


jest.mock('../../hooks/friendsHook', () => ({
  useFollowing: jest.fn(),
}));

// Mock the child component that displays the grid of posts
// This is crucial for isolating the ProfilePostsSection component.
jest.mock('../UserPostsView', () => {
  // The mock will render a simple div with a data-testid,
  // allowing us to check if it was rendered.
  return () => <div data-testid="user-posts-grid" />;
});


describe('ProfilePostsSection Component', () => {
  // Define some mock user data to use in the tests
  const mockLoggedInUser = { _id: 'loggedInUserId123' };
  const mockProfileUser = { _id: 'profileUserId456', username: 'TestUser' };

  // Helper function to render the component with necessary context providers
  const renderComponent = (loggedInUser, profileUser) => {
    return render(
      <AuthContext.Provider value={{ user: loggedInUser }}>
        <ProfilePostsSection user={profileUser} />
      </AuthContext.Provider>
    );
  };

  // Reset mocks before each test to ensure a clean state
  beforeEach(() => {
    useUserPosts.mockClear();
    useFollowing.mockClear();
  });

  // TEST 1: The Private View (Not Following)
  test('shows "Posts are private" message when not following the user', () => {
    // Setup: Simulate not following the user
    useUserPosts.mockReturnValue({ data: [], isLoading: false });
    // Return an empty array for the following list
    useFollowing.mockReturnValue({ data: { data: [] }, isLoading: false });

    // Render the component viewing another user's profile
    renderComponent(mockLoggedInUser, mockProfileUser);

    // Assert: Check for the private message
    expect(screen.getByText('Posts are private')).toBeInTheDocument();
    expect(screen.getByText(`Follow ${mockProfileUser.username} to see their posts`)).toBeInTheDocument();

    // Assert: The posts grid should NOT be visible
    expect(screen.queryByTestId('user-posts-grid')).not.toBeInTheDocument();
  });

  // TEST 2: The Own Profile View
  test('shows the posts grid when viewing one\'s own profile', () => {
    // Setup: Simulate viewing your own profile
    // Return some mock posts
    useUserPosts.mockReturnValue({ data: [{ _id: 'post1' }], isLoading: false });
    // The following hook will be called but its result doesn't matter here
    useFollowing.mockReturnValue({ data: { data: [] }, isLoading: false });

    // Render the component with the logged-in user being the same as the profile user
    renderComponent(mockLoggedInUser, mockLoggedInUser);

    // Assert: Check for the correct title
    expect(screen.getByText('Your Posts')).toBeInTheDocument();

    // Assert: The posts grid SHOULD be visible
    expect(screen.getByTestId('user-posts-grid')).toBeInTheDocument();

    // Assert: The private message should NOT be visible
    expect(screen.queryByText('Posts are private')).not.toBeInTheDocument();
  });
});