import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const UsersLayout = () => {
    const router = useRouter();
    const pathname = usePathname();

    const tabs = [
        { name: 'All Users', route: '/users/usindex', icon: 'people-outline' },
        { name: 'Create User', route: '/users/create', icon: 'person-add-outline' }
    ];

    const isActive = (route) => {
        return pathname === route || (route === '/users' && pathname === '/users/index');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Users Management</Text>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => router.push('/users/create')}
                >
                    <Ionicons name="person-add-outline" size={18} color="#fff" />
                    <Text style={styles.createButtonText}>Add User</Text>
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {tabs.map((tab, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.tab,
                            isActive(tab.route) && styles.activeTab
                        ]}
                        onPress={() => router.push(tab.route)}
                    >
                        <Ionicons
                            name={tab.icon}
                            size={18}
                            color={isActive(tab.route) ? '#3F836E' : '#BDBDBD'}
                            style={styles.tabIcon}
                        />
                        <Text style={[
                            styles.tabText,
                            isActive(tab.route) && styles.activeTabText
                        ]}>
                            {tab.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7fafc',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3F836E',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: '500',
        marginLeft: 4,
        fontFamily: 'kbold',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginRight: 24,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#3F836E',
    },
    tabIcon: {
        marginRight: 6,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#BDBDBD',
        fontFamily: 'kregular',
    },
    activeTabText: {
        color: '#3F836E',
        fontFamily: 'kbold',
    },
    content: {
        flex: 1,
    },
});

export default UsersLayout;