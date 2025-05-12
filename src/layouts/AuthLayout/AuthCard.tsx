import React from 'react';
import { Card, Center, Title } from '@mantine/core';
import classes from './AuthLayout.module.scss';

interface Props {
  children: React.ReactNode;
  title: string;
}

const AuthCard = ({ children, title }: Props) => (
  <Card
    bg={'transparent'}
    shadow="sm"
    padding="lg"
    radius={'md'}
    className={classes.authCard}
  >
    <Center>
      <Title order={1} mb={'lg'}>
        {title}
      </Title>
    </Center>

    {children}
  </Card>
);

export default AuthCard;
