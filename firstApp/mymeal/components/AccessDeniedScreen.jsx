import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGlobalContext } from '../context/GlobalContext';
import { useNavigation } from '@react-navigation/native';

// Loading component
const LoadingScreen = () => (
    <View style={styles.centeredContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
    </View>
);

// Access denied component
const AccessDeniedScreen = () => (
    <View style={styles.centeredContainer}>
        <Text style={styles.errorTitle}>Access Denied</Text>
        <Text style={styles.errorMessage}>
            You don't have permission to access this page.
        </Text>
    </View>
);

// For screens that require any authenticated user
export const RequireAuth = ({ children, fallbackRoute = 'Login' }) => {
    const { isLogged, loading } = useGlobalContext();
    const navigation = useNavigation();

    React.useEffect(() => {
        if (!loading && !isLogged) {
            navigation.navigate(fallbackRoute);
        }
    }, [loading, isLogged, navigation, fallbackRoute]);

    if (loading) {
        return <LoadingScreen />;
    }

    if (!isLogged) {
        return null; // Will redirect via useEffect
    }

    return children;
};

// For screens that require specific roles
export const RequireRole = ({
    children,
    allowedRoles,
    fallbackRoute = 'Home',
    fallbackComponent = <AccessDeniedScreen />
}) => {
    const { isLogged, loading, hasRole } = useGlobalContext();
    const navigation = useNavigation();

    // Check if user has any of the allowed roles
    const hasAccess = allowedRoles.some(role => hasRole(role));

    React.useEffect(() => {
        // If not logged in, redirect to login
        if (!loading && !isLogged) {
            navigation.navigate('Login');
            return;
        }

        // If logged in but without proper role, redirect to fallback
        if (!loading && isLogged && !hasAccess && fallbackRoute) {
            navigation.navigate(fallbackRoute);
        }
    }, [loading, isLogged, hasAccess, navigation, fallbackRoute]);

    if (loading) {
        return <LoadingScreen />;
    }

    if (!isLogged) {
        return null; // Will redirect via useEffect
    }

    if (!hasAccess) {
        return fallbackComponent; // Show access denied or will redirect via useEffect
    }

    return children;
};