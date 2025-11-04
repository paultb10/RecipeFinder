import React from 'react';
import { Text, Pressable, StyleSheet, PressableProps } from 'react-native';

interface SuggestionChipProps extends PressableProps {
    text: string;
}

export function SuggestionChip({ text, ...rest }: SuggestionChipProps) {
    return (
        <Pressable
            {...rest}
            style={({ pressed }) => [
                styles.suggestionButton,
                pressed && styles.suggestionButtonPressed
            ]}
        >
            <Text style={styles.suggestionButtonText}>{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    suggestionButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#3f3f46',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 9999,
    },
    suggestionButtonPressed: {
        backgroundColor: '#27272a',
    },
    suggestionButtonText: {
        color: '#d4d4d8',
        fontWeight: '500',
    },
});