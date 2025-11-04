import { Text, View, Pressable, Image, StyleSheet } from 'react-native';
import { Heart, Clock } from 'lucide-react-native';
import { Recipe } from '../types';
import { useFavoritesStore } from '../lib/useFavorites';
import * as Haptics from 'expo-haptics';

type RecipeCardProps = {
    recipe: Recipe;
    onPress: () => void;
};

export const RecipeCard = ({ recipe, onPress }: RecipeCardProps) => {
    const { addFavorite, removeFavorite } = useFavoritesStore();

    const favorite = useFavoritesStore((state) =>
        state.favorites.some((fav) => fav.id === recipe.id)
    );

    const handleToggleFavorite = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (favorite) removeFavorite(recipe.id);
        else addFavorite(recipe);
    };

    const handleCardPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    return (
        <Pressable
            onPress={handleCardPress}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
        >
            <Image
                source={{
                    uri:
                        typeof recipe.imageUrl === 'string' && recipe.imageUrl.startsWith('http')
                            ? recipe.imageUrl
                            : 'https://via.placeholder.com/150/3f3f46/a1a1aa?text=Photo',
                }}
                style={styles.image}
            />

            <View style={styles.content}>
                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={1}>
                        {recipe.title}
                    </Text>
                    <View style={styles.row}>
                        <Clock size={14} color="#a1a1aa" />
                        <Text style={styles.prepTime}>{recipe.prepTime}</Text>
                    </View>
                </View>

                <Pressable onPress={handleToggleFavorite} style={styles.favoriteButton}>
                    <Heart size={22} color={favorite ? '#ef4444' : '#a1a1aa'} fill={favorite ? '#ef4444' : 'none'} />
                </Pressable>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#27272a',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    cardPressed: {
        backgroundColor: '#3f3f46',
    },
    image: {
        width: 96,
        height: 96,
        resizeMode: 'cover',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    info: {
        flex: 1,
        paddingRight: 8,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    prepTime: {
        color: '#a1a1aa',
        fontSize: 12,
        marginLeft: 6,
    },
    favoriteButton: {
        padding: 12,
        margin: -12,
    },
});