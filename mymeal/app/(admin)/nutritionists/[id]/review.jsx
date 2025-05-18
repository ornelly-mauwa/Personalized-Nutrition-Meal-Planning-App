import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Button, TextInput, RadioButton, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Mock data for nutritionist application
const mockApplicationData = {
    id: '123',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    applicationDate: 'April 10, 2025',
    specializations: ['Weight Loss', 'Sports Nutrition', 'Diabetes Management'],
    certifications: [
        {
            name: 'Certified Sports Nutritionist (CISSN)',
            issuingBody: 'International Society of Sports Nutrition',
            verificationUrl: 'https://issn.net/verify/123456',
            verified: false
        },
        {
            name: 'Certified Diabetes Educator (CDE)',
            issuingBody: 'National Certification Board for Diabetes Educators',
            verificationUrl: 'https://ncbde.org/verify/789012',
            verified: true
        },
        {
            name: 'Licensed Dietitian Nutritionist (LDN)',
            issuingBody: 'State Board of Nutrition',
            verificationUrl: 'https://nutrition-board.gov/verify/345678',
            verified: false
        }
    ],
    professionalExperience: 'I have worked as a clinical nutritionist at Memorial Hospital for 5 years, focusing on patient care for those with chronic conditions like diabetes and heart disease. For the past 3 years, I\'ve maintained a private practice specializing in sports nutrition and weight management.',
    educationalBackground: 'Ph.D. in Nutritional Sciences from University of California (2015)\nM.S. in Dietetics from Stanford University (2010)\nB.S. in Human Nutrition from UCLA (2008)',
    approachToNutrition: 'I believe in evidence-based nutrition tailored to individual needs and preferences. My approach combines the latest scientific research with practical solutions that fit into clients\' lifestyles. I focus on sustainable changes rather than quick fixes.',
    attachedDocuments: [
        { name: 'Certification_CISSN.pdf', type: 'certification' },
        { name: 'Certification_CDE.pdf', type: 'certification' },
        { name: 'License_LDN.pdf', type: 'license' },
        { name: 'CV_SarahJohnson.pdf', type: 'resume' },
        { name: 'Diploma_PhD.pdf', type: 'education' }
    ]
};

