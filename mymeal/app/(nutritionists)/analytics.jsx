import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, COLORS } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';

// Placeholder data for analytics overview
const ANALYTICS_DATA = {
    activeClients: 12,
    totalMealPlans: 28,
    averageWeightLoss: 3.4,
    mostPopularNutrient: 'Protein',
    clientCompliance: 87,
    dietaryPreferences: [
        { name: 'Balanced', percentage: 45 },
        { name: 'Low Carb', percentage: 28 },
        { name: 'Vegetarian', percentage: 15 },
        { name: 'High Protein', percentage: 12 },
    ],
    nutritionDistribution: [
        { name: 'Protein', percentage: 32 },
        { name: 'Carbs', percentage: 45 },
        { name: 'Fats', percentage: 23 },
    ],
    monthlyProgress: [
        { month: 'Jan', weightLoss: 2.8 },
        { month: 'Feb', weightLoss: 3.2 },
        { month: 'Mar', weightLoss: 2.9 },
        { month: 'Apr', weightLoss: 3.6 },
        { month: 'May', weightLoss: 3.4 },
    ]
};

const ProgressBar = ({ percentage, color }) => {
    return (
        <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <View
                className={`h-full ${color || 'bg-green-500'}`}
                style={{ width: `${percentage}%` }}
            />
        </View>
    );
};

const StatCard = ({ title, value, icon, bgColor }) => {
    return (
        <View className={`p-4 rounded-xl ${bgColor || 'bg-white'} shadow-sm flex-1 mr-4`}>
            <View className="flex-row justify-between items-center mb-2">
                <Text className="font-kmedium text-xs text-gray-600">{title}</Text>
                <Image source={icon} className="w-6 h-6" resizeMode="contain" />
            </View>
            <Text className="font-kbold text-xl text-gray-800">{value}</Text>
        </View>
    );
};

