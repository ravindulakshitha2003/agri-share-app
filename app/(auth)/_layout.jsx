import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'react-native'
import { UserProvider } from "../../context/UserContext"; // ✅ Capitalized UserContext

const _Authlayout = () => {
  return (
    
    <UserProvider>
    <StatusBar value='auto' />
    <Stack>

        <Stack.Screen name='login' options={{headerShown: false}} />
        <Stack.Screen name='register' options={{headerShown: false}} />
    
    </Stack>
      </UserProvider>
   
    
  )
}

export default _Authlayout

const styles = StyleSheet.create({})