import * as Module from './index';
import { Registration } from './Registration';
import { expect, it, describe } from 'vitest';
import { render, screen } from '@/tests/utils';

describe('registration page', () => {
  it('renders registration form', () => {
    expect.assertions(2);

    render(<Registration />);

    expect(screen.getByText('Регистрация')).toBeInTheDocument();
    expect(screen.getByTestId('registration-form')).toBeInTheDocument();
  });
});

describe('registration exports', () => {
  it('should correctly export registration page component', () => {
    expect.hasAssertions();

    expect(Module).toHaveProperty('Registration');
    expect(Module.Registration).toBeDefined();
    expect(Module.Registration).toBe(Registration);
  });
});
