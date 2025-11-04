import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavoritesStore } from '../../lib/useFavorites';
import { Recipe } from '../../types';
import { router } from 'expo-router';
import { RecipeCard } from "../../components/RecipeCard";
import { Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const VIBRANT_COLOR = '#10b981';

export default function FavoritesScreen() {
    const { favorites } = useFavoritesStore();

    const handlePress = (recipe: Recipe) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({
            pathname: '/recipe',
            params: { recipe: JSON.stringify(recipe) },
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Favorites</Text>

                {favorites.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Heart size={48} color={VIBRANT_COLOR} strokeWidth={1.5} />
                        <Text style={styles.emptyText1}>
                            Your favorite recipes will appear here.
                        </Text>
                        <Text style={styles.emptyText2}>
                            Tap the heart icon on any recipe to add it to your favorites.
                        </Text>
                    </View>
                ) : (
                    favorites.map((recipe, index) => (
                        <RecipeCard
                            key={`${recipe.id}-${index}`}
                            recipe={recipe}
                            onPress={() => handlePress(recipe)}
                        />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#18181b',
    },
    scrollView: {
        padding: 16,
        paddingBottom: 32,
    },
    title: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },
    emptyText1: {
        color: '#71717a',
        textAlign: 'center',
        marginTop: 16,
        fontSize: 16,
    },
    emptyText2: {
        color: '#52525b',
        textAlign: 'center',
        marginTop: 4,
        fontSize: 14,
    },
});
