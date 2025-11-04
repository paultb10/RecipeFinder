import { create } from 'zustand';
import { Recipe } from '../types';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

interface FavoritesState {
    favorites: Recipe[];
    addFavorite: (recipe: Recipe) => void;
    removeFavorite: (recipeId: string) => void;
    isFavorite: (recipeId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],
            addFavorite: (recipe) => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                set((state) => ({ favorites: [...state.favorites, recipe] }));
            },
            removeFavorite: (recipeId) => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                set((state) => ({
                    favorites: state.favorites.filter((r) => r.id !== recipeId),
                }));
            },
            isFavorite: (recipeId) =>
                get().favorites.some((r) => r.id === recipeId),
        }),
        {
            name: 'favorites-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);