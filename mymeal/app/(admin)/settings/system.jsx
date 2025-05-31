
import { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';


// Mock system settings data
const initialSettings = {
    general: {
        maintenance: false,
        newRegistrations: true,
        nutritionistApplications: true,
        autoApproveNutritionists: false,
    },
    email: {
        notificationsEnabled: true,
        adminEmail: 'admin@nutriplan.com',
        emailProvider: 'SMTP',
        smtpServer: 'smtp.example.com',
        smtpPort: '587',
    },
    security: {
        loginAttempts: '5',
        sessionTimeout: '60',
        passwordExpiry: '90',
        twoFactorAuth: false,
    },
    backup: {
        autoBackup: true,
        backupFrequency: 'Daily',
        lastBackup: '2023-10-15 03:00 AM',
        storageLocation: 'Cloud Storage',
    }
};

const SystemSettings = () => {
    const [settings, setSettings] = useState(initialSettings);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    // Handle toggle switches
    const handleToggle = (section, setting) => {
        setSettings({
            ...settings,
            [section]: {
                ...settings[section],
                [setting]: !settings[section][setting]
            }
        });
    };

    // Handle text input changes
    const handleTextChange = (section, setting, value) => {
        setSettings({
            ...settings,
            [section]: {
                ...settings[section],
                [setting]: value
            }
        });
    };

    // Toggle editing mode
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    // Save settings (in a real app, this would call an API)
    const saveSettings = () => {
        // Here you would make an API call to save settings
        console.log('Saving settings:', settings);
        setIsEditing(false);
        // Show success message or handle errors
    };




    const { handleLogout } = useGlobalContext();

    const onLogout = async () => {
        try {
            await handleLogout();
            // Redirect to welcome/login screen
            router.replace("/");
        } catch (error) {
            console.error("Logout failed:", error);
            // Optionally show error message to user
            alert("Failed to logout. Please try again.");
        }
    };
    // Logout button component

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>System Settings</Text>
                <Text style={styles.headerSubtitle}>Configure global system parameters</Text>
            </View>

            <View style={styles.actionsContainer}>
                {isEditing ? (
                    <>
                        <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={saveSettings}>
                            <Ionicons name="save-outline" size={18} color="#fff" />
                            <Text style={styles.actionButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={toggleEditMode}>
                            <Ionicons name="close-outline" size={18} color="#3F836E" />
                            <Text style={[styles.actionButtonText, styles.cancelText]}>Cancel</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.actionButton} onPress={toggleEditMode}>
                        <Ionicons name="create-outline" size={18} color="#3F836E" />
                        <Text style={[styles.actionButtonText, styles.editText]}>Edit Settings</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* General Settings */}
            <Card style={styles.settingCard}>
                <Card.Content>
                    <View style={styles.settingHeader}>
                        <Ionicons name="settings-outline" size={22} color="#3F836E" />
                        <Text style={styles.settingTitle}>General Settings</Text>
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingTextContainer}>
                            <Text style={styles.settingName}>Maintenance Mode</Text>
                            <Text style={styles.settingDescription}>
                                Put the entire system in maintenance mode
                            </Text>
                        </View>
                        <Switch
                            value={settings.general.maintenance}
                            onValueChange={() => handleToggle('general', 'maintenance')}
                            disabled={!isEditing}
                            trackColor={{ false: '#d1d5db', true: '#9BD5C4' }}
                            thumbColor={settings.general.maintenance ? '#3F836E' : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingTextContainer}>
                            <Text style={styles.settingName}>Allow New Registrations</Text>
                            <Text style={styles.settingDescription}>
                                Enable user registration on the platform
                            </Text>
                        </View>
                        <Switch
                            value={settings.general.newRegistrations}
                            onValueChange={() => handleToggle('general', 'newRegistrations')}
                            disabled={!isEditing}
                            trackColor={{ false: '#d1d5db', true: '#9BD5C4' }}
                            thumbColor={settings.general.newRegistrations ? '#3F836E' : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingTextContainer}>
                            <Text style={styles.settingName}>Nutritionist Applications</Text>
                            <Text style={styles.settingDescription}>
                                Allow new nutritionist applications
                            </Text>
                        </View>
                        <Switch
                            value={settings.general.nutritionistApplications}
                            onValueChange={() => handleToggle('general', 'nutritionistApplications')}
                            disabled={!isEditing}
                            trackColor={{ false: '#d1d5db', true: '#9BD5C4' }}
                            thumbColor={settings.general.nutritionistApplications ? '#3F836E' : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingTextContainer}>
                            <Text style={styles.settingName}>Auto-Approve Nutritionists</Text>
                            <Text style={styles.settingDescription}>
                                Automatically approve nutritionist applications
                            </Text>
                        </View>
                        <Switch
                            value={settings.general.autoApproveNutritionists}
                            onValueChange={() => handleToggle('general', 'autoApproveNutritionists')}
                            disabled={!isEditing}
                            trackColor={{ false: '#d1d5db', true: '#9BD5C4' }}
                            thumbColor={settings.general.autoApproveNutritionists ? '#3F836E' : '#f4f3f4'}
                        />
                    </View>
                </Card.Content>
            </Card>

            {/* Email Settings */}
            <Card style={styles.settingCard}>
                <Card.Content>
                    <View style={styles.settingHeader}>
                        <Ionicons name="mail-outline" size={22} color="#3F836E" />
                        <Text style={styles.settingTitle}>Email Configuration</Text>
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingTextContainer}>
                            <Text style={styles.settingName}>Email Notifications</Text>
                            <Text style={styles.settingDescription}>
                                Enable system email notifications
                            </Text>
                        </View>
                        <Switch
                            value={settings.email.notificationsEnabled}
                            onValueChange={() => handleToggle('email', 'notificationsEnabled')}
                            disabled={!isEditing}
                            trackColor={{ false: '#d1d5db', true: '#9BD5C4' }}
                            thumbColor={settings.email.notificationsEnabled ? '#3F836E' : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.inputSettingItem}>
                        <Text style={styles.settingName}>Admin Email Address</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={settings.email.adminEmail}
                            onChangeText={(value) => handleTextChange('email', 'adminEmail', value)}
                            editable={isEditing}
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputSettingItem}>
                        <Text style={styles.settingName}>Email Provider</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={settings.email.emailProvider}
                            onChangeText={(value) => handleTextChange('email', 'emailProvider', value)}
                            editable={isEditing}
                        />
                    </View>

                    <View style={styles.inputSettingItem}>
                        <Text style={styles.settingName}>SMTP Server</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={settings.email.smtpServer}
                            onChangeText={(value) => handleTextChange('email', 'smtpServer', value)}
                            editable={isEditing}
                        />
                    </View>

                    <View style={styles.inputSettingItem}>
                        <Text style={styles.settingName}>SMTP Port</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={settings.email.smtpPort}
                            onChangeText={(value) => handleTextChange('email', 'smtpPort', value)}
                            editable={isEditing}
                            keyboardType="numeric"
                        />
                    </View>
                </Card.Content>
            </Card>

            {/* Security Settings */}
            <Card style={styles.settingCard}>
                <Card.Content>
                    <View style={styles.settingHeader}>
                        <Ionicons name="shield-outline" size={22} color="#3F836E" />
                        <Text style={styles.settingTitle}>Security Settings</Text>
                    </View>

                    <View style={styles.inputSettingItem}>
                        <Text style={styles.settingName}>Max Login Attempts</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={settings.security.loginAttempts}
                            onChangeText={(value) => handleTextChange('security', 'loginAttempts', value)}
                            editable={isEditing}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputSettingItem}>
                        <Text style={styles.settingName}>Session Timeout (minutes)</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={settings.security.sessionTimeout}
                            onChangeText={(value) => handleTextChange('security', 'sessionTimeout', value)}
                            editable={isEditing}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputSettingItem}>
                        <Text style={styles.settingName}>Password Expiry (days)</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={settings.security.passwordExpiry}
                            onChangeText={(value) => handleTextChange('security', 'passwordExpiry', value)}
                            editable={isEditing}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingTextContainer}>
                            <Text style={styles.settingName}>Two-Factor Authentication</Text>
                            <Text style={styles.settingDescription}>
                                Enforce 2FA for all admin users
                            </Text>
                        </View>
                        <Switch
                            value={settings.security.twoFactorAuth}
                            onValueChange={() => handleToggle('security', 'twoFactorAuth')}
                            disabled={!isEditing}
                            trackColor={{ false: '#d1d5db', true: '#9BD5C4' }}
                            thumbColor={settings.security.twoFactorAuth ? '#3F836E' : '#f4f3f4'}
                        />
                    </View>
                </Card.Content>
            </Card>

            {/* Backup Settings */}
            <Card style={styles.settingCard}>
                <Card.Content>
                    <View style={styles.settingHeader}>
                        <Ionicons name="cloud-upload-outline" size={22} color="#3F836E" />
                        <Text style={styles.settingTitle}>Backup & Recovery</Text>
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingTextContainer}>
                            <Text style={styles.settingName}>Automatic Backups</Text>
                            <Text style={styles.settingDescription}>
                                Enable automated system backups
                            </Text>
                        </View>
                        <Switch
                            value={settings.backup.autoBackup}
                            onValueChange={() => handleToggle('backup', 'autoBackup')}
                            disabled={!isEditing}
                            trackColor={{ false: '#d1d5db', true: '#9BD5C4' }}
                            thumbColor={settings.backup.autoBackup ? '#3F836E' : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.inputSettingItem}>
                        <Text style={styles.settingName}>Backup Frequency</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={settings.backup.backupFrequency}
                            onChangeText={(value) => handleTextChange('backup', 'backupFrequency', value)}
                            editable={isEditing}
                        />
                    </View>

                    <View style={styles.inputSettingItem}>
                        <Text style={styles.settingName}>Last Backup</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={settings.backup.lastBackup}
                            editable={false}
                        />
                    </View>

                    <View style={styles.inputSettingItem}>
                        <Text style={styles.settingName}>Storage Location</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={settings.backup.storageLocation}
                            onChangeText={(value) => handleTextChange('backup', 'storageLocation', value)}
                            editable={isEditing}
                        />
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.backupButton]}
                            onPress={() => console.log('Manual backup initiated')}
                        >
                            <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                            <Text style={styles.buttonText}>Backup Now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.restoreButton]}
                            onPress={() => console.log('Restore dialog shown')}
                        >
                            <Ionicons name="cloud-download-outline" size={18} color="#fff" />
                            <Text style={styles.buttonText}>Restore</Text>
                        </TouchableOpacity>
                    </View>
                </Card.Content>
            </Card>
            <TouchableOpacity style={styles.button} onPress={onLogout}

            >
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
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
    actionsContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#3F836E',
    },
    saveButton: {
        backgroundColor: '#3F836E',
        borderColor: '#3F836E',
    },
    actionButtonText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'kbold',
    },
    editText: {
        color: '#3F836E',
    },
    cancelText: {
        color: '#3F836E',
    },
    settingCard: {
        marginBottom: 16,
        borderRadius: 15,
        backgroundColor: '#fff',
        elevation: 2,
    },
    settingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    settingTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d3748',
        marginLeft: 10,
        fontFamily: 'kbold',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingTextContainer: {
        flex: 1,
        paddingRight: 16,
    },
    settingName: {
        fontSize: 16,
        color: '#4a5568',
        fontWeight: '500',
        fontFamily: 'kbold',
    },
    settingDescription: {
        fontSize: 14,
        color: '#a0aec0',
        marginTop: 2,
        fontFamily: 'kregular',
    },
    inputSettingItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        marginTop: 8,
        paddingHorizontal: 12,
        fontSize: 14,
        color: '#4a5568',
        backgroundColor: '#fff',
        fontFamily: 'kregular',
    },
    disabledInput: {
        backgroundColor: '#f7fafc',
        color: '#718096',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 12,
    },
    backupButton: {
        backgroundColor: '#3F836E',
    },
    restoreButton: {
        backgroundColor: '#4c51bf',
    },
    buttonText: {
        color: '#fff',
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'kbold',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});



export default SystemSettings;