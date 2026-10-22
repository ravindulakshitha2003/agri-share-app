
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  useColorScheme,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

import { Link, router } from 'expo-router';

import TheamView from '../../components/TheamView';
import ThemedInput from '../../components/ThemedInput';
import ThemaText from '../../components/ThemaText';
import TheamedButton from '../../components/TheamedButton';

import { color } from '../../styles/colors';
import LOGO from '../../assets/logo.png';
import { useUser } from '../../hooks/useUser';

 
const PRIMARY = '#21834A';

export default function Register() {
  const colorScheme = useColorScheme() || 'light';
  const theme = color[colorScheme];
  const {register} = useUser();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [province, setProvince] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [confirmWhatsappNumber, setConfirmWhatsappNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function handleRegister() {
    Keyboard.dismiss();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate required fields
    if (
      !username.trim() ||
      !password ||
      !confirmPassword ||
      !age.trim() ||
      !province.trim() ||
      !whatsappNumber.trim() ||
      !confirmWhatsappNumber.trim()
    ) {
      setErrorMessage('Please complete all fields.');
      return;
    }

    if (username.trim().length < 3) {
      setErrorMessage('Username must contain at least 3 characters.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!/^\d+$/.test(age.trim()) || Number(age) < 1) {
      setErrorMessage('Please enter a valid age.');
      return;
    }

    if (whatsappNumber.trim() !== confirmWhatsappNumber.trim()) {
      setErrorMessage('WhatsApp numbers do not match.');
      return;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(whatsappNumber.trim())) {
      setErrorMessage('Please enter a valid WhatsApp number.');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        username: username.trim(),
        password,
        province: province.trim(),
        whatsapp_number: whatsappNumber.trim(),
        age: Number(age),
        role: 'USER',
      });

      setSuccessMessage(
        result?.message || 'Your account was created successfully.'
      );

      // Navigate to login after successful registration.
      // Change the route if your login screen uses a different path.
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1000);
    } catch (error) {
      setErrorMessage(
        error.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        style={[
          styles.scrollView,
          { backgroundColor: theme.background },
        ]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TheamView
          styles={[
            styles.container,
            { backgroundColor: theme.background },
          ]}
        >
          <View style={styles.header}>
            <Image source={LOGO} style={styles.logo} />

            <ThemaText style={styles.title}>
              Create Account
            </ThemaText>

            <ThemaText style={styles.subtitle}>
              Join Seasona Fruit
            </ThemaText>

            <ThemaText style={styles.description}>
              Connect. Share. Reduce waste.
            </ThemaText>
          </View>

          <View style={styles.form}>
            <ThemaText style={styles.sectionTitle}>
              Personal Information
            </ThemaText>

            <ThemaText style={styles.fieldLabel}>
              Username
            </ThemaText>
            <ThemedInput
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <ThemaText style={styles.fieldLabel}>
              Age
            </ThemaText>
            <ThemedInput
              placeholder="Enter your age"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
            />

            <ThemaText style={styles.fieldLabel}>
              Province
            </ThemaText>
            <ThemedInput
              placeholder="e.g. Southern"
              value={province}
              onChangeText={setProvince}
              autoCapitalize="words"
            />

            <ThemaText style={styles.sectionTitle}>
              Account Security
            </ThemaText>

            <ThemaText style={styles.fieldLabel}>
              Password
            </ThemaText>
            <ThemedInput
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <ThemaText style={styles.fieldLabel}>
              Confirm Password
            </ThemaText>
            <ThemedInput
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <ThemaText style={styles.sectionTitle}>
              Contact Information
            </ThemaText>

            <ThemaText style={styles.fieldLabel}>
              WhatsApp Number
            </ThemaText>
            <ThemedInput
              placeholder="e.g. 0771234567"
              value={whatsappNumber}
              onChangeText={setWhatsappNumber}
              keyboardType="phone-pad"
            />

            <ThemaText style={styles.fieldLabel}>
              Confirm WhatsApp Number
            </ThemaText>
            <ThemedInput
              placeholder="Re-enter your WhatsApp number"
              value={confirmWhatsappNumber}
              onChangeText={setConfirmWhatsappNumber}
              keyboardType="phone-pad"
            />

            {!!errorMessage && (
              <View style={styles.messageBox}>
                <ThemaText style={styles.errorText}>
                  {errorMessage}
                </ThemaText>
              </View>
            )}

            {!!successMessage && (
              <View style={styles.messageBox}>
                <ThemaText style={styles.successText}>
                  {successMessage}
                </ThemaText>
              </View>
            )}

            <View style={styles.buttonContainer}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size="small"
                    color={PRIMARY}
                  />
                  <ThemaText style={styles.loadingText}>
                    Creating your account...
                  </ThemaText>
                </View>
              ) : (
                <TheamedButton
                  label="Create Account"
                  onPress={handleRegister}
                />
              )}
            </View>

            <View style={styles.footer}>
              <ThemaText style={styles.footerText}>
                Already have an account?{' '}
              </ThemaText>

              <Link href="/(auth)/login" asChild>
                <ThemaText style={styles.loginLink}>
                  Log in
                </ThemaText>
              </Link>
            </View>
          </View>
        </TheamView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 35,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 95,
    height: 95,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 19,
    fontWeight: '600',
    color: PRIMARY,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.75,
  },
  form: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 5,
  },
  messageBox: {
    marginTop: 14,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F4F4F4',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },
  successText: {
    color: '#21834A',
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 22,
  },
  loadingContainer: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 22,
  },
  footerText: {
    fontSize: 14,
  },
  loginLink: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: '700',
  },
});
