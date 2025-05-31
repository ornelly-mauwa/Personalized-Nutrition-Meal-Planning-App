import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGlobalContext } from '../../../context/GlobalProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenManager } from '../../../lib/api';

export default function PersonalInfoScreen() {
    const { user, createProfile, getToken } = useGlobalContext();
    const [formData, setFormData] = useState({
        age: '',
        weight: '',
        height: '',
        gender: '',
        goalCalories: '',
        goalProtein: '',
        goalCarbs: '',
        goalFats: '',
        allergies: [],
        goals: '',
        activityLevel: '',
        dietPreferences: []
    });

    const [errors, setErrors] = useState({});
    const [currentAllergyInput, setCurrentAllergyInput] = useState('');

    const activityLevels = [
        { id: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
        { id: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
        { id: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
        { id: 'active', label: 'Active', description: 'Hard exercise 6-7 days/week' },
        { id: 'very-active', label: 'Very Active', description: 'Very hard exercise, physical job' }
    ];

    const commonAllergies = [
        'Nuts', 'Dairy', 'Eggs', 'Soy', 'Gluten', 'Shellfish', 'Fish', 'Sesame'
    ];

    const dietPreferenceOptions = [
        'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean',
        'Low Carb', 'High Protein', 'Gluten Free', 'Dairy Free'
    ];

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAllergyAdd = (allergy) => {
        if (allergy && !formData.allergies.includes(allergy)) {
            setFormData(prev => ({
                ...prev,
                allergies: [...prev.allergies, allergy]
            }));
        }
        setCurrentAllergyInput('');
    };

    const handleAllergyRemove = (allergyToRemove) => {
        setFormData(prev => ({
            ...prev,
            allergies: prev.allergies.filter(allergy => allergy !== allergyToRemove)
        }));
    };

    const handleDietPreferenceToggle = (preference) => {
        setFormData(prev => ({
            ...prev,
            dietPreferences: prev.dietPreferences.includes(preference)
                ? prev.dietPreferences.filter(p => p !== preference)
                : [...prev.dietPreferences, preference]
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
            newErrors.age = 'Please enter a valid age (1-120)';
        }
        if (!formData.weight || parseFloat(formData.weight) < 1 || parseFloat(formData.weight) > 1000) {
            newErrors.weight = 'Please enter a valid weight';
        }
        if (!formData.height || parseFloat(formData.height) < 1 || parseFloat(formData.height) > 300) {
            newErrors.height = 'Please enter a valid height';
        }
        if (!formData.gender) {
            newErrors.gender = 'Please select your gender';
        }
        if (!formData.activityLevel) {
            newErrors.activityLevel = 'Please select your activity level';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                // Fix: Use getItem instead of getToken
                const token = await tokenManager.getToken();
                console.log('=== PRE-REQUEST DEBUG ===');
                console.log('User object:', user);
                console.log('Token available:', !!token);

                if (!token) {
                    Alert.alert(
                        'Authentication Required',
                        'Please log in to create a profile.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    navigation.navigate('Login');
                                }
                            }
                        ]
                    );
                    return;
                }

                console.log('Profile Data:', formData);
                const result = await createProfile(formData);
                Alert.alert('Success', 'Profile created successfully!');

            } catch (error) {
                console.error('Profile creation error:', error);

                if (error.message.includes('No authentication token') ||
                    error.message.includes('No token provided')) {
                    Alert.alert(
                        'Authentication Error',
                        'Please log in again to continue.',
                        [
                            {
                                text: 'Login',
                                onPress: () => navigation.navigate('Login')
                            }
                        ]
                    );
                } else {
                    Alert.alert('Error', `Failed to create profile: ${error.message}`);
                }
            }
        } else {
            Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
        }
    };

    const MenuItem = ({ icon, title, onPress, selected = false, type = 'radio' }) => (
        <TouchableOpacity
            className={`flex-row items-center justify-between py-4 ${selected ? 'bg-white' : ''} rounded-xl mb-1`}
            onPress={onPress}
        >
            <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3">
                    <Ionicons name={icon} size={22} color="#3F836E" />
                </View>
                <Text className="text-slate-800 text-base font-kmedium flex-1">{title}</Text>
            </View>
            <View className="w-6 h-6 rounded-full border-2 border-slate-300 items-center justify-center">
                {selected && (
                    <View className="w-3 h-3 rounded-full bg-[#3F836E]" />
                )}
            </View>
        </TouchableOpacity>
    );

    const AllergyTag = ({ allergy, onRemove }) => (
        <View className="bg-red-100 px-3 py-2 rounded-lg flex-row items-center mr-2 mb-2">
            <Text className="text-red-800 text-sm font-kmedium">{allergy}</Text>
            <TouchableOpacity onPress={onRemove} className="ml-2">
                <Text className="text-red-600 text-lg font-bold">×</Text>
            </TouchableOpacity>
        </View>
    );

    const DietPreferenceItem = ({ preference, selected, onToggle }) => (
        <TouchableOpacity
            className={`flex-row items-center p-3 rounded-xl border mb-2 ${selected ? 'bg-[#3F836E] border-[#3F836E]' : 'bg-white border-slate-100'
                }`}
            onPress={onToggle}
        >
            <View className={`w-6 h-6 rounded border-2 items-center justify-center mr-3 ${selected ? 'border-white bg-white' : 'border-slate-300'
                }`}>
                {selected && <Ionicons name="checkmark" size={16} color="#3F836E" />}
            </View>
            <Text className={`text-base font-kmedium ${selected ? 'text-white' : 'text-slate-800'}`}>
                {preference}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-5 pt-4 pb-2 flex-row justify-between items-center">
                    <Text className="text-slate-800 text-2xl font-kbold">Personal Information</Text>
                    <TouchableOpacity
                        className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center"
                        onPress={() => router.back()}
                    >
                        <Ionicons name="close" size={22} color="#64748b" />
                    </TouchableOpacity>
                </View>

                {/* Basic Information */}
                <View className="mx-5 mt-4">
                    <Text className="text-slate-800 text-lg font-kbold mb-2">Basic Information</Text>
                    <View className="bg-slate-50 rounded-2xl p-4">
                        {/* Age, Weight, Height Row */}
                        <View className="flex-row justify-between mb-4">
                            <View className="flex-1 mr-2">
                                <Text className="text-slate-500 text-xs font-kmedium mb-2 uppercase">Age *</Text>
                                <TextInput
                                    value={formData.age}
                                    onChangeText={(value) => handleInputChange('age', value)}
                                    placeholder="25"
                                    keyboardType="numeric"
                                    className={`bg-white p-3 rounded-xl text-slate-800 font-kmedium ${errors.age ? 'border border-red-300' : ''
                                        }`}
                                />
                                {errors.age && <Text className="text-red-500 text-xs mt-1">{errors.age}</Text>}
                            </View>

                            <View className="flex-1 mx-1">
                                <Text className="text-slate-500 text-xs font-kmedium mb-2 uppercase">Weight (kg) *</Text>
                                <TextInput
                                    value={formData.weight}
                                    onChangeText={(value) => handleInputChange('weight', value)}
                                    placeholder="70"
                                    keyboardType="numeric"
                                    className={`bg-white p-3 rounded-xl text-slate-800 font-kmedium ${errors.weight ? 'border border-red-300' : ''
                                        }`}
                                />
                                {errors.weight && <Text className="text-red-500 text-xs mt-1">{errors.weight}</Text>}
                            </View>

                            <View className="flex-1 ml-2">
                                <Text className="text-slate-500 text-xs font-kmedium mb-2 uppercase">Height (cm) *</Text>
                                <TextInput
                                    value={formData.height}
                                    onChangeText={(value) => handleInputChange('height', value)}
                                    placeholder="175"
                                    keyboardType="numeric"
                                    className={`bg-white p-3 rounded-xl text-slate-800 font-kmedium ${errors.height ? 'border border-red-300' : ''
                                        }`}
                                />
                                {errors.height && <Text className="text-red-500 text-xs mt-1">{errors.height}</Text>}
                            </View>
                        </View>

                        {/* Gender Selection */}
                        <Text className="text-slate-500 text-xs font-kmedium mb-3 uppercase">Gender *</Text>
                        <View className="flex-row justify-between mb-2">
                            {['male', 'female', 'other'].map((gender) => (
                                <TouchableOpacity
                                    key={gender}
                                    className={`flex-1 p-3 rounded-xl border mx-1 ${formData.gender === gender ? 'bg-[#3F836E] border-[#3F836E]' : 'bg-white border-slate-100'
                                        }`}
                                    onPress={() => handleInputChange('gender', gender)}
                                >
                                    <Text className={`text-center font-kmedium capitalize ${formData.gender === gender ? 'text-white' : 'text-slate-800'
                                        }`}>
                                        {gender}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {errors.gender && <Text className="text-red-500 text-xs mt-1">{errors.gender}</Text>}
                    </View>
                </View>

                {/* Nutrition Goals */}
                <View className="mx-5 mt-6">
                    <Text className="text-slate-800 text-lg font-kbold mb-2">Nutrition Goals</Text>
                    <View className="bg-slate-50 rounded-2xl p-4">
                        <View className="flex-row flex-wrap justify-between">
                            <View className="w-[48%] mb-4">
                                <Text className="text-slate-500 text-xs font-kmedium mb-2 uppercase">Calories</Text>
                                <TextInput
                                    value={formData.goalCalories}
                                    onChangeText={(value) => handleInputChange('goalCalories', value)}
                                    placeholder="2000"
                                    keyboardType="numeric"
                                    className="bg-white p-3 rounded-xl text-slate-800 font-kmedium"
                                />
                            </View>

                            <View className="w-[48%] mb-4">
                                <Text className="text-slate-500 text-xs font-kmedium mb-2 uppercase">Protein (g)</Text>
                                <TextInput
                                    value={formData.goalProtein}
                                    onChangeText={(value) => handleInputChange('goalProtein', value)}
                                    placeholder="150"
                                    keyboardType="numeric"
                                    className="bg-white p-3 rounded-xl text-slate-800 font-kmedium"
                                />
                            </View>

                            <View className="w-[48%] mb-4">
                                <Text className="text-slate-500 text-xs font-kmedium mb-2 uppercase">Carbs (g)</Text>
                                <TextInput
                                    value={formData.goalCarbs}
                                    onChangeText={(value) => handleInputChange('goalCarbs', value)}
                                    placeholder="250"
                                    keyboardType="numeric"
                                    className="bg-white p-3 rounded-xl text-slate-800 font-kmedium"
                                />
                            </View>

                            <View className="w-[48%] mb-4">
                                <Text className="text-slate-500 text-xs font-kmedium mb-2 uppercase">Fats (g)</Text>
                                <TextInput
                                    value={formData.goalFats}
                                    onChangeText={(value) => handleInputChange('goalFats', value)}
                                    placeholder="65"
                                    keyboardType="numeric"
                                    className="bg-white p-3 rounded-xl text-slate-800 font-kmedium"
                                />
                            </View>
                        </View>

                        <Text className="text-slate-500 text-xs font-kmedium mb-2 uppercase">Health Goals</Text>
                        <TextInput
                            value={formData.goals}
                            onChangeText={(value) => handleInputChange('goals', value)}
                            placeholder="Describe your health and fitness goals..."
                            multiline
                            numberOfLines={4}
                            className="bg-white p-3 rounded-xl text-slate-800 font-kmedium"
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Activity Level */}
                <View className="mx-5 mt-6">
                    <Text className="text-slate-800 text-lg font-kbold mb-2">Activity Level</Text>
                    <View className="bg-slate-50 rounded-2xl p-4">
                        {activityLevels.map((level, index) => (
                            <View key={level.id}>
                                <MenuItem
                                    icon="fitness-outline"
                                    title={`${level.label} - ${level.description}`}
                                    selected={formData.activityLevel === level.id}
                                    onPress={() => handleInputChange('activityLevel', level.id)}
                                />
                                {index < activityLevels.length - 1 && <View className="border-b border-slate-100 mx-4" />}
                            </View>
                        ))}
                        {errors.activityLevel && <Text className="text-red-500 text-xs mt-2">{errors.activityLevel}</Text>}
                    </View>
                </View>

                {/* Allergies */}
                <View className="mx-5 mt-6">
                    <Text className="text-slate-800 text-lg font-kbold mb-2">Food Allergies</Text>
                    <View className="bg-slate-50 rounded-2xl p-4">
                        <Text className="text-slate-500 text-xs font-kmedium mb-3 uppercase">Common Allergies</Text>
                        <View className="flex-row flex-wrap mb-4">
                            {commonAllergies.map((allergy) => (
                                <TouchableOpacity
                                    key={allergy}
                                    className={`px-3 py-2 rounded-lg mr-2 mb-2 ${formData.allergies.includes(allergy)
                                        ? 'bg-red-100 border border-red-200'
                                        : 'bg-white border border-slate-100'
                                        }`}
                                    onPress={() => handleAllergyAdd(allergy)}
                                >
                                    <Text className={`text-sm font-kmedium ${formData.allergies.includes(allergy) ? 'text-red-800' : 'text-slate-700'
                                        }`}>
                                        {allergy}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View className="flex-row">
                            <TextInput
                                value={currentAllergyInput}
                                onChangeText={setCurrentAllergyInput}
                                placeholder="Add custom allergy..."
                                className="flex-1 bg-white p-3 rounded-xl text-slate-800 font-kmedium mr-2"
                            />
                            <TouchableOpacity
                                className="bg-[#3F836E] px-4 py-3 rounded-xl items-center justify-center"
                                onPress={() => handleAllergyAdd(currentAllergyInput)}
                            >
                                <Text className="text-white font-kbold">Add</Text>
                            </TouchableOpacity>
                        </View>

                        {formData.allergies.length > 0 && (
                            <View className="mt-4">
                                <Text className="text-slate-500 text-xs font-kmedium mb-2 uppercase">Your Allergies</Text>
                                <View className="flex-row flex-wrap">
                                    {formData.allergies.map((allergy) => (
                                        <AllergyTag
                                            key={allergy}
                                            allergy={allergy}
                                            onRemove={() => handleAllergyRemove(allergy)}
                                        />
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {/* Diet Preferences */}
                <View className="mx-5 mt-6">
                    <Text className="text-slate-800 text-lg font-kbold mb-2">Diet Preferences</Text>
                    <View className="bg-slate-50 rounded-2xl p-4">
                        {dietPreferenceOptions.map((preference) => (
                            <DietPreferenceItem
                                key={preference}
                                preference={preference}
                                selected={formData.dietPreferences.includes(preference)}
                                onToggle={() => handleDietPreferenceToggle(preference)}
                            />
                        ))}
                    </View>
                </View>

                {/* Submit Button */}
                <View className="mx-5 mt-8 mb-10">
                    <TouchableOpacity
                        className="bg-[#3F836E] py-4 rounded-2xl items-center"
                        onPress={handleSubmit}
                    >
                        <Text className="text-white text-lg font-kbold">Save Profile</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}