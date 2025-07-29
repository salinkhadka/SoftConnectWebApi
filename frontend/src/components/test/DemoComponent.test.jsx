import React from 'react';
import { render, screen } from '@testing-library/react';
import DemoComponent from './DemoComponent';

test('renders hello text', () => {
  render(<DemoComponent/>);
  expect(screen.getByText('Hello, MERN Test!')).toBeInTheDocument();
});
