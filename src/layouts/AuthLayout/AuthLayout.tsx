import React, { useMemo } from 'react';
import { Box } from '@mantine/core';
import AuthCard from './AuthCard';

import authBg1 from '@/assets/backgrounds/bg-1.webp';
import authBg2 from '@/assets/backgrounds/bg-2.jpg';
import authBg3 from '@/assets/backgrounds/bg-3.webp';
import authBg4 from '@/assets/backgrounds/bg-4.jpg';
import authBg5 from '@/assets/backgrounds/bg-5.jpg';
import authBg6 from '@/assets/backgrounds/bg-6.jpg';
import authBg7 from '@/assets/backgrounds/bg-7.jpg';
import authBg8 from '@/assets/backgrounds/bg-8.jpg';

import classes from './AuthLayout.module.scss';

const backgrounds: Array<string> = [
  authBg1,
  authBg2,
  authBg3,
  authBg4,
  authBg5,
  authBg6,
  authBg7,
  authBg8,
];

interface Props {
  children: React.ReactNode;
  backgroundVariants?: Array<string>;
}

const pickRandom = <T,>(a: Array<T>): T =>
  a[Math.floor(a.length * Math.random())];

const AuthLayout = ({ children, backgroundVariants = backgrounds }: Props) => {
  const backgroundImage = useMemo(
    () => `url(${pickRandom(backgroundVariants)})`,
    [backgroundVariants]
  );

  return (
    <Box className={classes.authSection} style={{ backgroundImage }}>
      {children}
    </Box>
  );
};

AuthLayout.Card = AuthCard;

export default AuthLayout;
