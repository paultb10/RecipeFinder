import { useState, useEffect, useRef } from 'react';
import {
    Text,
    View,
    TextInput,
    Pressable,
    ActivityIndicator,
    StyleSheet,
    FlatList,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, SearchX, AlertTriangle } from 'lucide-react-native';
import { fetchRecipesFromAI } from '../../lib/groq';
import { Recipe } from '../../types';
import { router } from 'expo-router';
import { RecipeCard } from "../../components/RecipeCard";
import { SkeletonRecipeCard } from '../../components/SkeletonRecipeCard';
import { SuggestionChip } from '../../components/SuggestionChip';
import * as Haptics from 'expo-haptics';
import { useFavoritesStore } from '../../lib/useFavorites';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const VIBRANT_COLOR = '#10b981';

const quickSuggestions = ['Pasta', 'Chicken', 'Soup', 'Dessert', 'Vegetarian', 'Quick 30 min'];


export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debounceTimeoutRef = useRef<number | null>(null);

    const { favorites } = useFavoritesStore();

    useEffect(() => {}, [favorites]);

    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        if (query && isInputFocused) {
            debounceTimeoutRef.current = setTimeout(() => {
                handleSearch(query, true);
            }, 700);
        } else if (!query && hasSearched) {
            setRecipes([]);
            setHasSearched(false);
            setError(null);
        } else if (!query && !isInputFocused) {
            setRecipes([]);
            setHasSearched(false);
            setError(null);
        }


        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [query]);

    const handleSearch = async (searchQuery: string = query, isDebounced: boolean = false) => {
        if (!searchQuery) return;

        if (!isDebounced) {
            setLoading(true);
        }
        setRecipes([]);
        setHasSearched(true);
        setError(null);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        try {
            const results = await fetchRecipesFromAI(searchQuery);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setRecipes(results);
        } catch (e) {
            console.error("Failed to fetch recipes:", e);
            setError("Oops! Couldn't load recipes. Check your connection or try again.");
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionPress = (suggestion: string) => {
        setQuery(suggestion);
        handleSearch(suggestion);
    };

    const handleClearSearch = () => {
        setQuery('');
        setRecipes([]);
        setHasSearched(false);
        setError(null);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePress = (recipe: Recipe) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({
            pathname: '/recipe',
            params: { recipe: JSON.stringify(recipe) },
        });
    };

    const renderEmptyOrLoadingState = () => {
        if (loading) {
            return (
                <View>
                    {Array.from({ length: 3 }).map((_, i) => <SkeletonRecipeCard key={i} />)}
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.emptyContainer}>
                    <AlertTriangle size={48} color="#ef4444" strokeWidth={1.5} />
                    <Text style={styles.emptyText1}>
                        {error}
                    </Text>
                    <Pressable
                        onPress={() => handleSearch(query)}
                        style={({ pressed }) => [
                            styles.searchAgainButton,
                            { backgroundColor: '#ef4444' },
                            pressed && { backgroundColor: '#dc2626' }
                        ]}
                    >
                        <Text style={styles.searchAgainButtonText}>Try Again</Text>
                    </Pressable>
                </View>
            );
        }

        if (!loading && recipes.length === 0 && hasSearched) {
            return (
                <View style={styles.emptyContainer}>
                    <SearchX size={48} color={VIBRANT_COLOR} strokeWidth={1.5} />
                    <Text style={styles.emptyText1}>
                        No recipes found for "{query}".
                    </Text>
                    <Text style={styles.emptyText2}>
                        Try searching for something else.
                    </Text>
                </View>
            );
        }

        if (!loading && recipes.length === 0 && !hasSearched && !query) {
            return (
                <View style={styles.initialContentContainer}>
                    <Text style={styles.resultsTitle}>Discover delicious recipes!</Text>
                    <Text style={styles.emptyText2}>Start by typing or choosing a suggestion below.</Text>
                    <View style={styles.suggestionsContainer}>
                        <Text style={styles.suggestionsTitle}>Popular searches</Text>
                        <View style={styles.suggestionsWrapper}>
                            {quickSuggestions.map((item) => (
                                <SuggestionChip
                                    key={item}
                                    text={item}
                                    onPress={() => handleSuggestionPress(item)}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            );
        }
        return null;
    };

    const renderRecipeItem = ({ item }: { item: Recipe }) => {
        const favoriteVersion = favorites.find(fav => fav.title === item.title);

        const recipeToRender = favoriteVersion ? favoriteVersion : item;

        return (
            <RecipeCard
                recipe={recipeToRender}
                onPress={() => handlePress(recipeToRender)}
            />
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <View style={[styles.searchInputContainer, isInputFocused && styles.searchInputFocused]}>
                    <Search size={20} color={isInputFocused ? VIBRANT_COLOR : '#a1a1aa'} />
                    <TextInput
                        placeholder="What do you feel like eating?"
                        placeholderTextColor="#a1a1aa"
                        style={styles.textInput}
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={() => handleSearch()}
                        returnKeyType="search"
                        autoCapitalize="none"
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => {
                            setIsInputFocused(false);
                            if (!query && hasSearched && !loading && recipes.length === 0) {
                                setHasSearched(false);
                                setError(null);
                            }
                        }}
                    />
                    {query.length > 0 && (
                        <Pressable onPress={handleClearSearch} style={styles.clearButton}>
                            <X size={20} color="#a1a1aa" />
                        </Pressable>
                    )}
                </View>
            </View>

            <FlatList
                data={recipes}
                keyExtractor={(item) => item.id}
                renderItem={renderRecipeItem}
                contentContainerStyle={styles.flatListContentContainer}
                ListHeaderComponent={
                    recipes.length > 0 ? (
                        <Text style={styles.resultsTitle}>
                            Suggested recipes
                        </Text>
                    ) : null
                }
                ListEmptyComponent={renderEmptyOrLoadingState()}
                ListFooterComponent={
                    !loading && recipes.length > 0 ? (
                        <Pressable
                            onPress={() => handleSearch()}
                            style={({ pressed }) => [
                                styles.searchAgainButton,
                                pressed && styles.searchAgainButtonPressed
                            ]}
                            disabled={loading}
                        >
                            <Text style={styles.searchAgainButtonText}>
                                {"I don't like these, show others"}
                            </Text>
                        </Pressable>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#18181b',
    },
    headerContainer: {
        padding: 16,
        paddingBottom: 0,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#27272a',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: 'transparent',
        transitionProperty: 'border-color',
        transitionDuration: '200ms',
    },
    searchInputFocused: {
        borderColor: VIBRANT_COLOR,
    },
    textInput: {
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
        marginHorizontal: 12,
    },
    clearButton: {
        padding: 4,
    },
    suggestionsContainer: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    suggestionsTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    suggestionsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    flatListContentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    loadingIndicator: {
        marginVertical: 40,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
        opacity: 0.8,
        paddingHorizontal: 20,
    },
    initialContentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    emptyText1: {
        color: '#a1a1aa',
        textAlign: 'center',
        marginTop: 16,
        fontSize: 16,
    },
    emptyText2: {
        color: '#71717a',
        textAlign: 'center',
        marginTop: 4,
        fontSize: 14,
    },
    resultsTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 16,
    },
    searchAgainButton: {
        backgroundColor: '#059669',
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 16,
    },
    searchAgainButtonPressed: {
        backgroundColor: '#047857',
    },
    searchAgainButtonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16,
    },
    featuredSection: {
        marginTop: 40,
    }
});