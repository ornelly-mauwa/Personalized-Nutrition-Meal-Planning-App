import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Card } from 'react-native-paper';

// Mock user data - in a real app, you would fetch this from an API
const mockUserData = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'user',
    isActive: true,
    joinedDate: '2023-10-15',
    lastLogin: '2024-05-10',
    avatar: null, // Would be an image URL in real app
    address: {
        street: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA'
    },
    stats: {
        mealPlansCreated: 12,
        nutritionGoals: 5,
        activeDays: 45
    }
};

const UserDetails = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    // In a real app, you would fetch the user data based on the ID
    // For now, we're using the mock data
    const [userData, setUserData] = useState(mockUserData);

    // Function to get the formatted date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to get user role display name
    const getRoleDisplayName = (role) => {
        const roles = {
            'user': 'Regular User',
            'nutritionist': 'Nutritionist',
            'admin': 'Administrator'
        };
        return roles[role] || role;
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#2d3748" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Details</Text>

                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => router.push(`/users/${id}/edit`)}
                    >
                        <Ionicons name="create-outline" size={18} color="#3F836E" />
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* User Profile Card */}
            <Card style={styles.profileCard}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        {userData.avatar ? (
                            <Image
                                source={{ uri: userData.avatar }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                                </Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>
                            {userData.firstName} {userData.lastName}
                        </Text>
                        <Text style={styles.userRole}>
                            {getRoleDisplayName(userData.role)}
                        </Text>
                        <View style={styles.statusBadge}>
                            <View style={[
                                styles.statusDot,
                                { backgroundColor: userData.isActive ? '#48bb78' : '#e53e3e' }
                            ]} />
                            <Text style={styles.statusText}>
                                {userData.isActive ? 'Active' : 'Inactive'}
                            </Text>
                        </View>
                    </View>
                </View>
            </Card>

            {/* User Information Card */}
            <Card style={styles.infoCard}>
                <Card.Content>
                    <Text style={styles.sectionTitle}>Contact Information</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="mail-outline" size={18} color="#3F836E" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{userData.email}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="call-outline" size={18} color="#3F836E" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Phone</Text>
                            <Text style={styles.infoValue}>{userData.phone || 'Not provided'}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="home-outline" size={18} color="#3F836E" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Address</Text>
                            <Text style={styles.infoValue}>
                                {userData.address ? (
                                    `${userData.address.street}, ${userData.address.city}, ${userData.address.state} ${userData.address.zipCode}, ${userData.address.country}`
                                ) : (
                                    'Not provided'
                                )}
                            </Text>
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Account Information</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="calendar-outline" size={18} color="#3F836E" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Joined Date</Text>
                            <Text style={styles.infoValue}>{formatDate(userData.joinedDate)}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="time-outline" size={18} color="#3F836E" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Last Login</Text>
                            <Text style={styles.infoValue}>{formatDate(userData.lastLogin)}</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>

            {/* User Stats Card */}
            <Card style={styles.statsCard}>
                <Card.Content>
                    <Text style={styles.sectionTitle}>User Activity</Text>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{userData.stats.mealPlansCreated}</Text>
                            <Text style={styles.statLabel}>Meal Plans</Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{userData.stats.nutritionGoals}</Text>
                            <Text style={styles.statLabel}>Goals Set</Text>
                        </View>

                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{userData.stats.activeDays}</Text>
                            <Text style={styles.statLabel}>Active Days</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push(`/users/${id}/logs`)}
                >
                    <Ionicons name="list-outline" size={18} color="#3F836E" />
                    <Text style={styles.actionButtonText}>View Activity Logs</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.dangerButton]}
                    onPress={() => {
                        // In a real app, show confirmation dialog before deactivating
                        alert('This would deactivate the user account');
                    }}
                >
                    <Ionicons name="close-circle-outline" size={18} color="#e53e3e" />
                    <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
                        Deactivate Account
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7fafc',
        paddingHorizontal: 15,
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
        flex: 1,
        fontFamily: 'kbold',
    },
    headerActions: {
        flexDirection: 'row',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#e6fffa',
        borderRadius: 6,
    },
    editButtonText: {
        marginLeft: 4,
        color: '#3F836E',
        fontWeight: '600',
        fontSize: 14,
        fontFamily: 'kbold',
    },
    profileCard: {
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 2,
        marginBottom: 16,
        overflow: 'hidden',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    avatarPlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#3F836E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
        fontFamily: 'kbold',
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    userRole: {
        fontSize: 14,
        color: '#718096',
        marginTop: 2,
        fontFamily: 'kregular',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f7fafc',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        color: '#4a5568',
        fontWeight: '500',
        fontFamily: 'kbold',
    },
    infoCard: {
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 2,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 12,
        fontFamily: 'kbold',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    infoIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#e6fffa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
        justifyContent: 'center',
    },
    infoLabel: {
        fontSize: 12,
        color: '#718096',
        fontFamily: 'kregular',
    },
    infoValue: {
        fontSize: 14,
        color: '#2d3748',
        marginTop: 2,
        fontFamily: 'kregular',
    },
    statsCard: {
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 2,
        marginBottom: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
        paddingVertical: 12,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '700',
        color: '#3F836E',
        fontFamily: 'kbold',
    },
    statLabel: {
        fontSize: 12,
        color: '#718096',
        marginTop: 4,
        fontFamily: 'kregular',
    },
    actionButtons: {
        marginVertical: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        backgroundColor: '#e6fffa',
        borderRadius: 8,
        marginBottom: 12,
    },
    actionButtonText: {
        marginLeft: 8,
        color: '#3F836E',
        fontWeight: '600',
        fontSize: 14,
        fontFamily: 'kbold',
    },
    dangerButton: {
        backgroundColor: '#fff5f5',
    },
    dangerButtonText: {
        color: '#e53e3e',
    },
});

export default UserDetails;