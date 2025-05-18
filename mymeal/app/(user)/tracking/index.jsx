import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function TrackingScreen() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [meals, setMeals] = useState([
        {
            id: '1',
            type: 'breakfast',
            time: '7:30 AM',
            name: 'Greek Yogurt Bowl',
            calories: 320,
            protein: 24,
            carbs: 32,
            fat: 10,
        },
        {
            id: '2',
            type: 'lunch',
            time: '12:15 PM',
            name: 'Chicken & Quinoa Salad',
            calories: 450,
            protein: 38,
            carbs: 35,
            fat: 18,
        },
        {
            id: '3',
            type: 'snack',
            time: '3:30 PM',
            name: 'Apple with Almond Butter',
            calories: 210,
            protein: 5,
            carbs: 28,
            fat: 11,
        }
    ]);

    const [todayStats, setTodayStats] = useState({
        calories: {
            consumed: 980,
            goal: 2000,
        },
        protein: {
            consumed: 67,
            goal: 120,
        },
        carbs: {
            consumed: 95,
            goal: 180,
        },
        fat: {
            consumed: 39,
            goal: 65,
        },
        water: {
            consumed: 4,
            goal: 8
        }
    });

    const formatDate = (date) => {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const calculateProgress = (consumed, goal) => {
        return (consumed / goal) * 100;
    };

    const getMealIcon = (mealType) => {
        switch (mealType) {
            case 'breakfast':
                return 'sunny-outline';
            case 'lunch':
                return 'restaurant-outline';
            case 'dinner':
                return 'moon-outline';
            case 'snack':
                return 'cafe-outline';
            default:
                return 'nutrition-outline';
        }
    };

    const getMealColor = (mealType) => {
        switch (mealType) {
            case 'breakfast':
                return '#f97316'; // amber
            case 'lunch':
                return '#3b82f6'; // blue
            case 'dinner':
                return '#8b5cf6'; // purple
            case 'snack':
                return '#10b981'; // green
            default:
                return '#64748b'; // slate
        }
    };

    const navigateToNextDay = () => {
        const nextDay = new Date(currentDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setCurrentDate(nextDay);
    };

    const navigateToPrevDay = () => {
        const prevDay = new Date(currentDate);
        prevDay.setDate(prevDay.getDate() - 1);
        setCurrentDate(prevDay);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-5 pt-4 pb-2">
                    <Text className="text-slate-800 text-2xl font-kbold">Food Tracking</Text>
                    <Text className="text-slate-500 text-base font-kregular">Log and track your meals</Text>
                </View>

                {/* Date Navigation */}
                <View className="flex-row items-center justify-between mx-5 mt-2 bg-slate-50 px-4 py-3 rounded-xl">
                    <TouchableOpacity onPress={navigateToPrevDay}>
                        <Ionicons name="chevron-back" size={22} color="#64748b" />
                    </TouchableOpacity>
                    <Text className="text-slate-800 text-base font-kbold">{formatDate(currentDate)}</Text>
                    <TouchableOpacity onPress={navigateToNextDay}>
                        <Ionicons name="chevron-forward" size={22} color="#64748b" />
                    </TouchableOpacity>
                </View>

                {/* Calorie Summary */}
                <View className="mx-5 mt-4 p-5 bg-slate-50 rounded-2xl">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-slate-800 text-lg font-kbold">Daily Summary</Text>
                        <Text className="text-slate-600 text-base">
                            {todayStats.calories.consumed} / {todayStats.calories.goal} kcal
                        </Text>
                    </View>

                    {/* Calories Progress */}
                    <View className="h-3 bg-slate-200 rounded-full overflow-hidden mb-4">
                        <View
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${calculateProgress(todayStats.calories.consumed, todayStats.calories.goal)}%` }}
                        />
                    </View>

                    {/* Macronutrients */}
                    <View className="flex-row justify-between">
                        {/* Protein */}
                        <View className="flex-1 mr-2">
                            <View className="flex-row justify-between mb-1">
                                <Text className="text-slate-700 font-kmedium text-sm">Protein</Text>
                                <Text className="text-slate-700 text-sm">
                                    {todayStats.protein.consumed}g / {todayStats.protein.goal}g
                                </Text>
                            </View>
                            <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <View
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${calculateProgress(todayStats.protein.consumed, todayStats.protein.goal)}%` }}
                                />
                            </View>
                        </View>

                        {/* Carbs */}
                        <View className="flex-1 mx-1">
                            <View className="flex-row justify-between mb-1">
                                <Text className="text-slate-700 font-kmedium text-sm">Carbs</Text>
                                <Text className="text-slate-700 text-sm">
                                    {todayStats.carbs.consumed}g / {todayStats.carbs.goal}g
                                </Text>
                            </View>
                            <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <View
                                    className="h-full bg-amber-500 rounded-full"
                                    style={{ width: `${calculateProgress(todayStats.carbs.consumed, todayStats.carbs.goal)}%` }}
                                />
                            </View>
                        </View>

                        {/* Fat */}
                        <View className="flex-1 ml-2">
                            <View className="flex-row justify-between mb-1">
                                <Text className="text-slate-700 font-kmedium text-sm">Fat</Text>
                                <Text className="text-slate-700 text-sm">
                                    {todayStats.fat.consumed}g / {todayStats.fat.goal}g
                                </Text>
                            </View>
                            <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <View
                                    className="h-full bg-purple-500 rounded-full"
                                    style={{ width: `${calculateProgress(todayStats.fat.consumed, todayStats.fat.goal)}%` }}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Logged Meals */}
                <View className="px-5 mt-6">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-slate-800 text-lg font-kbold">Logged Meals</Text>
                        <TouchableOpacity onPress={() => router.push('/tracking/log-meal')}>
                            <Text className="text-[#3F836E] font-kmedium">Add Meal</Text>
                        </TouchableOpacity>
                    </View>

                    {meals.map((meal) => (
                        <TouchableOpacity
                            key={meal.id}
                            className="mb-3 bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100"
                            onPress={() => router.push(`/tracking/log-meal?id=${meal.id}`)}
                        >
                            <View className="flex-row items-center p-4">
                                <View
                                    className="w-12 h-12 rounded-full items-center justify-center mr-3"
                                    style={{ backgroundColor: `${getMealColor(meal.type)}20` }} // 20% opacity version of the color
                                >
                                    <Ionicons name={getMealIcon(meal.type)} size={22} color={getMealColor(meal.type)} />
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row items-center">
                                        <Text className="text-slate-500 text-xs font-kmedium uppercase mr-2">
                                            {meal.type}
                                        </Text>
                                        <Text className="text-slate-500 text-xs">{meal.time}</Text>
                                    </View>
                                    <Text className="text-slate-800 text-base font-kbold">{meal.name}</Text>
                                    <View className="flex-row mt-1">
                                        <Text className="text-slate-600 text-xs mr-2">{meal.calories} kcal</Text>
                                        <Text className="text-slate-600 text-xs mr-2">P: {meal.protein}g</Text>
                                        <Text className="text-slate-600 text-xs mr-2">C: {meal.carbs}g</Text>
                                        <Text className="text-slate-600 text-xs">F: {meal.fat}g</Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                            </View>
                        </TouchableOpacity>
                    ))}

                    {meals.length === 0 && (
                        <View className="bg-slate-50 p-8 rounded-xl items-center">
                            <Ionicons name="restaurant-outline" size={48} color="#94a3b8" />
                            <Text className="text-slate-600 text-base font-kmedium mt-2">No meals logged yet</Text>
                            <Text className="text-slate-500 text-sm text-center mt-1">
                                Tap the "Add Meal" button to start tracking your food
                            </Text>
                        </View>
                    )}
                </View>

                {/* Water Tracking */}
                <View className="mx-5 mt-6 p-5 bg-blue-50 rounded-2xl mb-24">
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-slate-800 text-lg font-kbold">Water Intake</Text>
                            <Text className="text-slate-600 text-sm">
                                {todayStats.water.consumed} of {todayStats.water.goal} glasses
                            </Text>
                        </View>
                        <View className="w-12 h-12 justify-center items-center">
                            <Ionicons name="water-outline" size={28} color="#3b82f6" />
                        </View>
                    </View>

                    <View className="h-3 bg-white rounded-full overflow-hidden mt-3">
                        <View
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(todayStats.water.consumed / todayStats.water.goal) * 100}%` }}
                        />
                    </View>

                    <View className="flex-row justify-between mt-4">
                        <TouchableOpacity className="flex-1 mr-2 bg-white py-3 rounded-xl flex-row justify-center items-center">
                            <Ionicons name="remove-outline" size={20} color="#3F836E" />
                            <Text className="text-sm font-kbold text-[#3F836E] ml-1">Remove</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 ml-2 bg-[#3F836E] py-3 rounded-xl flex-row justify-center items-center">
                            <Ionicons name="add-outline" size={20} color="white" />
                            <Text className="text-sm font-kbold text-white ml-1">Add Glass</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Add Meal FAB */}
            <TouchableOpacity
                className="absolute bottom-24 right-5 w-16 h-16 rounded-full bg-[#3F836E] items-center justify-center shadow-lg"
                onPress={() => router.push('/tracking/log-meal')}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}