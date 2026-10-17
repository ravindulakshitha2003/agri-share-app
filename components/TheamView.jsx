import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'

const TheamView = ({styles , ...props}) => {
    const Theam = useColorScheme();
  return (
    <View  style={[{margin : "2",padding: 5 ,width : '100%'},styles]}  {...props} />
      
  )
}

export default TheamView

const styles = StyleSheet.create({})