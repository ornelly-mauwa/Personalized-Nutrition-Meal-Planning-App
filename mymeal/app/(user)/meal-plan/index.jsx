import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function MealPlan() {
    const [activeDay, setActiveDay] = useState(3); // Thursday (0-indexed)
    const [activeCategory, setActiveCategory] = useState('all');

    const days = [
        { dayName: 'Mon', date: '15' },
        { dayName: 'Tue', date: '16' },
        { dayName: 'Wed', date: '17' },
        { dayName: 'Thu', date: '18' },
        { dayName: 'Fri', date: '19' },
        { dayName: 'Sat', date: '20' },
        { dayName: 'Sun', date: '21' },
    ];

    const categories = [
        { id: 'all', name: 'All' },
        { id: 'breakfast', name: 'Breakfast' },
        { id: 'lunch', name: 'Lunch' },
        { id: 'dinner', name: 'Dinner' },
        { id: 'snacks', name: 'Snacks' },
    ];

    const [meals, setMeals] = useState([
        {
            id: '1',
            name: 'Greek Yogurt Bowl',
            image: 'https://placehold.co/400x300',
            calories: 320,
            protein: 24,
            carbs: 42,
            fat: 8,
            time: '10 min',
            type: 'breakfast',
            isFavorite: true
        },
        {
            id: '2',
            name: 'Chicken & Quinoa Salad',
            image: 'https://placehold.co/400x300',
            calories: 450,
            protein: 38,
            carbs: 32,
            fat: 18,
            time: '15 min',
            type: 'lunch',
            isFavorite: false
        },
        {
            id: '3',
            name: 'Grilled Salmon with Asparagus',
            image: 'https://placehold.co/400x300',
            calories: 380,
            protein: 42,
            carbs: 12,
            fat: 22,
            time: '25 min',
            type: 'dinner',
            isFavorite: true
        },
        {
            id: '4',
            name: 'Protein Smoothie',
            image: 'https://placehold.co/400x300',
            calories: 220,
            protein: 30,
            carbs: 25,
            fat: 5,
            time: '5 min',
            type: 'snacks',
            isFavorite: false
        },
    ]);

    const navigateToMealDetail = (mealId) => {
        router.push(`/meal-plan/${mealId}`);
    };

    const navigateToFavorites = () => {
        router.push('/meal-plan/favorites');
    };

    const navigateToStore = () => {
        router.push('/meal-plan/store');
    };

    const filteredMeals = meals.filter(meal =>
        activeCategory === 'all' || meal.type === activeCategory
    );

    const toggleFavorite = (id) => {
        setMeals(meals.map(meal =>
            meal.id === id ? { ...meal, isFavorite: !meal.isFavorite } : meal
        ));
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="px-5 pt-4 pb-2 flex-row justify-between items-center">
                <View>
                    <Text className="text-slate-800 text-2xl font-kbold">Meal Plan</Text>
                    <Text className="text-slate-500 text-base font-kregular">Plan your meals for the week</Text>
                </View>
                <View className="flex-row">
                    <TouchableOpacity
                        className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center mr-3"
                        onPress={navigateToFavorites}
                    >
                        <Ionicons name="heart-outline" size={22} color="#3F836E" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center"
                        onPress={navigateToStore}
                    >
                        <Ionicons name="bag-outline" size={22} color="#3F836E" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Day Selector */}
            <View className="mt-4">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {days.map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`mr-3 w-16 h-20 rounded-2xl justify-center items-center ${activeDay === index ? 'bg-[#3F836E]' : 'bg-slate-100'}`}
                            onPress={() => setActiveDay(index)}
                        >
                            <Text className={`font-kmedium ${activeDay === index ? 'text-white' : 'text-slate-800'}`}>{day.dayName}</Text>
                            <Text className={`text-lg font-kbold mt-1 ${activeDay === index ? 'text-white' : 'text-slate-800'}`}>{day.date}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Categories */}
            <View className="mt-6 px-5">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            className={`mr-3 px-5 py-2 rounded-full ${activeCategory === category.id ? 'bg-[#3F836E]' : 'bg-slate-100'}`}
                            onPress={() => setActiveCategory(category.id)}
                        >
                            <Text className={`font-kmedium ${activeCategory === category.id ? 'text-white' : 'text-slate-800'}`}>{category.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Meals List */}
            <FlatList
                data={filteredMeals}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 120 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="mb-4 bg-white rounded-2xl shadow-sm overflow-hidden flex-row"
                        style={styles.mealCard}
                        onPress={() => navigateToMealDetail(item.id)}
                    >
                        <Image
                            source={{ uri: item.image }}
                            className="w-24 h-full"
                        />
                        <View className="flex-1 p-3 justify-between">
                            <View>
                                <View className="flex-row justify-between items-start">
                                    <Text className="text-slate-800 font-kbold text-base flex-1 mr-2">{item.name}</Text>
                                    <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                                        <Ionicons
                                            name={item.isFavorite ? "heart" : "heart-outline"}
                                            size={22}
                                            color={item.isFavorite ? "#f43f5e" : "#64748b"}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View className="flex-row mt-1">
                                    <Text className="text-slate-500 text-xs capitalize">{item.type}</Text>
                                </View>
                            </View>

                            <View className="mt-2">
                                <View className="flex-row flex-wrap">
                                    <View className="flex-row items-center mr-3 mb-1">
                                        <Ionicons name="flame-outline" size={14} color="#f97316" />
                                        <Text className="text-slate-600 text-xs ml-1">{item.calories} kcal</Text>
                                    </View>
                                    <View className="flex-row items-center mr-3 mb-1">
                                        <Ionicons name="time-outline" size={14} color="#64748b" />
                                        <Text className="text-slate-600 text-xs ml-1">{item.time}</Text>
                                    </View>
                                </View>

                                <View className="flex-row mt-1">
                                    <View className="flex-row items-center mr-3">
                                        <View className="w-2 h-2 rounded-full bg-blue-500 mr-1"></View>
                                        <Text className="text-slate-600 text-xs">P: {item.protein}g</Text>
                                    </View>
                                    <View className="flex-row items-center mr-3">
                                        <View className="w-2 h-2 rounded-full bg-amber-500 mr-1"></View>
                                        <Text className="text-slate-600 text-xs">C: {item.carbs}g</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <View className="w-2 h-2 rounded-full bg-purple-500 mr-1"></View>
                                        <Text className="text-slate-600 text-xs">F: {item.fat}g</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mealCard: {
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
});