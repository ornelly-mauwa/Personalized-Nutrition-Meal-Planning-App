import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const LoadingScreen = ({ message = "Loading..." }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    text: {
        marginTop: 16,
        fontSize: 16,
        color: '#333',
    }
});

export default LoadingScreen;