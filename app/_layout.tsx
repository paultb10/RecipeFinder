import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#18181b' } }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                    name="recipe"
                    options={{ presentation: 'modal' }}
                />
            </Stack>
        </>
    );
}