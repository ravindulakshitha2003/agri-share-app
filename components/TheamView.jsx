
import React from 'react';
import {
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color } from '../styles/colors';

const TheamView = ({
  styles,
  safe = false,
  background,
  children,
  ...props
}) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = color[scheme] ?? color.light;

  const Container = safe ? SafeAreaView : View;

  return (
    <Container
      style={[
        componentStyles.container,
        {
          backgroundColor: background ?? theme.background,
        },
        styles,
      ]}
      {...props}
    >
      {children}
    </Container>
  );
};

export default TheamView;

const componentStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