const NutritionistReview = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { id } = params;

    // In a real app, fetch application data based on ID
    const application = mockApplicationData;

    const [reviewNotes, setReviewNotes] = useState('');
    const [decision, setDecision] = useState('');
    const [certificationVerifications, setCertificationVerifications] = useState(
        application.certifications.map(cert => cert.verified)
    );

    // Toggle verification status for certification
    const toggleVerification = (index) => {
        const updated = [...certificationVerifications];
        updated[index] = !updated[index];
        setCertificationVerifications(updated);
    };

    // Handle final decision submission
    const handleSubmitDecision = () => {
        // In a real app, submit the decision to your API
        console.log({
            nutritionistId: id,
            decision,
            reviewNotes,
            certificationVerifications
        });

        // Navigate back after submission
        router.replace('/nutritionists/approval');
    };

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
                <Text style={styles.headerTitle}>Application Review</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Application Info Card */}
            <Card style={styles.card}>
                <Card.Title
                    title="Application Information"
                    titleStyle={styles.cardTitle}
                />
                <Card.Content>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Name:</Text>
                        <Text style={styles.infoValue}>{application.name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email:</Text>
                        <Text style={styles.infoValue}>{application.email}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Phone:</Text>
                        <Text style={styles.infoValue}>{application.phone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Application Date:</Text>
                        <Text style={styles.infoValue}>{application.applicationDate}</Text>
                    </View>
                </Card.Content>
            </Card>

            {/* Certification Verification Card */}
            <Card style={styles.card}>
                <Card.Title
                    title="Certification Verification"
                    titleStyle={styles.cardTitle}
                />
                <Card.Content>
                    {application.certifications.map((cert, index) => (
                        <View key={index} style={styles.certificationItem}>
                            <View style={styles.certificationHeader}>
                                <Text style={styles.certificationName}>{cert.name}</Text>
                                <TouchableOpacity
                                    onPress={() => toggleVerification(index)}
                                    style={[
                                        styles.verificationButton,
                                        certificationVerifications[index] ? styles.verifiedButton : styles.unverifiedButton
                                    ]}
                                >
                                    <Text style={styles.verificationButtonText}>
                                        {certificationVerifications[index] ? 'Verified' : 'Mark as Verified'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.certificationIssuer}>
                                Issued by: {cert.issuingBody}
                            </Text>
                            <Text style={styles.certificationVerifyUrl}>
                                Verification URL: {cert.verificationUrl}
                            </Text>
                            {index < application.certifications.length - 1 && <Divider style={styles.divider} />}
                        </View>
                    ))}
                </Card.Content>
            </Card>

            {/* Experience & Education Card */}
            <Card style={styles.card}>
                <Card.Title
                    title="Professional Background"
                    titleStyle={styles.cardTitle}
                />
                <Card.Content>
                    <Text style={styles.sectionSubtitle}>Experience</Text>
                    <Text style={styles.paragraphText}>{application.professionalExperience}</Text>

                    <Divider style={styles.divider} />

                    <Text style={styles.sectionSubtitle}>Education</Text>
                    <Text style={styles.paragraphText}>{application.educationalBackground}</Text>

                    <Divider style={styles.divider} />

                    <Text style={styles.sectionSubtitle}>Approach to Nutrition</Text>
                    <Text style={styles.paragraphText}>{application.approachToNutrition}</Text>
                </Card.Content>
            </Card>

            {/* Attached Documents Card */}
            <Card style={styles.card}>
                <Card.Title
                    title="Attached Documents"
                    titleStyle={styles.cardTitle}
                />
                <Card.Content>
                    {application.attachedDocuments.map((doc, index) => (
                        <View key={index} style={styles.documentItem}>
                            <Ionicons
                                name={
                                    doc.type === 'certification' ? 'ribbon-outline' :
                                        doc.type === 'license' ? 'shield-checkmark-outline' :
                                            doc.type === 'resume' ? 'document-text-outline' : 'school-outline'
                                }
                                size={20}
                                color="#3F836E"
                            />
                            <Text style={styles.documentName}>{doc.name}</Text>
                            <TouchableOpacity style={styles.viewButton}>
                                <Text style={styles.viewButtonText}>View</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </Card.Content>
            </Card>

            {/* Review Notes Card */}
            <Card style={styles.card}>
                <Card.Title
                    title="Review Notes"
                    titleStyle={styles.cardTitle}
                />
                <Card.Content>
                    <TextInput
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                        value={reviewNotes}
                        onChangeText={setReviewNotes}
                        placeholder="Enter your review notes here..."
                        style={styles.reviewNotesInput}
                        outlineColor="#E2E8F0"
                        activeOutlineColor="#3F836E"
                    />
                </Card.Content>
            </Card>

            {/* Decision Card */}
            <Card style={styles.card}>
                <Card.Title
                    title="Decision"
                    titleStyle={styles.cardTitle}
                />
                <Card.Content>
                    <RadioButton.Group onValueChange={value => setDecision(value)} value={decision}>
                        <View style={styles.radioItem}>
                            <RadioButton.Android value="approve" color="#3F836E" />
                            <Text style={styles.radioLabel}>Approve</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton.Android value="reject" color="#EF4444" />
                            <Text style={styles.radioLabel}>Reject</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton.Android value="request_more_info" color="#F59E0B" />
                            <Text style={styles.radioLabel}>Request More Information</Text>
                        </View>
                    </RadioButton.Group>
                </Card.Content>
            </Card>

            {/* Submit Button */}
            <Button
                mode="contained"
                onPress={handleSubmitDecision}
                style={styles.submitButton}
                buttonColor="#3F836E"
                disabled={!decision}
            >
                Submit Decision
            </Button>
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
    card: {
        marginBottom: 16,
        borderRadius: 12,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'kbold',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    infoLabel: {
        width: 120,
        fontSize: 14,
        color: '#718096',
        fontFamily: 'kregular',
    },
    infoValue: {
        flex: 1,
        fontSize: 14,
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    certificationItem: {
        marginBottom: 12,
    },
    certificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    certificationName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2d3748',
        flex: 1,
        fontFamily: 'kbold',
    },
    verificationButton: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    verifiedButton: {
        backgroundColor: '#10B98120',
    },
    unverifiedButton: {
        backgroundColor: '#F59E0B20',
    },
    verificationButtonText: {
        fontSize: 12,
        color: '#3F836E',
        fontFamily: 'kbold',
    },
    certificationIssuer: {
        fontSize: 14,
        color: '#4a5568',
        marginBottom: 2,
        fontFamily: 'kregular',
    },
    certificationVerifyUrl: {
        fontSize: 14,
        color: '#718096',
        marginBottom: 8,
        fontFamily: 'kregular',
    },
    divider: {
        marginVertical: 12,
    },
    sectionSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 8,
        fontFamily: 'kbold',
    },
    paragraphText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#4a5568',
        marginBottom: 12,
        fontFamily: 'kregular',
    },
    documentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    documentName: {
        flex: 1,
        fontSize: 14,
        color: '#4a5568',
        marginLeft: 12,
        fontFamily: 'kregular',
    },
    viewButton: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: '#3F836E20',
        borderRadius: 16,
    },
    viewButtonText: {
        fontSize: 12,
        color: '#3F836E',
        fontFamily: 'kbold',
    },
    reviewNotesInput: {
        backgroundColor: '#fff',
        fontSize: 14,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    radioLabel: {
        fontSize: 16,
        color: '#4a5568',
        marginLeft: 8,
        fontFamily: 'kregular',
    },
    submitButton: {
        marginBottom: 24,
        borderRadius: 8,
    },
});

export default NutritionistReview;