import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Switch,
    Alert
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
    address: {
        street: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA'
    }
};

const EditUser = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    // Available roles for user selection
    const roles = [
        { id: 'user', name: 'Regular User' },
        { id: 'nutritionist', name: 'Nutritionist' },
        { id: 'admin', name: 'Administrator' },
    ];

    // In a real app, you would fetch user data based on the ID
    useEffect(() => {
        // Simulate API call to fetch user data
        setTimeout(() => {
            setFormData({
                ...mockUserData,
                // Don't include password in edit form
                password: '',
                confirmPassword: '',
            });
            setIsLoading(false);
        }, 500);
    }, [id]);

    const validateForm = () => {
        let isValid = true;
        let newErrors = {};

        // Validate first name
        if (!formData.firstName?.trim()) {
            newErrors.firstName = 'First name is required';
            isValid = false;
        }

        // Validate last name
        if (!formData.lastName?.trim()) {
            newErrors.lastName = 'Last name is required';
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email?.trim() || !emailRegex.test(formData.email)) {
            newErrors.email = 'Valid email is required';
            isValid = false;
        }

        // Only validate password if it's provided (optional on edit)
        if (formData.password) {
            if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
                isValid = false;
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Here you would typically send the data to your API
            console.log('Form submitted:', formData);

            // Show confirmation and navigate back
            Alert.alert(
                "Success",
                "User information updated successfully",
                [
                    { text: "OK", onPress: () => router.back() }
                ]
            );
        }
    };

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        });

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: null
            });
        }
    };

    // Update nested address fields
    const handleAddressChange = (field, value) => {
        setFormData({
            ...formData,
            address: {
                ...formData.address,
                [field]: value
            }
        });
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={styles.loadingText}>Loading user data...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#2d3748" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit User</Text>
            </View>

            <Card style={styles.formCard}>
                <Card.Content>
                    <Text style={styles.sectionTitle}>Personal Information</Text>

                    {/* First Name */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>First Name</Text>
                        <TextInput
                            style={[styles.textInput, errors.firstName && styles.inputError]}
                            placeholder="Enter first name"
                            value={formData.firstName}
                            onChangeText={(text) => handleInputChange('firstName', text)}
                        />
                        {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                    </View>

                    {/* Last Name */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Last Name</Text>
                        <TextInput
                            style={[styles.textInput, errors.lastName && styles.inputError]}
                            placeholder="Enter last name"
                            value={formData.lastName}
                            onChangeText={(text) => handleInputChange('lastName', text)}
                        />
                        {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                    </View>

                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput
                            style={[styles.textInput, errors.email && styles.inputError]}
                            placeholder="Enter email address"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    {/* Phone Number */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Phone Number</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter phone number (optional)"
                            keyboardType="phone-pad"
                            value={formData.phone}
                            onChangeText={(text) => handleInputChange('phone', text)}
                        />
                    </View>

                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Address Information</Text>

                    {/* Street Address */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Street Address</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter street address"
                            value={formData.address?.street}
                            onChangeText={(text) => handleAddressChange('street', text)}
                        />
                    </View>

                    {/* City and State (side by side) */}
                    <View style={styles.rowContainer}>
                        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>City</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter city"
                                value={formData.address?.city}
                                onChangeText={(text) => handleAddressChange('city', text)}
                            />
                        </View>
                        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>State</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter state"
                                value={formData.address?.state}
                                onChangeText={(text) => handleAddressChange('state', text)}
                            />
                        </View>
                    </View>

                    {/* Zip Code and Country (side by side) */}
                    <View style={styles.rowContainer}>
                        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>Zip Code</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter zip code"
                                value={formData.address?.zipCode}
                                onChangeText={(text) => handleAddressChange('zipCode', text)}
                            />
                        </View>
                        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>Country</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter country"
                                value={formData.address?.country}
                                onChangeText={(text) => handleAddressChange('country', text)}
                            />
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Account Settings</Text>

                    {/* User Role */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>User Role</Text>
                        <View style={styles.roleContainer}>
                            {roles.map((role) => (
                                <TouchableOpacity
                                    key={role.id}
                                    style={[
                                        styles.roleOption,
                                        formData.role === role.id && styles.roleOptionSelected
                                    ]}
                                    onPress={() => handleInputChange('role', role.id)}
                                >
                                    <Text style={[
                                        styles.roleText,
                                        formData.role === role.id && styles.roleTextSelected
                                    ]}>
                                        {role.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Account Status */}
                    <View style={styles.switchContainer}>
                        <View>
                            <Text style={styles.switchLabel}>Account Status</Text>
                            <Text style={styles.switchSubLabel}>
                                {formData.isActive ? 'Active' : 'Inactive'}
                            </Text>
                        </View>
                        <Switch
                            value={formData.isActive}
                            onValueChange={(value) => handleInputChange('isActive', value)}
                            trackColor={{ false: '#e2e8f0', true: '#d1fae5' }}
                            thumbColor={formData.isActive ? '#3F836E' : '#a0aec0'}
                        />
                    </View>

                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Change Password (Optional)</Text>

                    {/* Password */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>New Password</Text>
                        <TextInput
                            style={[styles.textInput, errors.password && styles.inputError]}
                            placeholder="Leave blank to keep current password"
                            secureTextEntry={true}
                            value={formData.password}
                            onChangeText={(text) => handleInputChange('password', text)}
                        />
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Confirm New Password</Text>
                        <TextInput
                            style={[styles.textInput, errors.confirmPassword && styles.inputError]}
                            placeholder="Confirm new password"
                            secureTextEntry={true}
                            value={formData.confirmPassword}
                            onChangeText={(text) => handleInputChange('confirmPassword', text)}
                        />
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>
                </Card.Content>
            </Card>

            {/* Form Actions */}
            <View style={styles.formActions}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Save Changes</Text>
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
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#718096',
        fontFamily: 'kregular',
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
        fontFamily: 'kbold',
    },
    formCard: {
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 2,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 15,
        fontFamily: 'kbold',
    },
    inputContainer: {
        marginBottom: 16,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4a5568',
        marginBottom: 6,
        fontFamily: 'kbold',
    },
    textInput: {
        backgroundColor: '#f7fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#2d3748',
        fontFamily: 'kregular',
    },
    inputError: {
        borderColor: '#e53e3e',
    },
    errorText: {
        color: '#e53e3e',
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'kregular',
    },
    roleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -5,
    },
    roleOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f7fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    roleOptionSelected: {
        backgroundColor: '#e6fffa',
        borderColor: '#3F836E',
    },
    roleText: {
        fontSize: 14,
        color: '#718096',
        fontFamily: 'kregular',
    },
    roleTextSelected: {
        color: '#3F836E',
        fontWeight: '500',
        fontFamily: 'kbold',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    switchLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4a5568',
        fontFamily: 'kbold',
    },
    switchSubLabel: {
        fontSize: 12,
        color: '#718096',
        marginTop: 2,
        fontFamily: 'kregular',
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 20,
    },
    cancelButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        backgroundColor: 'transparent',
        marginRight: 12,
    },
    cancelButtonText: {
        color: '#4a5568',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'kbold',
    },
    submitButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#3F836E',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'kbold',
    },
});

export default EditUser;