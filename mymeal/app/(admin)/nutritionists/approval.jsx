import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, Button, Badge } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Sample data for pending applications
const pendingApplications = [
    {
        id: 'n001',
        name: 'Dr. Sarah Johnson',
        specialty: 'Sports Nutrition',
        experience: '8 years',
        submittedAt: '2 days ago',
        avatar: null, // We'll use a placeholder
        status: 'pending',
        hasDocuments: true,
    },
    {
        id: 'n002',
        name: 'Michael Rodriguez, RD',
        specialty: 'Weight Management',
        experience: '5 years',
        submittedAt: '3 days ago',
        avatar: null,
        status: 'pending',
        hasDocuments: true,
    },
    {
        id: 'n003',
        name: 'Jessica Lee, CN',
        specialty: 'Clinical Nutrition',
        experience: '10 years',
        submittedAt: '5 days ago',
        avatar: null,
        status: 'pending',
        hasDocuments: true,
    },
    {
        id: 'n004',
        name: 'Robert Wilson',
        specialty: 'Plant-based Nutrition',
        experience: '3 years',
        submittedAt: '1 week ago',
        avatar: null,
        status: 'pending',
        hasDocuments: false, // Missing documents
    },
    {
        id: 'n005',
        name: 'Emma Davis, RDN',
        specialty: 'Pediatric Nutrition',
        experience: '7 years',
        submittedAt: '1 week ago',
        avatar: null,
        status: 'pending',
        hasDocuments: true,
    },
    {
        id: 'n006',
        name: 'David Chang',
        specialty: 'Diabetes Management',
        experience: '6 years',
        submittedAt: '2 weeks ago',
        avatar: null,
        status: 'pending',
        hasDocuments: true,
    },
    {
        id: 'n007',
        name: 'Linda Thompson',
        specialty: 'Geriatric Nutrition',
        experience: '12 years',
        submittedAt: '2 weeks ago',
        avatar: null,
        status: 'pending',
        hasDocuments: true,
    },
];

const ApprovalQueue = () => {
    const router = useRouter();
    const [filter, setFilter] = useState('all'); // 'all', 'documents', 'no-documents'

    // Filter applications based on selected filter
    const filteredApplications = pendingApplications.filter(app => {
        if (filter === 'documents') return app.hasDocuments;
        if (filter === 'no-documents') return !app.hasDocuments;
        return true; // 'all' filter
    });

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Approval Queue</Text>
                <Text style={styles.subtitle}>
                    {pendingApplications.length} nutritionists awaiting approval
                </Text>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
                    onPress={() => setFilter('all')}
                >
                    <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
                        All ({pendingApplications.length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filterTab, filter === 'documents' && styles.activeFilterTab]}
                    onPress={() => setFilter('documents')}
                >
                    <Text style={[styles.filterText, filter === 'documents' && styles.activeFilterText]}>
                        Complete ({pendingApplications.filter(a => a.hasDocuments).length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filterTab, filter === 'no-documents' && styles.activeFilterTab]}
                    onPress={() => setFilter('no-documents')}
                >
                    <Text style={[styles.filterText, filter === 'no-documents' && styles.activeFilterText]}>
                        Missing Docs ({pendingApplications.filter(a => !a.hasDocuments).length})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Applications List */}
            <View style={styles.applicationsContainer}>
                {filteredApplications.map((application) => (
                    <Card key={application.id} style={styles.applicationCard}>
                        <Card.Content style={styles.cardContent}>
                            {/* Avatar and Name Section */}
                            <View style={styles.applicantInfo}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {application.name.split(' ').map(n => n[0]).join('')}
                                    </Text>
                                </View>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.name}>{application.name}</Text>
                                    <Text style={styles.specialty}>{application.specialty}</Text>
                                    <Text style={styles.experience}>{application.experience} experience</Text>
                                </View>
                            </View>

                            {/* Status Indicators */}
                            <View style={styles.statusContainer}>
                                <View style={styles.statusRow}>
                                    <Ionicons name="time-outline" size={14} color="#718096" />
                                    <Text style={styles.submittedText}>Submitted {application.submittedAt}</Text>
                                </View>

                                {!application.hasDocuments && (
                                    <Badge style={styles.warningBadge}>Missing Documents</Badge>
                                )}
                            </View>

                            {/* Action Buttons */}
                            <View style={styles.actionButtons}>
                                <Button
                                    mode="outlined"
                                    style={styles.reviewButton}
                                    labelStyle={styles.reviewButtonLabel}
                                    onPress={() => router.push(`/nutritionists/${application.id}/review`)}
                                >
                                    Review
                                </Button>
                                <View style={styles.buttonGroup}>
                                    <Button
                                        mode="contained"
                                        style={styles.approveButton}
                                        labelStyle={styles.actionButtonLabel}
                                        onPress={() => {
                                            // Handle approval logic
                                            alert(`Approved ${application.name}`);
                                        }}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        mode="outlined"
                                        style={styles.rejectButton}
                                        labelStyle={styles.rejectButtonLabel}
                                        onPress={() => {
                                            // Handle rejection logic
                                            alert(`Rejected ${application.name}`);
                                        }}
                                    >
                                        Reject
                                    </Button>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                ))}

                {filteredApplications.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-circle-outline" size={48} color="#a0aec0" />
                        <Text style={styles.emptyStateText}>No applications match the current filter</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7fafc',
        padding: 16,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    subtitle: {
        fontSize: 14,
        color: '#718096',
        marginTop: 4,
        fontFamily: 'kregular',
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 4,
    },
    filterTab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeFilterTab: {
        backgroundColor: '#e6fffa',
    },
    filterText: {
        fontSize: 13,
        color: '#718096',
        fontFamily: 'kregular',
    },
    activeFilterText: {
        color: '#3F836E',
        fontWeight: '500',
        fontFamily: 'kbold',
    },
    applicationsContainer: {
        marginTop: 8,
    },
    applicationCard: {
        marginBottom: 12,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        elevation: 2,
    },
    cardContent: {
        padding: 12,
    },
    applicantInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3F836E20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 18,
        color: '#3F836E',
        fontWeight: '600',
        fontFamily: 'kbold',
    },
    nameContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    specialty: {
        fontSize: 14,
        color: '#4a5568',
        fontFamily: 'kregular',
    },
    experience: {
        fontSize: 12,
        color: '#718096',
        marginTop: 2,
        fontFamily: 'kregular',
    },
    statusContainer: {
        marginBottom: 12,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    submittedText: {
        fontSize: 12,
        color: '#718096',
        marginLeft: 4,
        fontFamily: 'kregular',
    },
    warningBadge: {
        backgroundColor: '#FED7D7',
        color: '#C53030',
        fontSize: 10,
        marginTop: 4,
    },
    actionButtons: {
        marginTop: 8,
    },
    reviewButton: {
        borderColor: '#CBD5E0',
        marginBottom: 8,
    },
    reviewButtonLabel: {
        fontSize: 13,
        color: '#4A5568',
        fontFamily: 'kbold',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    approveButton: {
        flex: 1,
        marginRight: 8,
        backgroundColor: '#3F836E',
    },
    actionButtonLabel: {
        fontSize: 13,
        color: '#FFFFFF',
        fontFamily: 'kbold',
    },
    rejectButton: {
        flex: 1,
        borderColor: '#FC8181',
    },
    rejectButtonLabel: {
        fontSize: 13,
        color: '#E53E3E',
        fontFamily: 'kbold',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#a0aec0',
        marginTop: 12,
        textAlign: 'center',
        fontFamily: 'kregular',
    },
});

export default ApprovalQueue;