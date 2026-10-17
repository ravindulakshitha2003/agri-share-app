import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Home = () => {
  return (
    <View style ={{ flex: 1, justifyContent: 'center',alignItems: 'center' , backgroundColor:"white"}}>
      <Text style={{color : "black"}}>Home</Text>
      <Link href="/login">login page </Link>

      <Pressable onPress={()=>{
        
      }} >
        
      </Pressable>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    
})