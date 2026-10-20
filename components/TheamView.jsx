import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const TheamView = ({styles ,safe =false ,...props}) => {
    const Theam = useColorScheme();

  if(safe){
    return(
       <SafeAreaView style={[{margin : "2",padding: 5 ,width : '100%'},styles]}  {...props} />
    )
  }else{
     return (
    <View style={[{margin : "2",padding: 5 ,width : '100%'},styles]}  {...props} />
      
  )
  }

 
}

export default TheamView

const styles = StyleSheet.create({})