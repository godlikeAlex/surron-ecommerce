import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('header component', () => {
  it('renders header component', () => {
    expect.hasAssertions();

    render(<Header />);

    expect(screen.getByText('Surron Ecommerce')).toBeInTheDocument();
  });
});
