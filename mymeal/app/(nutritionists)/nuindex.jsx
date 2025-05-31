import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import { icons } from "../../constants";
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const Dashboard = () => {
    const router = useRouter();
    const { user, loading, mealPlans } = useGlobalContext();
    const [stats, setStats] = useState({
        totalClients: 24,
        activeMealPlans: 18,
        upcomingAppointments: 5
    });
    const [recentClients, setRecentClients] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

    useEffect(() => {
        // In a real app, these would be API calls
        // Simulating data fetch with mock data
        const fetchDashboardData = () => {
            // Mock data - already set stats above
            setRecentClients([
                { id: 1, name: "Jane Smith", image: null, goal: "Weight loss", lastVisit: "2 days ago" },
                { id: 2, name: "John Doe", image: null, goal: "Muscle gain", lastVisit: "1 week ago" },
                { id: 3, name: "Alice Johnson", image: null, goal: "Diabetes management", lastVisit: "Yesterday" },
            ]);

            setUpcomingAppointments([
                { id: 101, clientName: "Jane Smith", date: "Today", time: "14:00" },
                { id: 102, clientName: "Mike Brown", date: "Tomorrow", time: "10:30" },
                { id: 103, clientName: "Sarah Lee", date: "May 20", time: "16:15" },
            ]);
        };

        fetchDashboardData();
    }, []);

    // Define metrics similar to admin dashboard
    const metrics = [
        { title: 'Total Clients', value: stats.totalClients.toString(), icon: 'people', color: '#3F836E' },
        { title: 'Active Meal Plans', value: stats.activeMealPlans.toString(), icon: 'restaurant', color: '#3F836E' },
        //{ title: 'Appointments', value: stats.upcomingAppointments.toString(), icon: 'calendar', color: '#3F836E' },
        { title: 'Client Progress', value: '12', icon: 'trending-up', color: '#3F836E' },
    ];

    if (loading) return <Loader isLoading={loading} />;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    Welcome back, {user?.username || "Nutritionist"}
                </Text>
                <Text style={styles.headerSubtitle}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>
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

            {/* Recent Clients */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Clients</Text>
                    <TouchableOpacity onPress={() => router.push('/users')}>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                <Card style={styles.activityCard}>
                    {recentClients.map((client, index) => (
                        <TouchableOpacity
                            key={client.id}
                            onPress={() => router.push(`/users/[id]${client.id}`)}
                        >
                            <View style={[
                                styles.activityItem,
                                index === recentClients.length - 1 ? styles.lastActivityItem : null
                            ]}>
                                <View style={styles.clientAvatarContainer}>
                                    <Text style={styles.clientAvatarText}>{client.name.charAt(0)}</Text>
                                </View>
                                <View style={styles.activityContent}>
                                    <Text style={styles.clientName}>{client.name}</Text>
                                    <Text style={styles.clientGoal}>{client.goal}</Text>
                                </View>
                                <View>
                                    <Text style={styles.activityTime}>Last visit</Text>
                                    <Text style={styles.activityTimeValue}>{client.lastVisit}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </Card>
            </View>

            {/* Upcoming Appointments */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Upcoming Appointments</Text>

                </View>

                <Card style={styles.activityCard}>
                    {upcomingAppointments.map((appointment, index) => (
                        <View key={appointment.id} style={[
                            styles.activityItem,
                            index === upcomingAppointments.length - 1 ? styles.lastActivityItem : null
                        ]}>
                            <View style={styles.appointmentIconContainer}>
                                <Ionicons name="calendar-outline" size={16} color="#3F836E" />
                            </View>
                            <View style={styles.activityContent}>
                                <Text style={styles.clientName}>{appointment.clientName}</Text>
                                <Text style={styles.clientGoal}>Consultation Session</Text>
                            </View>
                            <View style={styles.appointmentTime}>
                                <Text style={styles.appointmentDate}>{appointment.date}</Text>
                                <Text style={styles.appointmentTimeText}>{appointment.time}</Text>
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
                        onPress={() => router.push('/users/add')}
                    >
                        <View style={styles.quickActionContent}>
                            <Ionicons name="person-add-outline" size={22} color="#3F836E" />
                            <Text style={styles.quickActionText}>Add Client</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickActionCard}
                        onPress={() => router.push('/meal-planner/create')}
                    >
                        <View style={styles.quickActionContent}>
                            <Ionicons name="restaurant-outline" size={22} color="#3F836E" />
                            <Text style={styles.quickActionText}>Create Meal Plan</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickActionCard}
                        onPress={() => router.push('/progress-tracking')}
                    >
                        <View style={styles.quickActionContent}>
                            <Ionicons name="trending-up-outline" size={22} color="#3F836E" />
                            <Text style={styles.quickActionText}>Track Progress</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickActionCard}
                        onPress={() => router.push('/analytics')}
                    >
                        <View style={styles.quickActionContent}>
                            <Ionicons name="bar-chart-outline" size={22} color="#3F836E" />
                            <Text style={styles.quickActionText}>Analytics</Text>
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 12,
        fontFamily: 'kbold',
    },
    viewAllText: {
        fontSize: 14,
        color: '#3F836E',
        fontFamily: 'kmedium',
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
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    lastActivityItem: {
        borderBottomWidth: 0,
    },
    clientAvatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3F836E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    clientAvatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'kbold',
    },
    appointmentIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e6fffa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    clientName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    clientGoal: {
        fontSize: 14,
        color: '#718096',
        fontFamily: 'kregular',
    },
    activityTime: {
        fontSize: 12,
        color: '#a0aec0',
        textAlign: 'right',
        fontFamily: 'kmedium',
    },
    activityTimeValue: {
        fontSize: 12,
        color: '#4a5568',
        textAlign: 'right',
        fontFamily: 'kregular',
    },
    appointmentTime: {
        backgroundColor: '#e6fffa',
        padding: 8,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    appointmentDate: {
        fontSize: 14,
        color: '#3F836E',
        fontWeight: '600',
        fontFamily: 'kbold',
    },
    appointmentTimeText: {
        fontSize: 12,
        color: '#3F836E',
        fontFamily: 'kmedium',
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
        padding: 16,
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

export default Dashboard;
