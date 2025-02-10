import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { MachineryProvider } from '../context/MachineryContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <MachineryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="booking/[id]" />
          <Stack.Screen name="chat/[id]" />
        </Stack>
      </MachineryProvider>
    </AuthProvider>
  );
}