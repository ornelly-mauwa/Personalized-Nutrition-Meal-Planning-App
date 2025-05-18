import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Card, TextInput, Button, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Mock settings data
const initialSettings = {
    appName: 'NutriTrack',
    contactEmail: 'support@nutritrack.com',
    supportPhone: '+1 (555) 987-6543',
    notificationsEnabled: true,
    emailNotifications: true,
    pushNotifications: true,
    userRegistration: true,
    nutritionistApplications: true,
    maintenanceMode: false,
    darkMode: false,
};

const GeneralSettingsScreen = () => {
    const [settings, setSettings] = useState(initialSettings);
    const [isEditing, setIsEditing] = useState(false);

    // Handle text input changes
    const handleChange = (key, value) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [key]: value
        }));
    };

    // Handle toggle switches
    const handleToggle = (key) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [key]: !prevSettings[key]
        }));
    };

    // Save changes
    const handleSave = () => {
        // In a real app, submit changes to your API
        console.log('Saving settings:', settings);
        setIsEditing(false);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>General Settings</Text>
                <Text style={styles.headerSubtitle}>Configure application settings</Text>
            </View>

            {/* Basic Information Card */}
            <Card style={styles.card}>
                <Card.Title
                    title="Application Information"
                    titleStyle={styles.cardTitle}
                    right={(props) => (
                        <Button
                            mode={isEditing ? "contained" : "outlined"}
                            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
                            style={isEditing ? styles.saveButton : styles.editButton}
                            labelStyle={styles.buttonLabel}
                        >
                            {isEditing ? "Save" : "Edit"}
                        </Button>
                    )}
                />
                <Card.Content>
                    <View style={styles.formGroup}>
                        <Text style={styles.inputLabel}>Application Name</Text>
                        <TextInput
                            value={settings.appName}
                            onChangeText={(value) => handleChange('appName', value)}
                            style={styles.textInput}
                            mode="outlined"
                            outlineColor="#E2E8F0"
                            activeOutlineColor="#3F836E"
                            disabled={!isEditing}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.inputLabel}>Contact Email</Text>
                        <TextInput
                            value={settings.contactEmail}
                            onChangeText={(value) => handleChange('contactEmail', value)}
                            style={styles.textInput}
                            mode="outlined"
                            outlineColor="#E2E8F0"
                            activeOutlineColor="#3F836E"
                            disabled={!isEditing}
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.inputLabel}>Support Phone</Text>
                        <TextInput
                            value={settings.supportPhone}
                            onChangeText={(value) => handleChange('supportPhone', value)}
                            style={styles.textInput}
                            mode="outlined"
                            outlineColor="#E2E8F0"
                            activeOutlineColor="#3F836E"
                            disabled={!isEditing}
                            keyboardType="phone-pad"
                        />
                    </View>
                </Card.Content>
            </Card>

            {/* Notifications Card */}
            <Card style={styles.card}>
                <Card.Title
                    title="Notifications"
                    titleStyle={styles.cardTitle}
                />
                <Card.Content>
                    <View style={styles.toggleRow}>
                        <View style={styles.toggleInfo}>
                            <Text style={styles.toggleTitle}>Enable Notifications</Text>
                            <Text style={styles.toggleDescription}>
                                Master toggle for all notification types
                            </Text>
                        </View>
                        <Switch
                            value={settings.notificationsEnabled}
                            onValueChange={() => handleToggle('notificationsEnabled')}
                            color="#3F836E"
                        />
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.toggleRow}>
                        <View style={styles.toggleInfo}>
                            <Text style={[
                                styles.toggleTitle,
                                !settings.notificationsEnabled && styles.disabledText
                            ]}>
                                Email Notifications
                            </Text>
                            <Text style={[
                                styles.toggleDescription,
                                !settings.notificationsEnabled && styles.disabledText
                            ]}>
                                Send notifications via email
                            </Text>
                        </View>
                        <Switch
                            value={settings.emailNotifications}
                            onValueChange={() => handleToggle('emailNotifications')}
                            disabled={!settings.notificationsEnabled}
                            color="#3F836E"
                        />
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.toggleRow}>
                        <View style={styles.toggleInfo}>
                            <Text style={[
                                styles.toggleTitle,
                                !settings.notificationsEnabled && styles.disabledText
                            ]}>
                                Push Notifications
                            </Text>
                            <Text style={[
                                styles.toggleDescription,
                                !settings.notificationsEnabled && styles.disabledText
                            ]}>
                                Send in-app push notifications
                            </Text>
                        </View>
                        <Switch
                            value={settings.pushNotifications}
                            onValueChange={() => handleToggle('pushNotifications')}
                            disabled={!settings.notificationsEnabled}
                            color="#3F836E"
                        />
                    </View>
                </Card.Content>
            </Card>

            {/* Features & System Card */}
            <Card style={styles.card}>
                <Card.Title
                    title="Features & System"
                    titleStyle={styles.cardTitle}
                />
                <Card.Content>
                    <View style={styles.toggleRow}>
                        <View style={styles.toggleInfo}>
                            <Text style={styles.toggleTitle}>User Registration</Text>
                            <Text style={styles.toggleDescription}>
                                Allow new users to register accounts
                            </Text>
                        </View>
                        <Switch
                            value={settings.userRegistration}
                            onValueChange={() => handleToggle('userRegistration')}
                            color="#3F836E"
                        />
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.toggleRow}>
                        <View style={styles.toggleInfo}>
                            <Text style={styles.toggleTitle}>Nutritionist Applications</Text>
                            <Text style={styles.toggleDescription}>
                                Allow new nutritionist applications
                            </Text>
                        </View>
                        <Switch
                            value={settings.nutritionistApplications}
                            onValueChange={() => handleToggle('nutritionistApplications')}
                            color="#3F836E"
                        />
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.toggleRow}>
                        <View style={styles.toggleInfo}>
                            <Text style={styles.toggleTitle}>Maintenance Mode</Text>
                            <Text style={styles.toggleDescription}>
                                Put the application in maintenance mode
                            </Text>
                        </View>
                        <Switch
                            value={settings.maintenanceMode}
                            onValueChange={() => handleToggle('maintenanceMode')}
                            color="#3F836E"
                        />
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.toggleRow}>
                        <View style={styles.toggleInfo}>
                            <Text style={styles.toggleTitle}>Dark Mode</Text>
                            <Text style={styles.toggleDescription}>
                                Enable dark mode throughout the application
                            </Text>
                        </View>
                        <Switch
                            value={settings.darkMode}
                            onValueChange={() => handleToggle('darkMode')}
                            color="#3F836E"
                        />
                    </View>
                </Card.Content>
            </Card>

            {/* Actions Card */}
            <Card style={styles.card}>
                <Card.Title
                    title="System Actions"
                    titleStyle={styles.cardTitle}
                />
                <Card.Content>
                    <View style={styles.actionsContainer}>
                        <Button
                            mode="outlined"
                            icon="refresh"
                            style={styles.actionButton}
                            textColor="#3F836E"
                        >
                            Clear Cache
                        </Button>

                        <Button
                            mode="outlined"
                            icon="backup-restore"
                            style={styles.actionButton}
                            textColor="#3F836E"
                        >
                            Backup Database
                        </Button>

                        <Button
                            mode="outlined"
                            icon="send"
                            style={styles.actionButton}
                            textColor="#3F836E"
                        >
                            Send Test Email
                        </Button>

                        <Button
                            mode="outlined"
                            icon="update"
                            style={styles.actionButton}
                            textColor="#3F836E"
                        >
                            Check for Updates
                        </Button>
                    </View>
                </Card.Content>
            </Card>

            {/* Save All Button */}
            <Button
                mode="contained"
                style={styles.saveAllButton}
                buttonColor="#3F836E"
                onPress={handleSave}
            >
                Save All Changes
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
        marginBottom: 16,
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
    formGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        color: '#4a5568',
        marginBottom: 8,
        fontFamily: 'kregular',
    },
    textInput: {
        backgroundColor: '#fff',
        fontSize: 14,
        height: 45,
    },
    editButton: {
        marginRight: 16,
        borderColor: '#3F836E',
    },
    saveButton: {
        marginRight: 16,
        backgroundColor: '#3F836E',
    },
    buttonLabel: {
        fontSize: 12,
        fontFamily: 'kbold',
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    toggleInfo: {
        flex: 1,
    },
    toggleTitle: {
        fontSize: 16,
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    toggleDescription: {
        fontSize: 14,
        color: '#718096',
        marginTop: 2,
        fontFamily: 'kregular',
    },
    disabledText: {
        color: '#A0AEC0',
    },
    divider: {
        marginVertical: 8,
    },
    actionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    actionButton: {
        width: '48%',
        marginBottom: 12,
        borderColor: '#3F836E',
    },
    saveAllButton: {
        marginBottom: 24,
        borderRadius: 8,
    },
});

export default GeneralSettingsScreen;