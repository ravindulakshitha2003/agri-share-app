
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';

import { color } from '../styles/colors';

const ThemedInput = ({
  style,
  label,
  error,
  helperText,
  ...props
}) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = color[scheme] ?? color.light;

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, { color: theme.title }]}>
          {label}
          {props.required ? (
            <Text style={{ color: color.warning }}> *</Text>
          ) : null}
        </Text>
      ) : null}

      <TextInput
        style={[
          styles.input,
          {
            color: theme.inputText,
            backgroundColor: theme.card,
            borderColor: error ? color.warning : theme.inputbox,
          },
          props.multiline && styles.multiline,
          style,
        ]}
        placeholderTextColor={theme.placeholder ?? theme.iconColor}
        selectionColor={theme.primary}
        accessibilityLabel={label}
        underlineColorAndroid="transparent"
        {...props}
      />

      {error ? (
        <Text style={styles.errorText}>
          {error}
        </Text>
      ) : helperText ? (
        <Text style={[styles.helperText, { color: theme.text }]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

export default ThemedInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 7,
  },
  input: {
    width: '100%',
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    marginTop: 6,
  },
  errorText: {
    color: color.warning,
    fontSize: 12,
    marginTop: 6,
  },
});
