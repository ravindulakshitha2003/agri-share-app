import { StyleSheet, Text, useColorScheme } from 'react-native'
import React from 'react'
import { color } from '../styles/colors';

const ThemaText = ({style ,...props}) => {
  const colorTheme = useColorScheme() ?? 'light';
  const theme = color[colorTheme];

  return (
    <>
    <Text style={[{ color: theme.text , textAlign : 'center' ,fontWeight : 200},style]} {...props} />
    </>

     
  );
};

export default ThemaText

const styles = StyleSheet.create({})