
import { StyleSheet, Text, TextInput, useColorScheme } from 'react-native';
import React from 'react';
import TheamView from './TheamView';
import { color } from '../styles/colors.js';

const ThemedInput = ({ style, label, ...props }) => {
  const colorTheme = useColorScheme() ?? 'light';
  const theme = color[colorTheme];

  return (
    <TheamView style={[{ margin :2 ,marginVertical : 10 },styles.inputStyle]}  {...props}>
      {label && (
        <Text style={{ color: theme.text ,  }}>
          {label}
        </Text>
      )}

      <TextInput
        style={[
          styles.textInput,
          {
            color: theme.text,
            backgroundColor: theme.background,
            width : '98%',
            margin: 'auto'
          },
          style,
        ]}
        placeholderTextColor={theme.iconColor}
        {...props}
      />
    </TheamView>
  );
};

export default ThemedInput;

const styles = StyleSheet.create({
  inputStyle: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width : "100%"
  },
  textInput: {
    padding: 8,
    borderRadius: 5,
  },
});
