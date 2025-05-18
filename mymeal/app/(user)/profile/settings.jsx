import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Settings() {
    const [settings, setSettings] = useState({
        darkMode: false,
        notifications: true,
        mealReminders: true,
        waterReminders: true,
        weeklyReports: true,
        shareProgress: false,
        metricUnits: false,
    });

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const SettingItem = ({ icon, title, description, isToggled, toggleKey }) => (
        <View className="flex-row items-center justify-between py-4 border-b border-slate-100">
            <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3">
                    <Ionicons name={icon} size={20} color="#3F836E" />
                </View>
                <View className="flex-1">
                    <Text className="text-slate-800 text-base font-kmedium">{title}</Text>
                    {description && <Text className="text-slate-500 text-xs mt-1">{description}</Text>}
                </View>
            </View>
            <Switch
                value={isToggled}
                onValueChange={() => toggleSetting(toggleKey)}
                trackColor={{ false: '#e2e8f0', true: '#3F836E' }}
                thumbColor={'#ffffff'}
            />
        </View>
    );

    const SectionHeader = ({ title }) => (
        <Text className="text-slate-800 text-lg font-kbold mb-2 mt-6">{title}</Text>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-5 pt-4 pb-2 flex-row items-center">
                    <TouchableOpacity
                        className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center mr-3"
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={22} color="#64748b" />
                    </TouchableOpacity>
                    <Text className="text-slate-800 text-2xl font-kbold">Settings</Text>
                </View>

                <View className="px-5">
                    <SectionHeader title="Appearance" />
                    <View className="bg-slate-50 rounded-2xl p-4">
                        <SettingItem
                            icon="contrast-outline"
                            title="Dark Mode"
                            description="Enable dark theme for the app"
                            isToggled={settings.darkMode}
                            toggleKey="darkMode"
                        />
                    </View>

                    <SectionHeader title="Notifications" />
                    <View className="bg-slate-50 rounded-2xl p-4">
                        <SettingItem
                            icon="notifications-outline"
                            title="Push Notifications"
                            description="Enable or disable all notifications"
                            isToggled={settings.notifications}
                            toggleKey="notifications"
                        />
                        <SettingItem
                            icon="restaurant-outline"
                            title="Meal Reminders"
                            description="Get reminders for your meal times"
                            isToggled={settings.mealReminders}
                            toggleKey="mealReminders"
                        />
                        <SettingItem
                            icon="water-outline"
                            title="Water Reminders"
                            description="Get reminders to drink water"
                            isToggled={settings.waterReminders}
                            toggleKey="waterReminders"
                        />
                        <SettingItem
                            icon="bar-chart-outline"
                            title="Weekly Reports"
                            description="Receive weekly progress reports"
                            isToggled={settings.weeklyReports}
                            toggleKey="weeklyReports"
                        />
                    </View>

                    <SectionHeader title="Privacy" />
                    <View className="bg-slate-50 rounded-2xl p-4">
                        <SettingItem
                            icon="share-social-outline"
                            title="Share Progress"
                            description="Allow sharing your progress"
                            isToggled={settings.shareProgress}
                            toggleKey="shareProgress"
                        />
                    </View>

                    <SectionHeader title="Units" />
                    <View className="bg-slate-50 rounded-2xl p-4 mb-8">
                        <SettingItem
                            icon="speedometer-outline"
                            title="Use Metric Units"
                            description="Switch between metric (kg, cm) and imperial (lb, in)"
                            isToggled={settings.metricUnits}
                            toggleKey="metricUnits"
                        />
                    </View>

                    {/* Data management options */}
                    <SectionHeader title="Data Management" />
                    <View className="bg-slate-50 rounded-2xl p-4 mb-20">
                        <TouchableOpacity
                            className="flex-row items-center py-4 border-b border-slate-100"
                            onPress={() => alert('Exporting data...')}
                        >
                            <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3">
                                <Ionicons name="download-outline" size={20} color="#3F836E" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-slate-800 text-base font-kmedium">Export Data</Text>
                                <Text className="text-slate-500 text-xs mt-1">Download all your nutrition data</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center py-4 border-b border-slate-100"
                            onPress={() => alert('Clearing data...')}
                        >
                            <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center mr-3">
                                <Ionicons name="trash-bin-outline" size={20} color="#ef4444" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-slate-800 text-base font-kmedium">Clear Data</Text>
                                <Text className="text-slate-500 text-xs mt-1">Reset all your nutrition tracking data</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center py-4"
                            onPress={() => alert('This will delete your account permanently!')}
                        >
                            <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center mr-3">
                                <Ionicons name="close-circle-outline" size={20} color="#ef4444" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-red-500 text-base font-kmedium">Delete Account</Text>
                                <Text className="text-slate-500 text-xs mt-1">Permanently delete your account and data</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}