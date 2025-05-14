import React from 'react';
import { Box } from '@mantine/core';
import AuthCard from './AuthCard';

import authBg1 from '@/assets/backgrounds/auth-bg-1.webp';
import authBg2 from '@/assets/backgrounds/auth-bg-2.jpg';

import classes from './AuthLayout.module.scss';

const backgrounds: Record<'first' | 'second', string> = {
  first: authBg1,
  second: authBg2,
};

interface Props {
  children: React.ReactNode;
  backgroundVariant: 'first' | 'second';
}

const AuthLayout = ({ children, backgroundVariant }: Props) => (
  <Box
    className={classes.authSection}
    style={{ backgroundImage: `url(${backgrounds[backgroundVariant]})` }}
  >
    {children}
  </Box>
);

AuthLayout.Card = AuthCard;

export default AuthLayout;
