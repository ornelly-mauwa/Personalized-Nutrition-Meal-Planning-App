import React from 'react';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="personal-info" />
            <Stack.Screen name="fitness-goals" />
            <Stack.Screen name="dietary-prefs" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="help" />
            <Stack.Screen name="about" />
            <Stack.Screen name="privacy" />
        </Stack>
    );
}