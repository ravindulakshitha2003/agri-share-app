import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'react-native'

const _Authlayout = () => {
  return (
    <>
     <StatusBar value='auto' />
    <Stack>
        <Stack.Screen name='login' options={{headerShown: false}} />
         <Stack.Screen name='register' options={{headerShown: false}} />
    </Stack>
    </>
    
  )
}

export default _Authlayout

const styles = StyleSheet.create({})