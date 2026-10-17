
import {
  StyleSheet,
  View,
  useColorScheme,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';

import TheamView from '../../components/TheamView';
import ThemedInput from '../../components/ThemedInput';
import ThemaText from '../../components/ThemaText';
import TheamedButton from '../../components/TheamedButton';

import { color } from '../../styles/colors';
import LOGO from '../../assets/logo.png';

const Register = () => {
  const colorTheme = useColorScheme() ?? 'light';
  const theme = color[colorTheme];

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
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
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={LOGO}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <ThemaText
              style={[styles.appName, { color: theme.primary }]}
            >
              Seasona Fruit
            </ThemaText>

            <ThemaText style={styles.subtitle}>
              Connect. Share. Reduce waste.
            </ThemaText>
          </View>

          {/* Registration form */}
          <View
            style={[
              styles.form,
              {
                backgroundColor: theme.card,
                borderColor: theme.inputbox,
              },
            ]}
          >
            <View style={styles.formHeading}>
              <ThemaText
                style={[styles.title, { color: theme.text }]}
              >
                Create Account
              </ThemaText>

              <ThemaText style={styles.description}>
                Join our community and make every harvest count.
              </ThemaText>
            </View>

            {/* Account details */}
            <View style={styles.section}>
              <ThemaText
                style={[styles.sectionTitle, { color: theme.primary }]}
              >
                Account Details
              </ThemaText>

              <ThemedInput
                label="Username"
                placeholder="Enter your username"
                autoCapitalize="none"
              />

              <ThemedInput
                label="Password"
                placeholder="Create a password"
                secureTextEntry
              />

              <ThemedInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                secureTextEntry
              />
            </View>

            {/* Personal details */}
            <View style={styles.section}>
              <ThemaText
                style={[styles.sectionTitle, { color: theme.primary }]}
              >
                Personal Details
              </ThemaText>

              <ThemedInput
                label="Age"
                placeholder="Enter your age"
                keyboardType="number-pad"
              />

              <ThemedInput
                label="Province"
                placeholder="Enter your province"
                autoCapitalize="words"
              />

              <ThemedInput
                label="WhatsApp Number"
                placeholder="Enter your WhatsApp number"
                keyboardType="phone-pad"
              />

              <ThemedInput
                label="Confirm WhatsApp Number"
                placeholder="Re-enter your WhatsApp number"
                keyboardType="phone-pad"
              />
            </View>

            {/* Register button */}
            <View style={styles.buttonContainer}>
              <TheamedButton label="Create Account" />
            </View>

            <View style={styles.footer}>
              <ThemaText style={styles.footerText}>
                Fresh produce, smarter distribution.
              </ThemaText>
            </View>
          </View>

          <ThemaText style={styles.bottomText}>
            Growing a greener future together.
          </ThemaText>
        </View>
      </TheamView>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 35,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },

  content: {
    width: '100%',
    maxWidth: 430,
  },

  header: {
    alignItems: 'center',
    marginBottom: 27,
  },

  logoContainer: {
    width: 92,
    height: 92,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#21834A',
    overflow: 'hidden',
  },

  logo: {
    width: '88%',
    height: '88%',
  },

  appName: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize: 13,
    marginTop: 7,
    opacity: 0.75,
    textAlign: 'center',
  },

  form: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 22,
    borderRadius: 24,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#183D27',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },

  formHeading: {
    alignItems: 'center',
    marginBottom: 8,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 9,
    opacity: 0.7,
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 5,
  },

  buttonContainer: {
    marginTop: 25,
  },

  footer: {
    marginTop: 23,
    paddingTop: 17,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D6E3D7',
    alignItems: 'center',
  },

  footerText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },

  bottomText: {
    fontSize: 12,
    opacity: 0.65,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
});
