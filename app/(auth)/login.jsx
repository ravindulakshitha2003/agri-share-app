
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  useColorScheme,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import { Link,  useRouter } from 'expo-router';

import TheamView from '../../components/TheamView';
import ThemedInput from '../../components/ThemedInput';
import ThemaText from '../../components/ThemaText';
import TheamedButton from '../../components/TheamedButton';

import { color } from '../../styles/colors';
import LOGO from '../../assets/logo.png';
import { useUser } from '../../hooks/useUser';


const PRIMARY = '#21834A';

const Login = () => {
  const { login } = useUser();

  const colorTheme = useColorScheme() ?? 'light';
  const theme = color[colorTheme];

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const  router = useRouter()

  const handleLogin = () => {
    if (!username.trim() || !password) {
      return;
    }

   const data = login(username.trim(), password);
   if(data != null){
      router.replace('/shop');
   }
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
          {/* App Header */}
          <View style={styles.header}>
            <Image source={LOGO} style={styles.logo} />

            <ThemaText
              style={[
                styles.appName,
                { color: theme.primary || PRIMARY },
              ]}
            >
              Seasona Fruit
            </ThemaText>

            <ThemaText
              style={[
                styles.subtitle,
                { color: theme.text },
              ]}
            >
              Freshness starts here.
            </ThemaText>
          </View>

          {/* Login Form */}
          <View
            style={[
              styles.form,
              { backgroundColor: theme.card },
            ]}
          >
            <ThemaText
              style={[
                styles.title,
                { color: theme.text },
              ]}
            >
              Welcome back!
            </ThemaText>

            <ThemaText
              style={[
                styles.description,
                { color: theme.text },
              ]}
            >
              Sign in to continue to your account
            </ThemaText>

            {/* Input Fields */}
            <View style={styles.fields}>
              <ThemedInput
                label="Username"
                placeholder="Enter your username"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setUsername}
              />

              <ThemedInput
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={setPassword}
              />
            </View>

            {/* Sign In Button */}
            <View style={styles.buttonContainer}>
              <TheamedButton
                label="Sign In"
                onPress={handleLogin}
              />
            </View>

            {/* Footer */}
            <TheamView style={styles.footer}>
                <ThemaText
                  style={[
                    styles.footerText,
                    { color: theme.text },
                  ]}
                >
                  Fresh produce, smarter distribution.
                </ThemaText>

                <View style={styles.registerContainer}>
                  <ThemaText
                    style={[
                      styles.registerPrompt,
                      { color: theme.text },
                    ]}
                  >
                    Don't have an account?
                  </ThemaText>

                  <Link href="/register" asChild>
                    <Pressable
                      accessibilityRole="link"
                      hitSlop={8}
                    >
                      <ThemaText style={styles.registerLink}>
                        Register
                      </ThemaText>
                    </Pressable>
                  </Link>
                </View>
            </TheamView>
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
    backgroundColor: PRIMARY,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: PRIMARY,
  },

  appName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.4,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 7,
    opacity: 0.8,
    textAlign: 'center',
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
    textAlign: 'center',
  },

  description: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.75,
  },

  fields: {
    marginTop: 16,
    gap: 14,
  },

  buttonContainer: {
    marginTop: 24,
  },

  footer: {
    marginTop: 22,
    alignItems: 'center',
    gap: 12,
  },

  footerText: {
    fontSize: 12,
    opacity: 0.65,
    textAlign: 'center',
  },

  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  registerPrompt: {
    fontSize: 12,
    opacity: 0.8,
  },

  registerLink: {
    color: PRIMARY,
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
