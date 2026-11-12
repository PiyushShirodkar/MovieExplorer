
import { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  Avatar,
  Card,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const userEmail = auth.currentUser?.email || 'No email available';
  const initial = userEmail.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      setLoading(true);

      await signOut(auth);

      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Failed', 'Please try again.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Profile</Text>

      <Card style={styles.card}>
        <View style={styles.profileSection}>
          <Avatar.Text
            size={90}
            label={initial}
            style={styles.avatar}
            color="#FFFFFF"
          />

          <Text style={styles.name}>Movie Explorer User</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.infoSection}>
          <Text style={styles.label}>Account Information</Text>

          <Text style={styles.infoTitle}>Email Address</Text>
          <Text style={styles.infoValue}>{userEmail}</Text>

          <Text style={styles.infoTitle}>Account Status</Text>
          <Text style={styles.status}>Active</Text>
        </View>
      </Card>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.logoutText}>Logout</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footer}>MOVIE EXPLORER</Text>
      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 25,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: '#E50914',
    marginBottom: 15,
  },
  name: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  divider: {
    backgroundColor: '#444444',
    marginVertical: 15,
  },
  infoSection: {
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
  },
  status: {
    color: '#4CAF50',
    fontSize: 16,
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: '#E50914',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  footer: {
    color: '#E50914',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  version: {
    color: '#777777',
    textAlign: 'center',
    marginTop: 5,
  },
});
