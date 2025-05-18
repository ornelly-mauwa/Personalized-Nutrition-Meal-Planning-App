import React from 'react';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Layout for the Nutritionists section of the admin panel
 */
const NutritionistsLayout = () => {
    return (
        <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Nutritionist Management</Text>
                <Text style={styles.headerDescription}>
                    View, approve, and manage nutritionist profiles
                </Text>
            </View>

            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7fafc',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#ffffff',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    headerDescription: {
        fontSize: 14,
        color: '#718096',
        marginTop: 4,
        fontFamily: 'kregular',
    },
});

export default NutritionistsLayout;