import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsLayout = () => {
    const router = useRouter();
    const pathname = usePathname();

    const tabs = [
        { name: 'General', route: '/settings/setindex', icon: 'settings-outline' },
        { name: 'System', route: '/settings/system', icon: 'construct-outline' },
        { name: 'Templates', route: '/settings/templates', icon: 'clipboard-outline' },
        { name: 'Food DB', route: '/settings/food-database', icon: 'restaurant-outline' }
    ];

    const isActive = (route) => {
        if (route === '/settings/setindex' && (pathname === '/settings' || pathname === '/settings/setindex')) {
            return true;
        }
        return pathname === route;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            {/* Tabs - Horizontally Scrollable */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabContainer}
            >
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
                            size={24}
                            color={isActive(tab.route) ? '#3F836E' : '#889096'}
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
            </ScrollView>

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
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 15,
        flex: 1,
        height: 80,
        alignItems: 'flex-start',
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
        paddingHorizontal: 12,
        marginHorizontal: 6,
        width: 50,
        borderRadius: 20,
        backgroundColor: '#f8faf9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        flex: 1
    },
    activeTab: {
        backgroundColor: '#e6fffa',
        borderColor: '#3F836E',
        borderWidth: 1,
    },
    tabIcon: {
        marginBottom: 8,
        fontSize: 24,
    },
    tabText: {
        fontSize: 15,
        color: '#64748b',
        fontFamily: 'kregular',
        textAlign: 'center',
    },
    activeTabText: {
        color: '#3F836E',
        fontFamily: 'kregular',
    },
    content: {
        flex: 1,
    },
});

export default SettingsLayout;