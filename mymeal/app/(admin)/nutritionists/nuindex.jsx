import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card, Badge } from 'react-native-paper';

// Mock nutritionist data - in a real app, you would fetch this from an API
const mockNutritionists = [
    {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        status: 'active',
        specialties: ['Weight Management', 'Sports Nutrition'],
        clientCount: 24,
        rating: 4.8,
        joinDate: '2024-03-15'
    },
    {
        id: '2',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@example.com',
        status: 'active',
        specialties: ['Diabetes Management', 'Heart Health'],
        clientCount: 18,
        rating: 4.6,
        joinDate: '2024-05-02'
    },
    {
        id: '3',
        firstName: 'Amanda',
        lastName: 'Rodriguez',
        email: 'amanda.rodriguez@example.com',
        status: 'pending',
        specialties: ['Plant-based Nutrition', 'Digestive Health'],
        clientCount: 0,
        rating: 0,
        joinDate: '2025-05-10'
    },
    {
        id: '4',
        firstName: 'David',
        lastName: 'Kim',
        email: 'david.kim@example.com',
        status: 'suspended',
        specialties: ['Weight Management', 'General Nutrition'],
        clientCount: 7,
        rating: 3.2,
        joinDate: '2024-11-22'
    },
    {
        id: '5',
        firstName: 'Emily',
        lastName: 'Taylor',
        email: 'emily.taylor@example.com',
        status: 'active',
        specialties: ['Eating Disorders', 'Pediatric Nutrition'],
        clientCount: 15,
        rating: 4.9,
        joinDate: '2024-08-30'
    },
];

const NutritionistsList = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [nutritionists, setNutritionists] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // In a real app, you would fetch nutritionists from an API
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setNutritionists(mockNutritionists);
            setIsLoading(false);
        }, 800);
    }, []);

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return '#10B981'; // green
            case 'pending':
                return '#F59E0B'; // yellow
            case 'suspended':
                return '#EF4444'; // red
            default:
                return '#6B7280'; // gray
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const filteredNutritionists = nutritionists.filter(nutritionist => {
        // Apply search query
        const matchesSearch =
            searchQuery === '' ||
            nutritionist.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            nutritionist.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            nutritionist.email.toLowerCase().includes(searchQuery.toLowerCase());

        // Apply status filter
        const matchesStatus =
            statusFilter === 'all' ||
            nutritionist.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const renderNutritionistItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => router.push(`/admin/nutritionists/${item.id}`)}
                activeOpacity={0.7}
            >
                <Card style={styles.nutritionistCard}>
                    <View style={styles.cardHeader}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.nutritionistName}>{item.firstName} {item.lastName}</Text>
                            <Badge
                                style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}
                            >
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                        </View>
                        <Text style={styles.nutritionistEmail}>{item.email}</Text>
                    </View>

                    <View style={styles.cardDetails}>
                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <Ionicons name="people-outline" size={16} color="#4B5563" />
                                <Text style={styles.detailText}>{item.clientCount} clients</Text>
                            </View>

                            <View style={styles.detailItem}>
                                <Ionicons name="star-outline" size={16} color="#4B5563" />
                                <Text style={styles.detailText}>{item.rating > 0 ? item.rating.toFixed(1) : 'N/A'}</Text>
                            </View>

                            <View style={styles.detailItem}>
                                <Ionicons name="calendar-outline" size={16} color="#4B5563" />
                                <Text style={styles.detailText}>Joined {formatDate(item.joinDate)}</Text>
                            </View>
                        </View>

                        <View style={styles.specialtiesContainer}>
                            {item.specialties.map((specialty, index) => (
                                <View key={index} style={styles.specialtyChip}>
                                    <Text style={styles.specialtyText}>{specialty}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#3F836E" />
                <Text style={styles.loadingText}>Loading nutritionists...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Nutritionists</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/admin/nutritionists/create')}
                >
                    <Ionicons name="add" size={24} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>Add New</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Ionicons name="search-outline" size={20} color="#6B7280" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search nutritionists..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                        placeholderTextColor="#9CA3AF"
                    />
                    {searchQuery !== '' && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            statusFilter === 'all' && styles.filterButtonActive
                        ]}
                        onPress={() => setStatusFilter('all')}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            statusFilter === 'all' && styles.filterButtonTextActive
                        ]}>All</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            statusFilter === 'active' && styles.filterButtonActive
                        ]}
                        onPress={() => setStatusFilter('active')}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            statusFilter === 'active' && styles.filterButtonTextActive
                        ]}>Active</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            statusFilter === 'pending' && styles.filterButtonActive
                        ]}
                        onPress={() => setStatusFilter('pending')}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            statusFilter === 'pending' && styles.filterButtonTextActive
                        ]}>Pending</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            statusFilter === 'suspended' && styles.filterButtonActive
                        ]}
                        onPress={() => setStatusFilter('suspended')}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            statusFilter === 'suspended' && styles.filterButtonTextActive
                        ]}>Suspended</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={styles.nutritionistCountContainer}>
                <Text style={styles.nutritionistCount}>
                    {filteredNutritionists.length} nutritionist{filteredNutritionists.length !== 1 ? 's' : ''}
                </Text>
                <TouchableOpacity
                    style={styles.approvalQueueButton}
                    onPress={() => router.push('/admin/nutritionists/approval')}
                >
                    <Text style={styles.approvalQueueButtonText}>Approval Queue</Text>
                    <Badge style={styles.approvalQueueBadge}>3</Badge>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredNutritionists}
                renderItem={renderNutritionistItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.nutritionistsList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={48} color="#9CA3AF" />
                        <Text style={styles.emptyText}>No nutritionists found</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 16,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 12,
        fontFamily: 'kregular',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        fontFamily: 'kbold',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3F836E',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#FFFFFF',
        marginLeft: 8,
        fontWeight: '600',
        fontFamily: 'kbold',
    },
    searchContainer: {
        marginBottom: 16,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#1F2937',
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
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterButtonActive: {
        backgroundColor: '#E6FFFA',
        borderColor: '#3F836E',
    },
    filterButtonText: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'kregular',
    },
    filterButtonTextActive: {
        color: '#3F836E',
        fontFamily: 'kbold',
    },
    nutritionistCountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    nutritionistCount: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'kregular',
    },
    approvalQueueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
    },
    approvalQueueButtonText: {
        fontSize: 14,
        color: '#4B5563',
        fontFamily: 'kregular',
    },
    approvalQueueBadge: {
        backgroundColor: '#EF4444',
        color: '#FFFFFF',
        marginLeft: 8,
        fontFamily: 'kbold',
    },
    nutritionistsList: {
        paddingBottom: 20,
    },
    nutritionistCard: {
        marginBottom: 12,
        borderRadius: 10,
        overflow: 'hidden',
    },
    cardHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    nutritionistName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginRight: 8,
        fontFamily: 'kbold',
    },
    statusBadge: {
        paddingHorizontal: 8,
        height: 22,
        fontFamily: 'kbold',
    },
    nutritionistEmail: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'kregular',
    },
    cardDetails: {
        padding: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 14,
        color: '#4B5563',
        marginLeft: 6,
        fontFamily: 'kregular',
    },
    specialtiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    specialtyChip: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    specialtyText: {
        fontSize: 12,
        color: '#4B5563',
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
        color: '#9CA3AF',
        textAlign: 'center',
        fontFamily: 'kregular',
    },
});

export default NutritionistsList;