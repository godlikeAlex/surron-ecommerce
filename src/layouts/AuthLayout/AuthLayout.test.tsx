import { describe, expect, it } from 'vitest';
import AuthLayout from './AuthLayout';
import { render, screen } from '@/tests/utils';

import authBg1 from '@/assets/backgrounds/auth-bg-1.webp';

describe('component AuthLayout', () => {
  it('should render with correct children', () => {
    expect.hasAssertions();

    const children = 'Hello world';

    render(<AuthLayout>{children}</AuthLayout>);

    expect(screen.getByText(children)).toBeInTheDocument();
  });

  it('should render with correct background', () => {
    expect.hasAssertions();

    render(
      <AuthLayout>
        <form name="registration"></form>
      </AuthLayout>
    );

    const childrenLayout = screen.getByRole('form');

    expect(childrenLayout.parentElement).toHaveStyle(
      `background-image: url(${authBg1})`
    );
  });
});

describe('component AuthCard', () => {
  it('should render with correct title text', () => {
    expect.hasAssertions();

    const title = 'Login Page';

    render(
      <AuthLayout.Card title={title}>
        <form></form>
      </AuthLayout.Card>
    );

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(heading.textContent).equal(title);
  });

  it('should render with correct children', () => {
    expect.hasAssertions();

    render(
      <AuthLayout.Card title={'Registration Form'}>
        <form name="registration"></form>
      </AuthLayout.Card>
    );

    expect(screen.getByRole('form')).toBeInTheDocument();
  });
});
