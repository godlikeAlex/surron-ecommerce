import { Login } from './Login';
import { expect, it, describe } from 'vitest';
import { render, screen } from '@/tests/utils';

describe('login page', () => {
  it('should renders LoginForm', () => {
    expect.assertions(1);

    render(<Login />);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});
