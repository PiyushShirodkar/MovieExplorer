
import { useEffect, useState } from 'react';
import { Stack, useRouter, usePathname } from 'expo-router';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;

    if (user && (pathname === '/' || pathname === '/register')) {
      router.replace('/home');
    } else if (!user && pathname === '/home') {
      router.replace('/');
    }
  }, [user, loading, pathname, router]);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
