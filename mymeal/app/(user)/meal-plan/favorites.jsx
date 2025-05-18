import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Favorites() {
    const [favoriteMeals, setFavoriteMeals] = useState([
        {
            id: '1',
            name: 'Greek Yogurt Bowl',
            image: 'https://placehold.co/400x300',
            calories: 320,
            protein: 24,
            carbs: 42,
            fat: 8,
            time: '10 min',
            type: 'breakfast'
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
            type: 'dinner'
        },
        {
            id: '5',
            name: 'Avocado Toast with Eggs',
            image: 'https://placehold.co/400x300',
            calories: 340,
            protein: 18,
            carbs: 28,
            fat: 18,
            time: '15 min',
            type: 'breakfast'
        },
    ]);

    const navigateToMealDetail = (mealId) => {
        router.push(`/meal-plan/${mealId}`);
    };

    const removeFavorite = (id) => {
        setFavoriteMeals(favoriteMeals.filter(meal => meal.id !== id));
    };

    return (
        <View className="flex-1 bg-white px-5 pt-4">
            {favoriteMeals.length > 0 ? (
                <FlatList
                    data={favoriteMeals}
                    keyExtractor={(item) => item.id}
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
                                        <TouchableOpacity onPress={() => removeFavorite(item.id)}>
                                            <Ionicons name="heart" size={22} color="#f43f5e" />
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
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListFooterComponent={
                        <TouchableOpacity
                            className="mt-4 bg-slate-100 py-3 rounded-xl flex-row justify-center items-center"
                            onPress={() => router.push('/meal-plan')}
                        >
                            <Text className="text-base font-kbold text-slate-700">Browse All Meals</Text>
                        </TouchableOpacity>
                    }
                />
            ) : (
                <View className="flex-1 justify-center items-center">
                    <Ionicons name="heart-outline" size={64} color="#d1d5db" />
                    <Text className="text-slate-800 text-lg font-kbold mt-4">No Favorites Yet</Text>
                    <Text className="text-slate-500 text-center mt-2 mb-6">
                        You haven't added any meals to your favorites.
                    </Text>
                    <TouchableOpacity
                        className="mt-4 bg-[#3F836E] px-6 py-3 rounded-xl flex-row justify-center items-center"
                        onPress={() => router.push('/meal-plan')}
                    >
                        <Text className="text-base font-kbold text-white">Browse Meals</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
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