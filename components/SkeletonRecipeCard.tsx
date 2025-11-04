import React from 'react';
import { View, StyleSheet } from 'react-native';

export function SkeletonRecipeCard() {
    return (
        <View style={styles.card}>
            <View style={styles.imagePlaceholder} />
            <View style={styles.content}>
                <View style={styles.titlePlaceholder} />
                <View style={styles.descriptionPlaceholder} />
                <View style={styles.descriptionPlaceholder} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#27272a',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    imagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#3f3f46',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    titlePlaceholder: {
        height: 18,
        width: '70%',
        backgroundColor: '#3f3f46',
        borderRadius: 4,
        marginBottom: 8,
    },
    descriptionPlaceholder: {
        height: 14,
        width: '90%',
        backgroundColor: '#3f3f46',
        borderRadius: 4,
        marginBottom: 4,
    },
});