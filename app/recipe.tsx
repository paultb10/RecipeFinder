import { useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { Recipe } from '../types';
import { Pressable } from 'react-native';
import { Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useFavoritesStore } from '../lib/useFavorites';


export default function RecipeModalScreen() {
  const { recipe: recipeString } = useLocalSearchParams();

  if (!recipeString || typeof recipeString !== 'string') {
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Recipe not found</Text>
          <ActivityIndicator color="#fff" />
        </View>
    );
  }

  const recipe: Recipe = JSON.parse(recipeString);

  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(recipe.id);

  const handleToggleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (favorite) removeFavorite(recipe.id);
    else addFavorite(recipe);
  };

  return (
      <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.contentContainer}
      >

        {/* --- AICI ESTE MODIFICAREA --- */}
        {/* Verificăm dacă 'imageUrl' există înainte de a-l afișa */}
        {recipe.imageUrl && (
            <Image
                source={{ uri: recipe.imageUrl }}
                style={styles.image}
            />
        )}
        {/* ----------------------------- */}

        <View style={styles.headerRow}>
          <Text style={styles.title}>{recipe.title}</Text>
          <Pressable onPress={handleToggleFavorite} style={styles.favoriteButton}>
            <Heart size={26} color={favorite ? '#ef4444' : '#a1a1aa'} fill={favorite ? '#ef4444' : 'none'} />
          </Pressable>
        </View>

        <Text style={styles.subtitle}>Ingredients</Text>
        {recipe.ingredients.map((item, index) => (
            <Text key={`ing-${index}`} style={styles.listItem}>
              • {item}
            </Text>
        ))}

        <Text style={styles.subtitle}>Instructions</Text>
        {recipe.instructions.map((item, index) => (
            <Text key={`inst-${index}`} style={styles.listItem}>
              {index + 1}. {item}
            </Text>
        ))}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#18181b',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#18181b',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: '#3f3f46',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    marginRight: 16,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3f3f46',
    paddingBottom: 5,
  },
  listItem: {
    fontSize: 16,
    color: '#d4d4d8',
    marginBottom: 10,
    lineHeight: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  favoriteButton: {
    padding: 8,
  },
});