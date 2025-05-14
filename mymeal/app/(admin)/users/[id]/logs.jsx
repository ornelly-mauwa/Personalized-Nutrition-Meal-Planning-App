import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Card } from 'react-native-paper';

// Mock log data - in a real app, you would fetch this from an API
const mockLogs = [
    {
        id: '1',
        action: 'login',
        timestamp: '2025-05-14T08:30:22Z',
        details: 'User logged in from 192.168.1.105',
        ipAddress: '192.168.1.105',
        device: 'iPhone 18 Pro, iOS 19.2',
    },
    {
        id: '2',
        action: 'profile_update',
        timestamp: '2025-05-13T16:45:11Z',
        details: 'User updated profile information',
        ipAddress: '192.168.1.105',
        device: 'Chrome 125.0.0, macOS 16.5',
    },
    {
        id: '3',
        action: 'password_change',
        timestamp: '2025-05-10T11:12:55Z',
        details: 'User changed account password',
        ipAddress: '192.168.1.105',
        device: 'Chrome 125.0.0, macOS 16.5',
    },
    {
        id: '4',
        action: 'login',
        timestamp: '2025-05-09T14:22:37Z',
        details: 'User logged in from 192.168.1.105',
        ipAddress: '192.168.1.105',
        device: 'Firefox 120.0, macOS 16.5',
    },
    {
        id: '5',
        action: 'meal_plan_view',
        timestamp: '2025-05-09T14:25:18Z',
        details: 'User viewed meal plan #MP-2025-0422',
        ipAddress: '192.168.1.105',
        device: 'Firefox 120.0, macOS 16.5',
    },
];

// Sample user data (would be fetched from API)
const mockUserData = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
};

const UserLogs = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [logs, setLogs] = useState([]);
    const [filterActive, setFilterActive] = useState('all');

    // In a real app, you would fetch logs based on the user ID
    useEffect(() => {
        // Simulate API call to fetch user data and logs
        setTimeout(() => {
            setUserData(mockUserData);
            setLogs(mockLogs);
            setIsLoading(false);
        }, 800);
    }, [id]);

    const getActionIcon = (action) => {
        switch (action) {
            case 'login':
                return { name: 'log-in-outline', color: '#4299e1' };
            case 'logout':
                return { name: 'log-out-outline', color: '#a0aec0' };
            case 'profile_update':
                return { name: 'person-outline', color: '#3F836E' };
            case 'password_change':
                return { name: 'key-outline', color: '#ed8936' };
            case 'meal_plan_view':
                return { name: 'restaurant-outline', color: '#9f7aea' };
            default:
                return { name: 'ellipsis-horizontal', color: '#a0aec0' };
        }
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const filterLogs = () => {
        if (filterActive === 'all') {
            return logs;
        }
        return logs.filter(log => log.action === filterActive);
    };

    const renderLogItem = ({ item }) => {
        const icon = getActionIcon(item.action);

        return (
            <Card style={styles.logCard}>
                <View style={styles.logHeader}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={icon.name} size={20} color={icon.color} />
                    </View>
                    <View style={styles.logTitleContainer}>
                        <Text style={styles.logAction}>
                            {item.action.split('_').map(word =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                        </Text>
                        <Text style={styles.logTimestamp}>{formatDate(item.timestamp)}</Text>
                    </View>
                </View>

                <View style={styles.logDetails}>
                    <Text style={styles.logDetailsText}>{item.details}</Text>
                    <View style={styles.metadataContainer}>
                        <View style={styles.metadataItem}>
                            <Ionicons name="globe-outline" size={14} color="#718096" />
                            <Text style={styles.metadataText}>{item.ipAddress}</Text>
                        </View>
                        <View style={styles.metadataItem}>
                            <Ionicons name="hardware-chip-outline" size={14} color="#718096" />
                            <Text style={styles.metadataText}>{item.device}</Text>
                        </View>
                    </View>
                </View>
            </Card>
        );
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#3F836E" />
                <Text style={styles.loadingText}>Loading user logs...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#2d3748" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Activity Logs</Text>
            </View>

            <View style={styles.userInfoCard}>
                <Text style={styles.userName}>{userData.firstName} {userData.lastName}</Text>
                <Text style={styles.userEmail}>{userData.email}</Text>
            </View>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            filterActive === 'all' && styles.filterButtonActive
                        ]}
                        onPress={() => setFilterActive('all')}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            filterActive === 'all' && styles.filterButtonTextActive
                        ]}>All Activity</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            filterActive === 'login' && styles.filterButtonActive
                        ]}
                        onPress={() => setFilterActive('login')}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            filterActive === 'login' && styles.filterButtonTextActive
                        ]}>Logins</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            filterActive === 'profile_update' && styles.filterButtonActive
                        ]}
                        onPress={() => setFilterActive('profile_update')}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            filterActive === 'profile_update' && styles.filterButtonTextActive
                        ]}>Profile Updates</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            filterActive === 'password_change' && styles.filterButtonActive
                        ]}
                        onPress={() => setFilterActive('password_change')}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            filterActive === 'password_change' && styles.filterButtonTextActive
                        ]}>Password Changes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            filterActive === 'meal_plan_view' && styles.filterButtonActive
                        ]}
                        onPress={() => setFilterActive('meal_plan_view')}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            filterActive === 'meal_plan_view' && styles.filterButtonTextActive
                        ]}>Meal Plan Views</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <FlatList
                data={filterLogs()}
                renderItem={renderLogItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.logsList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={48} color="#a0aec0" />
                        <Text style={styles.emptyText}>No activity logs found</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7fafc',
        paddingHorizontal: 15,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#718096',
        marginTop: 12,
        fontFamily: 'kregular',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    userInfoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 4,
        fontFamily: 'kbold',
    },
    userEmail: {
        fontSize: 14,
        color: '#718096',
        fontFamily: 'kregular',
    },
    filterContainer: {
        marginBottom: 16,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#f7fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    filterButtonActive: {
        backgroundColor: '#e6fffa',
        borderColor: '#3F836E',
    },
    filterButtonText: {
        fontSize: 14,
        color: '#718096',
        fontFamily: 'kregular',
    },
    filterButtonTextActive: {
        color: '#3F836E',
        fontWeight: '500',
        fontFamily: 'kbold',
    },
    logsList: {
        paddingBottom: 20,
    },
    logCard: {
        marginBottom: 12,
        borderRadius: 10,
        overflow: 'hidden',
    },
    logHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f2f5',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f7fafc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    logTitleContainer: {
        flex: 1,
    },
    logAction: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    logTimestamp: {
        fontSize: 12,
        color: '#718096',
        marginTop: 2,
        fontFamily: 'kregular',
    },
    logDetails: {
        padding: 12,
    },
    logDetailsText: {
        fontSize: 14,
        color: '#4a5568',
        marginBottom: 8,
        fontFamily: 'kregular',
    },
    metadataContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    metadataItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 4,
    },
    metadataText: {
        fontSize: 12,
        color: '#718096',
        marginLeft: 4,
        fontFamily: 'kregular',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#a0aec0',
        textAlign: 'center',
        fontFamily: 'kregular',
    },
});

export default UserLogs;