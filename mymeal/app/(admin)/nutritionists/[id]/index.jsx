import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, Button, Chip, Avatar, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Mock data for nutritionist - in a real app, you'd fetch this by ID
const mockNutritionistData = {
    id: '123',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    status: 'Approved',
    specializations: ['Weight Loss', 'Sports Nutrition', 'Diabetes Management'],
    rating: 4.8,
    reviewCount: 124,
    clientCount: 46,
    activeSince: 'Jan 2023',
    aboutMe: 'Board-certified nutritionist with over 10 years of experience working with athletes and individuals looking to improve their health through proper nutrition. Specialized in creating personalized meal plans for various health conditions and fitness goals.',
    education: [
        {
            degree: 'Ph.D. in Nutritional Sciences',
            institution: 'University of California',
            year: '2015'
        },
        {
            degree: 'M.S. in Dietetics',
            institution: 'Stanford University',
            year: '2010'
        }
    ],
    certifications: [
        'Certified Sports Nutritionist (CISSN)',
        'Certified Diabetes Educator (CDE)',
        'Licensed Dietitian Nutritionist (LDN)'
    ]
};

// Status color mapping
const statusColors = {
    'Approved': '#10B981',
    'Pending': '#F59E0B',
    'Rejected': '#EF4444',
    'Suspended': '#6B7280'
};

const NutritionistDetail = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { id } = params;

    // In a real app, fetch nutritionist data based on ID
    const nutritionist = mockNutritionistData;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nutritionist Profile</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Profile Summary Card */}
            <Card style={styles.profileCard}>
                <View style={styles.profileHeader}>
                    <Avatar.Text
                        size={80}
                        label={nutritionist.name.split(' ').map(n => n[0]).join('')}
                        backgroundColor="#3F836E"
                    />
                    <View style={styles.profileHeaderInfo}>
                        <Text style={styles.profileName}>{nutritionist.name}</Text>
                        <View style={styles.statusContainer}>
                            <View style={[styles.statusIndicator, { backgroundColor: statusColors[nutritionist.status] }]} />
                            <Text style={styles.statusText}>{nutritionist.status}</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={16} color="#F59E0B" />
                            <Text style={styles.ratingText}>{nutritionist.rating}</Text>
                            <Text style={styles.reviewCount}>({nutritionist.reviewCount} reviews)</Text>
                        </View>
                    </View>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.contactInfo}>
                    <View style={styles.contactItem}>
                        <Ionicons name="mail-outline" size={18} color="#3F836E" />
                        <Text style={styles.contactText}>{nutritionist.email}</Text>
                    </View>
                    <View style={styles.contactItem}>
                        <Ionicons name="call-outline" size={18} color="#3F836E" />
                        <Text style={styles.contactText}>{nutritionist.phone}</Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{nutritionist.clientCount}</Text>
                        <Text style={styles.statLabel}>Clients</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{nutritionist.activeSince}</Text>
                        <Text style={styles.statLabel}>Active Since</Text>
                    </View>
                </View>
            </Card>

            {/* Specializations */}
            <Card style={styles.sectionCard}>
                <Card.Title title="Specializations" />
                <Card.Content>
                    <View style={styles.chipsContainer}>
                        {nutritionist.specializations.map((specialization, index) => (
                            <Chip key={index} style={styles.chip} textStyle={styles.chipText}>
                                {specialization}
                            </Chip>
                        ))}
                    </View>
                </Card.Content>
            </Card>

            {/* About */}
            <Card style={styles.sectionCard}>
                <Card.Title title="About" />
                <Card.Content>
                    <Text style={styles.aboutText}>{nutritionist.aboutMe}</Text>
                </Card.Content>
            </Card>

            {/* Education */}
            <Card style={styles.sectionCard}>
                <Card.Title title="Education" />
                <Card.Content>
                    {nutritionist.education.map((edu, index) => (
                        <View key={index} style={styles.educationItem}>
                            <Text style={styles.degreeText}>{edu.degree}</Text>
                            <Text style={styles.institutionText}>{edu.institution}, {edu.year}</Text>
                            {index < nutritionist.education.length - 1 && <Divider style={styles.itemDivider} />}
                        </View>
                    ))}
                </Card.Content>
            </Card>

            {/* Certifications */}
            <Card style={styles.sectionCard}>
                <Card.Title title="Certifications" />
                <Card.Content>
                    {nutritionist.certifications.map((cert, index) => (
                        <View key={index} style={styles.certificationItem}>
                            <Ionicons name="checkmark-circle" size={18} color="#3F836E" />
                            <Text style={styles.certificationText}>{cert}</Text>
                        </View>
                    ))}
                </Card.Content>
            </Card>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <Button
                    mode="contained"
                    buttonColor="#3F836E"
                    style={styles.actionButton}
                    onPress={() => router.push(`/nutritionists/${id}/review`)}
                >
                    Review Profile
                </Button>

                {nutritionist.status === 'Approved' ? (
                    <Button
                        mode="outlined"
                        textColor="#EF4444"
                        style={[styles.actionButton, styles.dangerButton]}
                        onPress={() => {/* Handle suspension logic */ }}
                    >
                        Suspend Account
                    </Button>
                ) : (
                    <Button
                        mode="outlined"
                        textColor="#3F836E"
                        style={styles.actionButton}
                        onPress={() => {/* Handle approval logic */ }}
                    >
                        Approve Account
                    </Button>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    placeholder: {
        width: 40,
    },
    profileCard: {
        marginBottom: 16,
        borderRadius: 12,
        elevation: 2,
    },
    profileHeader: {
        flexDirection: 'row',
        padding: 16,
    },
    profileHeaderInfo: {
        marginLeft: 16,
        flex: 1,
        justifyContent: 'center',
    },
    profileName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 4,
        fontFamily: 'kbold',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 14,
        color: '#4a5568',
        fontFamily: 'kregular',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4a5568',
        marginLeft: 4,
        marginRight: 2,
        fontFamily: 'kbold',
    },
    reviewCount: {
        fontSize: 12,
        color: '#718096',
        fontFamily: 'kregular',
    },
    divider: {
        marginVertical: 8,
    },
    contactInfo: {
        padding: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactText: {
        fontSize: 14,
        color: '#4a5568',
        marginLeft: 8,
        fontFamily: 'kregular',
    },
    statsRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#e2e8f0',
        padding: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#e2e8f0',
        height: '80%',
        alignSelf: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 4,
        fontFamily: 'kbold',
    },
    statLabel: {
        fontSize: 12,
        color: '#718096',
        fontFamily: 'kregular',
    },
    sectionCard: {
        marginBottom: 16,
        borderRadius: 12,
        elevation: 2,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    chip: {
        margin: 4,
        backgroundColor: '#e6fffa',
    },
    chipText: {
        color: '#3F836E',
        fontFamily: 'kregular',
    },
    aboutText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#4a5568',
        fontFamily: 'kregular',
    },
    educationItem: {
        marginVertical: 6,
    },
    degreeText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 2,
        fontFamily: 'kbold',
    },
    institutionText: {
        fontSize: 14,
        color: '#718096',
        marginBottom: 8,
        fontFamily: 'kregular',
    },
    itemDivider: {
        marginVertical: 8,
    },
    certificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    certificationText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#4a5568',
        fontFamily: 'kregular',
    },
    actionButtons: {
        marginBottom: 24,
    },
    actionButton: {
        marginBottom: 12,
        borderRadius: 8,
    },
    dangerButton: {
        borderColor: '#EF4444',
    },
});

export default NutritionistDetail;