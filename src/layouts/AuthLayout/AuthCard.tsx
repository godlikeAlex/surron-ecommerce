import React from 'react';
import { Card, Center, Title, TitleOrder } from '@mantine/core';
import classes from './AuthLayout.module.scss';

interface Props {
  children: React.ReactNode;
  title: string;
  titleOrder?: TitleOrder;
}

const AuthCard = ({ children, title, titleOrder = 1 }: Props) => (
  <Card bg={'transparent'} padding="lg" className={classes.authCard}>
    <Center>
      <Title order={titleOrder} mb={'lg'}>
        {title}
      </Title>
    </Center>

    {children}
  </Card>
);

export default AuthCard;
