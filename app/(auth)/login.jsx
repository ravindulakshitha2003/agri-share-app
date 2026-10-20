
import { StyleSheet, View, Pressable, useColorScheme , Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState } from 'react';
import TheamView from '../../components/TheamView';
import ThemedInput from '../../components/ThemedInput';
import ThemaText from '../../components/ThemaText';
import { color } from '../../styles/colors';
import LOGO from '../../assets/logo.png'
import { Link } from 'expo-router';
import TheamedButton from '../../components/TheamedButton';

import { useUser } from '../../hooks/useUser';



const Login = () => {

  const {login} = useUser();

  const colorTheme = useColorScheme() ?? 'light';
  const theme = color[colorTheme];
  const [username , setUsername] = useState(null);
  const [password , setPassword] = useState(null);

  const handleLogin = () => {
    login(username, password); 

  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <TheamView
      styles={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
         
          <Image source={LOGO}  style={styles.logo} />

          <ThemaText style={[styles.appName, { color: theme.primary }]}>
            Seasona Fruit
          </ThemaText>

          <ThemaText style={styles.subtitle}>
            Freshness starts here.
          </ThemaText>
        </View>

        {/* Login form */}
        <View
          style={[
            styles.form,
            { backgroundColor: theme.card },
          ]}
        >
          <ThemaText style={[styles.title, { color: theme.text ,textAlign : 'center' }]}>
            Welcome back!
          </ThemaText>

          <ThemaText style={[styles.description,{textAlign : 'center'} ]}>
            Sign in to continue to your account
          </ThemaText>

          <View style={styles.fields}>
            <ThemedInput
              label="Username"
              placeholder="Enter your username"
              autoCapitalize="none"
               onChangeText={setUsername}
            />

            <ThemedInput
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
               onChangeText={setPassword}
            />
          </View>
          
          <TheamView>
              <TheamedButton label='sign in' onPress={handleLogin} />
     
          </TheamView>

          

          <View style={styles.footer}>
            <ThemaText style={styles.footerText}>
              Fresh produce, smarter distribution.
            </ThemaText>
            <ThemaText style={[styles.footerText,{color : '#076d32', textDecorationLine: 'underline',fontSize : 12 ,fontWeight :50}]}>
             <Link href='/register' > register </Link>
            </ThemaText>
            
          </View>
        </View>
      </View>
    </TheamView>
</TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 30,
   
  },

  content: {
    width: '100%',
    maxWidth: 430,
  },

  header: {
    alignItems: 'center',
    marginBottom: 28,
  },

  logo: {
    width: 98,
    height: 98,
    borderRadius: 23,
    backgroundColor: '#21834A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
     borderWidth : 2,
    borderColor : '#21834A'
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
  },

  appName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  subtitle: {
    fontSize: 14,
    marginTop: 7,
    opacity: 0.8,
  },

  form: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 26,
    borderRadius: 22,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'left',
  },

  description: {
    fontSize: 13,
    textAlign: 'left',
    marginTop: 8,
    opacity: 0.75,
  },

  fields: {
    marginTop: 16,
  },

  loginButton: {
    minHeight: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  footer: {
    marginTop: 22,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 12,
    opacity: 0.65,
    textAlign: 'center',
  },
});
