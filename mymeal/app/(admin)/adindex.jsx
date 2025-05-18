import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Sample data for dashboard metrics
const metrics = [
    { title: 'Total Users', value: '4,289', icon: 'people', color: '#3F836E' },
    { title: 'Nutritionists', value: '142', icon: 'medkit', color: '#3F836E' },
    { title: 'Approval Queue', value: '7', icon: 'checkmark-circle', color: '#3F836E' },
    { title: 'Active Plans', value: '1,894', icon: 'calendar', color: '#3F836E' },
];

// Sample data for recent activities
const recentActivities = [
    { user: 'John Doe', action: 'created a new meal plan', time: '2 hours ago' },
    { user: 'Sara Wilson', action: 'submitted nutritionist application', time: '4 hours ago' },
    { user: 'Admin', action: 'updated system settings', time: '6 hours ago' },
    { user: 'Mike Johnson', action: 'approved 3 nutritionist applications', time: '1 day ago' },
    { user: 'Emily Clark', action: 'modified food database entries', time: '1 day ago' },
];

const AdminDashboard = () => {
    const router = useRouter();

    return (

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dashboard</Text>
                <Text style={styles.headerSubtitle}>Welcome to the admin panel</Text>
            </View>

            {/* Metrics Cards */}
            <View style={styles.metricsContainer}>
                {metrics.map((metric, index) => (
                    <Card key={index} style={styles.metricCard}>
                        <Card.Content style={styles.metricContent}>
                            <View style={[styles.iconContainer, { backgroundColor: metric.color + '20' }]}>
                                <Ionicons name={metric.icon} size={24} color={metric.color} />
                            </View>
                            <View style={styles.metricTextContainer}>
                                <Text style={styles.metricValue}>{metric.value}</Text>
                                <Text style={styles.metricTitle}>{metric.title}</Text>
                            </View>
                        </Card.Content>
                    </Card>
                ))}
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <Card style={styles.activityCard}>
                    {recentActivities.map((activity, index) => (
                        <View key={index} style={[
                            styles.activityItem,
                            index === recentActivities.length - 1 ? styles.lastActivityItem : null
                        ]}>
                            <View style={styles.activityIconContainer}>
                                <Ionicons name="time-outline" size={16} color="#3F836E" />
                            </View>
                            <View style={styles.activityContent}>
                                <Text style={styles.activityText}>
                                    <Text style={styles.activityUser}>{activity.user}</Text> {activity.action}
                                </Text>
                                <Text style={styles.activityTime}>{activity.time}</Text>
                            </View>
                        </View>
                    ))}
                </Card>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActionsContainer}>
                    <TouchableOpacity
                        style={styles.quickActionCard}
                        onPress={() => router.push('/users/create')}
                    >
                        <View style={styles.quickActionContent}>
                            <Ionicons name="person-add-outline" size={22} color="#3F836E" />
                            <Text style={styles.quickActionText}>Add User</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickActionCard}
                        onPress={() => router.push('/nutritionists/approval')}
                    >
                        <View style={styles.quickActionContent}>
                            <Ionicons name="checkmark-done-outline" size={22} color="#3F836E" />
                            <Text style={styles.quickActionText}>Review Applications</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickActionCard}
                        onPress={() => router.push('/settings/system')}
                    >
                        <View style={styles.quickActionContent}>
                            <Ionicons name="settings-outline" size={22} color="#3F836E" />
                            <Text style={styles.quickActionText}>System Settings</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickActionCard}
                        onPress={() => router.push('/settings/food-database')}
                    >
                        <View style={styles.quickActionContent}>
                            <Ionicons name="restaurant-outline" size={22} color="#3F836E" />
                            <Text style={styles.quickActionText}>Manage Foods</Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
        paddingVertical: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#718096',
        marginTop: 4,
        fontFamily: 'kregular',
    },
    metricsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    metricCard: {
        width: '48%',
        marginBottom: 14,
        elevation: 2,
        borderRadius: 15,
        backgroundColor: '#fff',
    },
    metricContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    metricTextContainer: {
        flex: 1,
    },
    metricValue: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    metricTitle: {
        fontSize: 14,
        color: '#718096',
        marginTop: 2,
        fontFamily: 'kregular',
    },
    section: {
        marginTop: 24,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 12,
        fontFamily: 'kbold',
    },
    activityCard: {
        borderRadius: 15,
        backgroundColor: '#fff',
        elevation: 2,
        padding: 0,
        overflow: 'hidden',
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    lastActivityItem: {
        borderBottomWidth: 0,
    },
    activityIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#e6fffa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityText: {
        fontSize: 14,
        color: '#4a5568',
        lineHeight: 20,
        fontFamily: 'kregular',
    },
    activityUser: {
        fontWeight: '600',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    activityTime: {
        fontSize: 12,
        color: '#a0aec0',
        marginTop: 2,
        fontFamily: 'kregular',
    },
    quickActionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickActionCard: {
        width: '48%',
        marginBottom: 12,
        elevation: 2,
        borderRadius: 15,
        backgroundColor: '#fff',
        padding: 12,
    },
    quickActionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quickActionText: {
        fontSize: 14,
        color: '#4a5568',
        fontWeight: '500',
        marginLeft: 10,
        fontFamily: 'kbold',
    },
});

export default AdminDashboard;