const Analytics = () => {
    const { userInfo } = useGlobalContext();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'year'

    useEffect(() => {
        // Simulate API fetch
        const fetchData = async () => {
            try {
                // In a real app, this would be an API call
                setTimeout(() => {
                    setData(ANALYTICS_DATA);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Failed to fetch analytics data:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text className="mt-4 font-kmedium text-gray-600">Loading analytics...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-100">
                <View>
                    <Text className="font-kbold text-2xl text-gray-800">Analytics</Text>
                    <Text className="font-kregular text-sm text-gray-500">Insights and performance data</Text>
                </View>
                <TouchableOpacity>
                    <Image
                        source={icons.notification}
                        className="w-6 h-6"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            {/* Date Range Selector */}
            <View className="px-6 pt-4 flex-row">
                <View className="flex-row bg-gray-100 rounded-lg overflow-hidden">
                    <TouchableOpacity
                        onPress={() => setDateRange('week')}
                        className={`px-4 py-2 ${dateRange === 'week' ? 'bg-green-500' : ''}`}
                    >
                        <Text className={`font-kmedium text-xs ${dateRange === 'week' ? 'text-white' : 'text-gray-600'}`}>Week</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setDateRange('month')}
                        className={`px-4 py-2 ${dateRange === 'month' ? 'bg-green-500' : ''}`}
                    >
                        <Text className={`font-kmedium text-xs ${dateRange === 'month' ? 'text-white' : 'text-gray-600'}`}>Month</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setDateRange('year')}
                        className={`px-4 py-2 ${dateRange === 'year' ? 'bg-green-500' : ''}`}
                    >
                        <Text className={`font-kmedium text-xs ${dateRange === 'year' ? 'text-white' : 'text-gray-600'}`}>Year</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-2">
                {/* Key Stats */}
                <View className="mt-4">
                    <Text className="font-kbold text-lg text-gray-800 mb-3">Key Statistics</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                        <StatCard
                            title="Active Clients"
                            value={data.activeClients}
                            icon={icons.users}
                            bgColor="bg-green-50"
                        />
                        <StatCard
                            title="Total Meal Plans"
                            value={data.totalMealPlans}
                            icon={icons.food}
                            bgColor="bg-blue-50"
                        />
                        <StatCard
                            title="Avg. Weight Loss (kg)"
                            value={data.averageWeightLoss}
                            icon={icons.chart}
                            bgColor="bg-purple-50"
                        />
                        <StatCard
                            title="Client Compliance %"
                            value={`${data.clientCompliance}%`}
                            icon={icons.check}
                            bgColor="bg-yellow-50"
                        />
                    </ScrollView>
                </View>

                {/* Client Performance */}
                <View className="mt-2 bg-white rounded-xl p-4 shadow-sm">
                    <Text className="font-kbold text-lg text-gray-800 mb-2">Client Performance</Text>

                    {/* Monthly Progress Chart - in a real app, implement with chart library */}
                    <View className="h-48 bg-gray-50 rounded-lg my-3 p-4 justify-center items-center">
                        <Text className="font-kmedium text-base text-gray-600">Avg. Weight Loss by Month</Text>
                        <View className="flex-row justify-between items-end w-full h-32 pt-4">
                            {data.monthlyProgress.map((item, index) => (
                                <View key={index} className="items-center">
                                    <View
                                        className="bg-green-500 w-8 rounded-t-lg"
                                        style={{ height: `${(item.weightLoss / 4) * 100}%` }}
                                    />
                                    <Text className="text-xs font-kregular mt-1">{item.month}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Dietary Preferences */}
                <View className="mt-6 bg-white rounded-xl p-4 shadow-sm">
                    <Text className="font-kbold text-lg text-gray-800 mb-2">Dietary Preferences</Text>

                    {data.dietaryPreferences.map((item, index) => (
                        <View key={index} className="mb-3">
                            <View className="flex-row justify-between mb-1">
                                <Text className="font-kmedium text-sm text-gray-700">{item.name}</Text>
                                <Text className="font-kbold text-sm text-gray-800">{item.percentage}%</Text>
                            </View>
                            <ProgressBar percentage={item.percentage} color={
                                index === 0 ? "bg-green-500" :
                                    index === 1 ? "bg-blue-500" :
                                        index === 2 ? "bg-purple-500" : "bg-yellow-500"
                            } />
                        </View>
                    ))}
                </View>

                {/* Nutrition Distribution */}
                <View className="mt-6 bg-white rounded-xl p-4 shadow-sm mb-6">
                    <Text className="font-kbold text-lg text-gray-800 mb-3">Nutrition Distribution</Text>

                    <View className="flex-row justify-between items-center mb-4">
                        {/* Pie chart representation - in a real app use a chart library */}
                        <View className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden relative">
                            <View
                                className="absolute bg-green-500"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    transform: [{ rotate: '0deg' }],
                                    borderTopRightRadius: 48,
                                    borderBottomRightRadius: 48,
                                    right: 0,
                                    top: 0,
                                    zIndex: 3
                                }}
                            />
                            <View
                                className="absolute bg-blue-500"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    transform: [{ rotate: `${(data.nutritionDistribution[0].percentage / 100) * 360}deg` }],
                                    borderTopRightRadius: 48,
                                    borderBottomRightRadius: 48,
                                    right: 0,
                                    top: 0,
                                    zIndex: 2
                                }}
                            />
                            <View
                                className="absolute bg-yellow-500"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    transform: [{ rotate: `${((data.nutritionDistribution[0].percentage + data.nutritionDistribution[1].percentage) / 100) * 360}deg` }],
                                    borderTopRightRadius: 48,
                                    borderBottomRightRadius: 48,
                                    right: 0,
                                    top: 0,
                                    zIndex: 1
                                }}
                            />
                        </View>

                        <View className="flex-1 ml-4">
                            {data.nutritionDistribution.map((item, index) => (
                                <View key={index} className="flex-row items-center mb-2">
                                    <View
                                        className={`w-3 h-3 rounded-full mr-2 ${index === 0 ? "bg-green-500" :
                                            index === 1 ? "bg-blue-500" : "bg-yellow-500"
                                            }`}
                                    />
                                    <Text className="font-kmedium text-sm text-gray-700">{item.name}</Text>
                                    <Text className="font-kbold text-sm text-gray-800 ml-auto">{item.percentage}%</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Export Section */}
                <View className="mb-20 flex-row justify-between">
                    <TouchableOpacity className="flex-1 py-3 bg-green-500 rounded-lg items-center mr-2">
                        <Text className="font-kbold text-sm text-white">Download Report</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 py-3 bg-white border border-green-500 rounded-lg items-center ml-2">
                        <Text className="font-kbold text-sm text-green-500">Share Data</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Analytics;