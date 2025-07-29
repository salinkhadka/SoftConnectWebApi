// src/components/test/UserPostsGrid.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserPostsGrid from '../UserPostsView'; // Correct path from test folder

// ----- MOCKS -----
// This setup is the "bruteforce" solution that works without changing component code.

// FIX: Mock the entire module that causes the `import.meta.env` error.
// This is the most important change.
jest.mock('../../utils/getBackendImageUrl', () => ({
  // The property name must match the function being exported from the real file.
  getBackendImageUrl: jest.fn(url => `mocked_url_for_${url}`),
}));

// Mock all child components to isolate the grid's logic.
jest.mock('../LikeButton', () => jest.fn(() => <div data-testid="like-button-mock" />));
jest.mock('../CommentButton', () => jest.fn(() => <div data-testid="comment-count-mock" />));
jest.mock('../PostModalStandalone', () => {
    return jest.fn(({ isOpen, post }) => (
        isOpen ? <div data-testid="post-modal-mock">{post.content}</div> : null
    ));
});

// Mock the `useNavigate` hook from 'react-router-dom'.
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));


describe('UserPostsGrid Component', () => {
  const mockUser = { _id: 'user123', username: 'GridUser' };
  const mockPosts = [
    { _id: 'post1', content: 'This is the first post.', userId: { _id: 'postUser1', username: 'PostUserAlpha' }, privacy: 'public', createdAt: new Date().toISOString() },
    { _id: 'post2', content: 'This is a private post.', userId: { _id: 'postUser2', username: 'PostUserBeta' }, privacy: 'private', createdAt: new Date().toISOString() },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TEST 1: The Empty State
  test('displays "No posts to show" message when posts array is empty', () => {
    render(<UserPostsGrid posts={[]} user={mockUser} />);
    expect(screen.getByText('No posts to show.')).toBeInTheDocument();
  });

  // TEST 2: Correct Rendering of Post Data
  test('renders a grid of posts with correct content and user info', () => {
    render(
      <MemoryRouter>
        <UserPostsGrid posts={mockPosts} user={mockUser} />
      </MemoryRouter>
    );

    expect(screen.getByText('This is the first post.')).toBeInTheDocument();
    expect(screen.getByText('This is a private post.')).toBeInTheDocument();
    expect(screen.getByText('PostUserAlpha')).toBeInTheDocument();

    const likeButtons = screen.getAllByTestId('like-button-mock');
    expect(likeButtons.length).toBe(mockPosts.length);
  });

  // TEST 3: User Interactions (Opening Modal and Navigating)
  test('opens the post modal on click and navigates when username is clicked', () => {
    render(
      <MemoryRouter>
        <UserPostsGrid posts={mockPosts} user={mockUser} />
      </MemoryRouter>
    );

    // --- Test Modal Interaction ---
    expect(screen.queryByTestId('post-modal-mock')).not.toBeInTheDocument();
    const firstPostCard = screen.getByText('This is the first post.');
    fireEvent.click(firstPostCard);
    const modal = screen.getByTestId('post-modal-mock');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent('This is the first post.');

    // --- Test Navigation Interaction ---
    const usernameLink = screen.getByText('PostUserAlpha');
    fireEvent.click(usernameLink);
    expect(mockNavigate).toHaveBeenCalledWith('/postUser1');
  });
});