import { Pressable, StyleSheet, Text, View ,useColorScheme} from 'react-native'
import React from 'react'
import TheamView from './TheamView';
import ThemaText from './ThemaText';

const TheamedButton = ({style,label='button',...props}) => {
    const Colorthem = useColorScheme();


  return (
  <View styles={{flex :1,alignItems :  'center',justifyContent : 'center' }}>
    <Pressable style={({pressed})=>{
        return  (
            [[styles.btn] ,pressed &&  styles.pressed ]
        )
      }

      
      
      } {...props} >
        <ThemaText style={{ color: '#FFFFFF', fontSize: 16,  fontWeight: '700',}}>
            {label}
        </ThemaText>
        
      </Pressable>
  </View>
      
   
  )
}

export default TheamedButton

const styles = StyleSheet.create({
    btn:{
        minHeight: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        backgroundColor : '#21834A',
        
    },
    pressed : {
        opacity: 0.8,
        transform: [{ scale: 0.99 }]

    }

})