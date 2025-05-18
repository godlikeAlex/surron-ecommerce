import * as Module from './index';
import { Login } from './Login';
import { expect, it, describe } from 'vitest';
import { render, screen } from '@/tests/utils';

describe('login page', () => {
  it('renders LoginForm', () => {
    expect.assertions(1);

    render(<Login />);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});

describe('login exports', () => {
  it('should correctly export login component', () => {
    expect.hasAssertions();

    expect(Module).toHaveProperty('Login');
    expect(Module.Login).toBeDefined();
    expect(Module.Login).toBe(Login);
  });
});
