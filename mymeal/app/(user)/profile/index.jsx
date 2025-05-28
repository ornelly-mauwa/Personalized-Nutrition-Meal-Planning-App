
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGlobalContext } from "../../../context/GlobalProvider";



export default function Profile() {
    const userInfo = {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        joinDate: 'May 2025',
        profilePic: 'https://placehold.co/400x400',
        height: '5\'7"',
        weight: '163 lbs',
        goal: 'Weight Loss',
        targetWeight: '160 lbs',
        streak: 14,
    };

    const MenuItem = ({ icon, title, onPress, showBadge = false, hasArrow = true }) => (
        <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-slate-100"
            onPress={onPress}
        >
            <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3">
                    <Ionicons name={icon} size={22} color="#3F836E" />
                </View>
                <Text className="text-slate-800 text-base font-kmedium">{title}</Text>
            </View>
            <View className="flex-row items-center">
                {showBadge && (
                    <View className="bg-red-500 rounded-full w-6 h-6 items-center justify-center mr-2">
                        <Text className="text-white text-xs font-kbold">2</Text>
                    </View>
                )}
                {hasArrow && <Ionicons name="chevron-forward" size={20} color="#94a3b8" />}
            </View>
        </TouchableOpacity>
    );
    const { logout } = useGlobalContext();

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
    // Logout button component


    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-5 pt-4 pb-2 flex-row justify-between items-center">
                    <Text className="text-slate-800 text-2xl font-kbold">Profile</Text>
                    <TouchableOpacity
                        className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center"
                        onPress={() => router.push('/profile/settings')}
                    >
                        <Ionicons name="settings-outline" size={22} color="#64748b" />
                    </TouchableOpacity>
                </View>

                {/* Profile Card */}
                <View className="mx-5 mt-4 p-5 bg-slate-50 rounded-2xl">
                    <View className="flex-row items-center">
                        <Image
                            source={{ uri: userInfo.profilePic }}
                            className="w-20 h-20 rounded-full bg-slate-200"
                        />
                        <View className="ml-4">
                            <Text className="text-slate-800 text-xl font-kbold">{userInfo.name}</Text>
                            <Text className="text-slate-500 text-sm">{userInfo.email}</Text>
                            <View className="flex-row items-center mt-1">
                                <Ionicons name="calendar-outline" size={14} color="#64748b" />
                                <Text className="text-slate-500 text-xs ml-1">Member since {userInfo.joinDate}</Text>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row mt-5 bg-white p-3 rounded-xl justify-between">
                        <View className="items-center flex-1">
                            <Text className="text-slate-500 text-xs font-kmedium">Height</Text>
                            <Text className="text-slate-800 text-base font-kbold mt-1">{userInfo.height}</Text>
                        </View>
                        <View className="items-center flex-1 border-x border-slate-100">
                            <Text className="text-slate-500 text-xs font-kmedium">Weight</Text>
                            <Text className="text-slate-800 text-base font-kbold mt-1">{userInfo.weight}</Text>
                        </View>
                        <View className="items-center flex-1">
                            <Text className="text-slate-500 text-xs font-kmedium">Goal</Text>
                            <Text className="text-slate-800 text-base font-kbold mt-1">{userInfo.goal}</Text>
                        </View>
                    </View>

                    <View className="mt-4 flex-row items-center justify-between bg-[#3F836E] p-3 rounded-xl">
                        <View>
                            <Text className="text-white text-xs font-kmedium">Current Streak</Text>
                            <Text className="text-white text-xl font-kbold">{userInfo.streak} days</Text>
                        </View>
                        <View className="w-10 h-10 bg-white bg-opacity-20 rounded-full items-center justify-center">
                            <Ionicons name="flame" size={22} color="white" />
                        </View>
                    </View>
                </View>

                {/* Menu Items */}
                <View className="mx-5 mt-6">
                    <Text className="text-slate-800 text-lg font-kbold mb-2">Account</Text>

                    <View className="bg-slate-50 rounded-2xl p-4">
                        <MenuItem
                            icon="person-outline"
                            title="Personal Information"
                            onPress={() => router.push('/profile/personal-info')}
                        />
                        <MenuItem
                            icon="barbell-outline"
                            title="Fitness Goals"
                            onPress={() => router.push('/profile/fitness-goals')}
                        />
                        <MenuItem
                            icon="restaurant-outline"
                            title="Dietary Preferences"
                            onPress={() => router.push('/profile/dietary-prefs')}
                        />
                        <MenuItem
                            icon="notifications-outline"
                            title="Notifications"
                            onPress={() => router.push('/profile/notifications')}
                            showBadge={true}
                        />
                        <MenuItem
                            icon="heart-outline"
                            title="Saved Meals"
                            onPress={() => router.push('/meal-plan/favorites')}
                        />
                    </View>
                </View>

                <View className="mx-5 mt-6">
                    <Text className="text-slate-800 text-lg font-kbold mb-2">Other</Text>

                    <View className="bg-slate-50 rounded-2xl p-4 mb-20">
                        <MenuItem
                            icon="help-circle-outline"
                            title="Help & Support"
                            onPress={() => router.push('/profile/help')}
                        />
                        <MenuItem
                            icon="information-circle-outline"
                            title="About"
                            onPress={() => router.push('/profile/about')}
                        />
                        <MenuItem
                            icon="shield-checkmark-outline"
                            title="Privacy Policy"
                            onPress={() => router.push('/profile/privacy')}
                        />
                        <MenuItem
                            icon="log-out-outline"
                            title="Log Out"
                            onPress={() => {
                                alert('Logging out...');
                                onLogout();
                            }}
                            hasArrow={false}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}