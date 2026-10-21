
import React from 'react';
import {
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import { color } from '../styles/colors';

const ThemaText = ({
  style,
  variant = 'body',
  color: customColor,
  children,
  ...props
}) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = color[scheme] ?? color.light;

  const variants = {
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.title,
    },
    heading: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.title,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.text,
    },
    body: {
      fontSize: 15,
      fontWeight: '400',
      color: theme.text,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      color: theme.iconColor,
    },
    button: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  };

  const selectedVariant = variants[variant] ?? variants.body;

  return (
    <Text
      {...props}
      style={[
        styles.text,
        selectedVariant,
        customColor ? { color: customColor } : null,
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default ThemaText;

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
    includeFontPadding: false,
  },
});
