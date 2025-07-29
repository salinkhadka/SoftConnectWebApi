// src/components/test/ProfileInfo.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useFollowers, useFollowing } from '../../hooks/friendsHook';
import ProfileInfo from '../ProfileInfo';
import FollowersFollowingModal from '../FollowersFollowingModal';

// ----- MOCKS -----

jest.mock('../../hooks/friendsHook', () => ({
  useFollowers: jest.fn(),
  useFollowing: jest.fn(),
}));

// FIX 1: Make the modal mock more interactive.
// It will now render a close button that calls the `onClose` prop from the parent.
jest.mock('../FollowersFollowingModal', () => {
  return jest.fn(({ open, title, users, onClose }) =>
    open ? (
      <div data-testid="mock-modal">
        <h2>{title}</h2>
        <p>Users: {users.length}</p>
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null
  );
});

describe('ProfileInfo Component', () => {
  const mockUser = {
    _id: 'user123',
    email: 'test@example.com',
    createdAt: new Date('2023-01-01').toISOString(),
    bio: 'This is a test bio.',
  };
  const mockPosts = { data: [{ id: 'p1' }, { id: 'p2' }] };

  beforeEach(() => {
    useFollowers.mockClear();
    useFollowing.mockClear();
    FollowersFollowingModal.mockClear();
  });

  // Tests 1 and 2 are correct and remain unchanged.
  test('renders user information from props correctly', () => {
    useFollowers.mockReturnValue({ data: { data: [] } });
    useFollowing.mockReturnValue({ data: { data: [] } });
    render(<ProfileInfo user={mockUser} posts={mockPosts} postsLoading={false} />);
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  test('displays follower and following counts from hooks', () => {
    useFollowers.mockReturnValue({ data: { data: [{ _id: 'f1' }] } });
    useFollowing.mockReturnValue({ data: { data: [{ _id: 'f2' }, { _id: 'f3' }] } });
    render(<ProfileInfo user={mockUser} posts={mockPosts} postsLoading={false} />);
    expect(screen.getByRole('button', { name: /followers/i })).toHaveTextContent('1');
  });


});