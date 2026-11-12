
import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Avatar,
} from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      router.replace('/home');
    } catch (err: any) {
      setError('Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Avatar.Icon
            size={85}
            icon="movie-open"
            color="#FFFFFF"
            style={styles.logo}
          />

          <Text style={styles.brand}>MOVIE EXPLORER</Text>

          <Text style={styles.heading}>Welcome Back</Text>

          <Text style={styles.subtitle}>
            Your next favourite movie awaits.
          </Text>

          <Text style={styles.label}>EMAIL ADDRESS</Text>

          <TextInput
            mode="outlined"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon icon="email-outline" />}
            style={styles.input}
            outlineColor="#444444"
            activeOutlineColor="#E50914"
            textColor="#FFFFFF"
            placeholderTextColor="#888888"
          />

          <Text style={styles.label}>PASSWORD</Text>

          <TextInput
            mode="outlined"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
            outlineColor="#444444"
            activeOutlineColor="#E50914"
            textColor="#FFFFFF"
            placeholderTextColor="#888888"
          />

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
            buttonColor="#E50914"
            textColor="#FFFFFF"
            labelStyle={styles.buttonLabel}
          >
            LOGIN
          </Button>

          <View style={styles.registerRow}>
            <Text style={styles.footerText}>
              Don't have an account?
            </Text>

            <Text
              style={styles.registerLink}
              onPress={() => router.push('/register')}
            >
              {' '}Register
            </Text>
          </View>
        </View>

        <Text style={styles.bottomText}>
          DISCOVER. WATCH. ENJOY.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090909',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 430,
    backgroundColor: '#171717',
    borderRadius: 22,
    padding: 28,
    borderWidth: 1,
    borderColor: '#303030',
  },
  logo: {
    alignSelf: 'center',
    backgroundColor: '#E50914',
    marginBottom: 15,
  },
  brand: {
    color: '#E50914',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: 22,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#999999',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 9,
    marginBottom: 30,
  },
  label: {
    color: '#CCCCCC',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 9,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#222222',
    fontSize: 14,
  },
  error: {
    color: '#FF6B6B',
    marginTop: 12,
    fontSize: 13,
  },
  button: {
    borderRadius: 9,
    marginTop: 25,
  },
  buttonContent: {
    height: 52,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    flexWrap: 'wrap',
  },
  footerText: {
    color: '#999999',
    fontSize: 13,
  },
  registerLink: {
    color: '#E50914',
    fontSize: 13,
    fontWeight: 'bold',
  },
  bottomText: {
    color: '#666666',
    fontSize: 10,
    letterSpacing: 3,
    marginTop: 25,
  },
});
