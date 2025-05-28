import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Switch,
    Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { Redirect, router, Link } from "expo-router";

import { icons } from "../../constants";
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const Profile = () => {

    const { user, loading, updateUser, logout } = useGlobalContext();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        specialization: "",
        bio: "",
        profileImage: null,
        notificationsEnabled: true,
        availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: false,
            sunday: false
        }
    });

    const onLogout = async () => {
        try {
            await logout();
            // Redirect to welcome/login screen
            router.replace("/");
        } catch (error) {
            console.error("Logout failed:", error);
            // Optionally show error message to user
            alert("Failed to logout. Please try again.");
        }
    };

    useEffect(() => {
        if (user) {
            // In a real app, you would fetch the complete profile data
            setProfileData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                specialization: user.specialization || "Weight Management",
                bio: user.bio || "Certified nutritionist with 5+ years of experience helping clients achieve their health goals through personalized nutrition plans.",
                profileImage: user.profileImage || null,
                notificationsEnabled: user.notificationsEnabled !== undefined ? user.notificationsEnabled : true,
                availability: user.availability || {
                    monday: true,
                    tuesday: true,
                    wednesday: true,
                    thursday: true,
                    friday: true,
                    saturday: false,
                    sunday: false
                }
            });
        }
    }, [user]);

    const handleSaveProfile = async () => {
        try {
            // In a real app, this would make an API call to update the profile
            await updateUser(profileData);
            setIsEditing(false);
            Alert.alert("Success", "Profile updated successfully");
        } catch (error) {
            Alert.alert("Error", "Failed to update profile. Please try again.");
            console.error(error);
        }
    };


    const handlePickImage = async () => {
        if (!isEditing) return;

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "You need to grant access to your photos to change profile picture.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileData({
                ...profileData,
                profileImage: result.assets[0].uri
            });
        }
    };

    const toggleAvailability = (day) => {
        if (!isEditing) return;

        setProfileData({
            ...profileData,
            availability: {
                ...profileData.availability,
                [day]: !profileData.availability[day]
            }
        });
    };


    if (loading) return <Loader isLoading={loading} />;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-4 pt-6 pb-4 flex-row justify-between items-center">
                    <Text className="text-2xl font-kbold text-gray-800">Profile</Text>
                    <TouchableOpacity
                        onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                        className={`px-4 py-2 rounded-lg ${isEditing ? 'bg-green-500' : 'bg-blue-500'}`}
                    >
                        <Text className="text-white font-kmedium">{isEditing ? 'Save' : 'Edit'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Profile Image */}
                <View className="items-center my-4">
                    <TouchableOpacity onPress={handlePickImage}>
                        <View className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden">
                            {profileData.profileImage ? (
                                <Image
                                    source={{ uri: profileData.profileImage }}
                                    className="w-full h-full"
                                />
                            ) : (
                                <View className="w-full h-full items-center justify-center">
                                    <Text className="text-4xl font-kbold text-gray-400">
                                        {profileData.firstName.charAt(0)}
                                        {profileData.lastName.charAt(0)}
                                    </Text>
                                </View>
                            )}
                        </View>
                        {isEditing && (
                            <View className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full">
                                <Image source={icons.camera} className="w-4 h-4" tintColor="#ffffff" />
                            </View>
                        )}
                    </TouchableOpacity>
                    <Text className="mt-2 text-xl font-kbold">
                        {profileData.firstName} {profileData.lastName}
                    </Text>
                    <Text className="text-gray-500">{profileData.specialization}</Text>
                </View>

                {/* Personal Information */}
                <View className="px-4 py-4">
                    <Text className="text-lg font-kbold text-gray-800 mb-3">Personal Information</Text>

                    <View className="mb-4">
                        <Text className="text-gray-500 font-kmedium mb-1">First Name</Text>
                        <TextInput
                            value={profileData.firstName}
                            onChangeText={(text) => setProfileData({ ...profileData, firstName: text })}
                            editable={isEditing}
                            className={`border p-3 rounded-lg ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50'}`}
                            placeholder="First Name"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-500 font-kmedium mb-1">Last Name</Text>
                        <TextInput
                            value={profileData.lastName}
                            onChangeText={(text) => setProfileData({ ...profileData, lastName: text })}
                            editable={isEditing}
                            className={`border p-3 rounded-lg ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50'}`}
                            placeholder="Last Name"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-500 font-kmedium mb-1">Email</Text>
                        <TextInput
                            value={profileData.email}
                            onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                            editable={isEditing}
                            keyboardType="email-address"
                            className={`border p-3 rounded-lg ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50'}`}
                            placeholder="Email Address"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-500 font-kmedium mb-1">Phone</Text>
                        <TextInput
                            value={profileData.phone}
                            onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
                            editable={isEditing}
                            keyboardType="phone-pad"
                            className={`border p-3 rounded-lg ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50'}`}
                            placeholder="Phone Number"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-500 font-kmedium mb-1">Specialization</Text>
                        <TextInput
                            value={profileData.specialization}
                            onChangeText={(text) => setProfileData({ ...profileData, specialization: text })}
                            editable={isEditing}
                            className={`border p-3 rounded-lg ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50'}`}
                            placeholder="Specialization"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-500 font-kmedium mb-1">Bio</Text>
                        <TextInput
                            value={profileData.bio}
                            onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
                            editable={isEditing}
                            multiline={true}
                            numberOfLines={4}
                            className={`border p-3 rounded-lg ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50'} min-h-[100px]`}
                            placeholder="Tell clients about yourself..."
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Availability Settings */}
                <View className="px-4 py-4">
                    <Text className="text-lg font-kbold text-gray-800 mb-3">Availability</Text>

                    {Object.keys(profileData.availability).map((day) => (
                        <View key={day} className="flex-row justify-between items-center py-3 border-b border-gray-100">
                            <Text className="font-kmedium capitalize">{day}</Text>
                            <Switch
                                trackColor={{ false: "#E5E7EB", true: "#3F836E" }}
                                thumbColor={profileData.availability[day] ? "#ffffff" : "#f4f3f4"}
                                ios_backgroundColor="#E5E7EB"
                                onValueChange={() => toggleAvailability(day)}
                                value={profileData.availability[day]}
                                disabled={!isEditing}
                            />
                        </View>
                    ))}
                </View>

                {/* Notifications */}
                <View className="px-4 py-4">
                    <Text className="text-lg font-kbold text-gray-800 mb-3">Notifications</Text>
                    <View className="flex-row justify-between items-center py-3">
                        <Text className="font-kmedium">Enable Notifications</Text>
                        <Switch
                            trackColor={{ false: "#E5E7EB", true: "#3F836E" }}
                            thumbColor={profileData.notificationsEnabled ? "#ffffff" : "#f4f3f4"}
                            ios_backgroundColor="#E5E7EB"
                            onValueChange={() => {
                                if (isEditing) {
                                    setProfileData({
                                        ...profileData,
                                        notificationsEnabled: !profileData.notificationsEnabled
                                    })
                                }
                            }}
                            value={profileData.notificationsEnabled}
                            disabled={!isEditing}
                        />
                    </View>
                </View>

                {/* Account Actions */}
                <View className="px-4 py-4 mb-6">
                    <TouchableOpacity
                        className="bg-red-50 py-4 rounded-lg items-center"
                        onPress={() => {
                            alert('Logging out...');
                            onLogout();
                        }}
                    >
                        <Text className="text-red-600 font-kbold">Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;