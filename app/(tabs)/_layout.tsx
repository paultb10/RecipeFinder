import { Tabs } from 'expo-router';
import { Heart, Search } from 'lucide-react-native';

const VIBRANT_COLOR = '#10b981';

export default function TabsLayout() {
    return (
        <Tabs
            initialRouteName="index"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: VIBRANT_COLOR,
                tabBarInactiveTintColor: '#a1a1aa',
                tabBarStyle: {
                    backgroundColor: '#18181b',
                    borderTopWidth: 0,
                    elevation: 0,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color }) => <Heart size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color }) => <Search size={28} color={color} />,
                }}
            />
        </Tabs>
    );
}