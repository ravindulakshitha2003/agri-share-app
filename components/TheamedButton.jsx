
import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';

import ThemaText from './ThemaText';
import { color } from '../styles/colors';

const TheamedButton = ({
  style,
  label = 'Button',
  variant = 'primary',
  loading = false,
  disabled = false,
  ...props
}) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = color[scheme] ?? color.light;

  const isDisabled = disabled || loading;

  const buttonVariants = {
    primary: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
      textColor: '#FFFFFF',
    },
    secondary: {
      backgroundColor: theme.uiBackground,
      borderColor: theme.uiBackground,
      textColor: theme.title,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: theme.primary,
      textColor: theme.primary,
    },
    danger: {
      backgroundColor: color.warning,
      borderColor: color.warning,
      textColor: '#FFFFFF',
    },
  };

  const selectedVariant =
    buttonVariants[variant] ?? buttonVariants.primary;

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{
          disabled: isDisabled,
          busy: loading,
        }}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: selectedVariant.backgroundColor,
            borderColor: selectedVariant.borderColor,
          },
          variant === 'outline' && styles.outlineButton,
          pressed && !isDisabled && styles.pressed,
          isDisabled && styles.disabled,
          style,
        ]}
        {...props}
      >
        {loading ? (
          <ThemaText
            style={[styles.label, { color: selectedVariant.textColor }]}
          >
            Please wait...
          </ThemaText>
        ) : (
          <ThemaText
            style={[styles.label, { color: selectedVariant.textColor }]}
          >
            {label}
          </ThemaText>
        )}
      </Pressable>
    </View>
  );
};

export default TheamedButton;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  button: {
    minHeight: 48,
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    borderWidth: 1.5,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
