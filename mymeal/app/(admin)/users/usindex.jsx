import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Sample user data
const USERS_DATA = [
    {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        role: 'User',
        status: 'Active',
        avatar: null,
        lastLogin: '2 hours ago',
        createdAt: '2023-05-15',
    },
    {
        id: '2',
        name: 'Sarah Williams',
        email: 'sarah.williams@example.com',
        role: 'Premium User',
        status: 'Active',
        avatar: null,
        lastLogin: '1 day ago',
        createdAt: '2023-04-22',
    },
    {
        id: '3',
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        role: 'User',
        status: 'Inactive',
        avatar: null,
        lastLogin: '1 month ago',
        createdAt: '2023-01-10',
    },
    {
        id: '4',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        role: 'Premium User',
        status: 'Active',
        avatar: null,
        lastLogin: '5 hours ago',
        createdAt: '2023-06-02',
    },
    {
        id: '5',
        name: 'Robert Wilson',
        email: 'robert.wilson@example.com',
        role: 'User',
        status: 'Suspended',
        avatar: null,
        lastLogin: '2 weeks ago',
        createdAt: '2022-11-15',
    },
];

const UsersIndex = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Filter users based on search query and status
    const filteredUsers = USERS_DATA.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            filterStatus === 'All' ||
            user.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const renderUserItem = ({ item }) => {
        return (
            <Card style={styles.userCard} onPress={() => router.push(`/users/${item.id}`)}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        {item.avatar ? (
                            <Image source={{ uri: item.avatar }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.userEmail}>{item.email}</Text>
                        <View style={styles.userMetaInfo}>
                            <Text style={styles.userRole}>{item.role}</Text>
                            <View style={[
                                styles.statusBadge,
                                item.status === 'Active' ? styles.activeBadge :
                                    item.status === 'Inactive' ? styles.inactiveBadge : styles.suspendedBadge
                            ]}>
                                <Text style={styles.statusText}>{item.status}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => router.push(`/users/${item.id}/edit`)}
                        >
                            <Ionicons name="create-outline" size={22} color="#3F836E" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => router.push(`/users/${item.id}/logs`)}
                        >
                            <Ionicons name="list-outline" size={22} color="#718096" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.userFooter}>
                    <Text style={styles.userFooterText}>
                        <Ionicons name="time-outline" size={14} color="#a0aec0" /> Last login: {item.lastLogin}
                    </Text>
                    <Text style={styles.userFooterText}>
                        <Ionicons name="calendar-outline" size={14} color="#a0aec0" /> Created: {item.createdAt}
                    </Text>
                </View>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            {/* Search and Filter Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search-outline" size={20} color="#a0aec0" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search users..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery !== '' && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle-outline" size={20} color="#a0aec0" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.filterContainer}>
                    {['All', 'Active', 'Inactive', 'Suspended'].map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.filterButton,
                                filterStatus === status && styles.activeFilterButton
                            ]}
                            onPress={() => setFilterStatus(status)}
                        >
                            <Text style={[
                                styles.filterButtonText,
                                filterStatus === status && styles.activeFilterButtonText
                            ]}>
                                {status}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* User List */}
            <FlatList
                data={filteredUsers}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search" size={48} color="#a0aec0" />
                        <Text style={styles.emptyText}>No users found</Text>
                        <Text style={styles.emptySubText}>Try adjusting your search or filters</Text>
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
        padding: 16,
    },
    searchContainer: {
        marginBottom: 16,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 12,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 44,
        fontSize: 16,
        fontFamily: 'kregular',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    activeFilterButton: {
        backgroundColor: '#3F836E',
    },
    filterButtonText: {
        fontSize: 14,
        color: '#718096',
        fontFamily: 'kregular',
    },
    activeFilterButtonText: {
        color: 'white',
        fontWeight: '500',
        fontFamily: 'kbold',
    },
    listContainer: {
        paddingBottom: 20,
    },
    userCard: {
        borderRadius: 12,
        marginBottom: 12,
        padding: 16,
        backgroundColor: 'white',
        elevation: 2,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3F836E20',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#3F836E',
        fontFamily: 'kbold',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    userEmail: {
        fontSize: 14,
        color: '#718096',
        marginBottom: 4,
        fontFamily: 'kregular',
    },
    userMetaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userRole: {
        fontSize: 13,
        color: '#4a5568',
        marginRight: 8,
        fontFamily: 'kregular',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    activeBadge: {
        backgroundColor: '#C6F6D5',
    },
    inactiveBadge: {
        backgroundColor: '#EDF2F7',
    },
    suspendedBadge: {
        backgroundColor: '#FED7D7',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'kbold',
        color: '#2D3748',
    },
    actionButtons: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 6,
        marginLeft: 8,
    },
    userFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    userFooterText: {
        fontSize: 12,
        color: '#a0aec0',
        fontFamily: 'kregular',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#718096',
        marginTop: 12,
        fontFamily: 'kbold',
    },
    emptySubText: {
        fontSize: 14,
        color: '#a0aec0',
        marginTop: 4,
        fontFamily: 'kregular',
    },
});

export default UsersIndex;