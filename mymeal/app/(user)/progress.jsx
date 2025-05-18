
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'recharts';

export default function Progress() {
    const [activeTimeframe, setActiveTimeframe] = useState('week');
    const [activeMetric, setActiveMetric] = useState('weight');

    // Sample data for charts
    const weightData = [
        { name: 'Mon', value: 165 },
        { name: 'Tue', value: 164.5 },
        { name: 'Wed', value: 164.2 },
        { name: 'Thu', value: 163.7 },
        { name: 'Fri', value: 163.5 },
        { name: 'Sat', value: 163.3 },
        { name: 'Sun', value: 163 },
    ];

    const calorieData = [
        { name: 'Mon', value: 1950 },
        { name: 'Tue', value: 1850 },
        { name: 'Wed', value: 2100 },
        { name: 'Thu', value: 1750 },
        { name: 'Fri', value: 1900 },
        { name: 'Sat', value: 2200 },
        { name: 'Sun', value: 1800 },
    ];

    const proteinData = [
        { name: 'Mon', value: 110 },
        { name: 'Tue', value: 95 },
        { name: 'Wed', value: 120 },
        { name: 'Thu', value: 90 },
        { name: 'Fri', value: 105 },
        { name: 'Sat', value: 125 },
        { name: 'Sun', value: 100 },
    ];

    // Return appropriate data based on active metric
    const getChartData = () => {
        switch (activeMetric) {
            case 'weight':
                return weightData;
            case 'calories':
                return calorieData;
            case 'protein':
                return proteinData;
            default:
                return weightData;
        }
    };

    // Timeframe pill selector
    const TimeframePill = ({ title, value }) => (
        <TouchableOpacity
            className={`px-4 py-2 rounded-full ${activeTimeframe === value ? 'bg-[#3F836E]' : 'bg-slate-100'}`}
            onPress={() => setActiveTimeframe(value)}
        >
            <Text
                className={`text-sm font-kmedium ${activeTimeframe === value ? 'text-white' : 'text-slate-600'}`}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );

    // Metric selector
    const MetricButton = ({ title, value, icon }) => (
        <TouchableOpacity
            className={`flex-1 p-3 rounded-xl items-center ${activeMetric === value ? 'bg-[#3F836E]' : 'bg-slate-100'}`}
            onPress={() => setActiveMetric(value)}
        >
            <Ionicons
                name={icon}
                size={22}
                color={activeMetric === value ? 'white' : '#64748b'}
            />
            <Text
                className={`text-sm font-kmedium mt-1 ${activeMetric === value ? 'text-white' : 'text-slate-600'}`}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-5 pt-4 pb-2">
                    <Text className="text-slate-800 text-2xl font-kbold">Progress</Text>
                    <Text className="text-slate-500 text-base font-kregular">Track your health and fitness journey</Text>
                </View>

                {/* Timeframe selector */}
                <View className="px-5 mt-2">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
                        <View className="flex-row space-x-2 py-2">
                            <TimeframePill title="Week" value="week" />
                            <TimeframePill title="Month" value="month" />
                            <TimeframePill title="3 Months" value="3months" />
                            <TimeframePill title="Year" value="year" />
                            <TimeframePill title="All Time" value="all" />
                        </View>
                    </ScrollView>
                </View>

                {/* Metrics selector */}
                <View className="px-5 mt-3 flex-row space-x-3">
                    <MetricButton title="Weight" value="weight" icon="scale-outline" />
                    <MetricButton title="Calories" value="calories" icon="flame-outline" />
                    <MetricButton title="Protein" value="protein" icon="fitness-outline" />
                </View>

                {/* Chart */}
                <View className="mx-5 mt-6 p-5 bg-slate-50 rounded-2xl">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-slate-800 text-lg font-kbold">
                            {activeMetric === 'weight' ? 'Weight Trend' :
                                activeMetric === 'calories' ? 'Calorie Intake' : 'Protein Intake'}
                        </Text>
                        <View className="flex-row items-center">
                            <Text className="text-slate-500 text-sm font-kmedium">
                                {activeMetric === 'weight' ? '-2 lbs' :
                                    activeMetric === 'calories' ? 'Avg: 1936 kcal' : 'Avg: 106g'}
                            </Text>
                            <Ionicons
                                name={activeMetric === 'weight' ? 'arrow-down-outline' : 'analytics-outline'}
                                size={16}
                                color={activeMetric === 'weight' ? '#3F836E' : '#64748b'}
                                style={{ marginLeft: 4 }}
                            />
                        </View>
                    </View>

                    {/* Chart placeholder - would be replaced by actual recharts implementation */}
                    <View className="h-60 w-full bg-white rounded-xl items-center justify-center">
                        {/* This would be your actual LineChart from recharts */}
                        <Text className="text-slate-400">Chart visualization goes here</Text>
                        <Text className="text-slate-400 text-xs mt-1">Using sample data for {activeMetric}</Text>
                    </View>

                    <View className="mt-3 flex-row justify-between">
                        {getChartData().map((item, index) => (
                            <Text key={index} className="text-slate-500 text-xs">{item.name}</Text>
                        ))}
                    </View>
                </View>

                {/* Stats cards */}
                <View className="px-5 mt-6">
                    <Text className="text-slate-800 text-lg font-kbold mb-3">Stats</Text>

                    <View className="flex-row space-x-3 mb-3">
                        <View className="flex-1 p-4 bg-amber-50 rounded-2xl">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-slate-800 font-kbold">Starting</Text>
                                <Ionicons name="flag-outline" size={20} color="#f59e0b" />
                            </View>
                            <Text className="text-slate-800 text-2xl font-kbold mt-2">
                                {activeMetric === 'weight' ? '170 lbs' :
                                    activeMetric === 'calories' ? '2400 kcal' : '80g'}
                            </Text>
                            <Text className="text-slate-500 text-xs mt-1">May 1, 2025</Text>
                        </View>

                        <View className="flex-1 p-4 bg-blue-50 rounded-2xl">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-slate-800 font-kbold">Current</Text>
                                <Ionicons name="today-outline" size={20} color="#3b82f6" />
                            </View>
                            <Text className="text-slate-800 text-2xl font-kbold mt-2">
                                {activeMetric === 'weight' ? '163 lbs' :
                                    activeMetric === 'calories' ? '1800 kcal' : '106g'}
                            </Text>
                            <Text className="text-slate-500 text-xs mt-1">May 18, 2025</Text>
                        </View>
                    </View>

                    <View className="flex-row space-x-3 mb-20">
                        <View className="flex-1 p-4 bg-green-50 rounded-2xl">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-slate-800 font-kbold">Goal</Text>
                                <Ionicons name="trophy-outline" size={20} color="#10b981" />
                            </View>
                            <Text className="text-slate-800 text-2xl font-kbold mt-2">
                                {activeMetric === 'weight' ? '160 lbs' :
                                    activeMetric === 'calories' ? '2000 kcal' : '120g'}
                            </Text>
                            <Text className="text-slate-500 text-xs mt-1">
                                {activeMetric === 'weight' ? '3 lbs to go' :
                                    activeMetric === 'calories' ? 'Daily target' : 'Daily target'}
                            </Text>
                        </View>

                        <View className="flex-1 p-4 bg-purple-50 rounded-2xl">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-slate-800 font-kbold">Change</Text>
                                <Ionicons name="trending-down-outline" size={20} color="#8b5cf6" />
                            </View>
                            <Text className="text-slate-800 text-2xl font-kbold mt-2">
                                {activeMetric === 'weight' ? '-7 lbs' :
                                    activeMetric === 'calories' ? '-600 kcal' : '+26g'}
                            </Text>
                            <Text className="text-slate-500 text-xs mt-1">Total change</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}