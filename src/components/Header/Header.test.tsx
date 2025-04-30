import { describe, expect, it } from 'vitest';
import Header from './Header';
import { render, screen } from '../../tests/utils';

describe('header component', () => {
  it('renders header component', () => {
    expect.hasAssertions();

    render(<Header />);

    expect(screen.getByText('Surron Ecommerce')).toBeInTheDocument();
  });
});
