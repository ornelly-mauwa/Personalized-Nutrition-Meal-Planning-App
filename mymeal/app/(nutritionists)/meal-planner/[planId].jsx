import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

import { Loader, Button } from "../../../components";
import { COLORS, SIZES } from "../../../constants";
import { useGlobalContext } from "../../../context/GlobalProvider";

// Mock meal plan data
const mockMealPlan = {
    id: "1",
    title: "Weight Loss Plan",
    description: "A balanced meal plan designed for gradual weight loss with adequate nutrition",
    createdAt: "2025-04-20",
    days: [
        {
            id: "day1",
            name: "Day 1",
            meals: [
                {
                    id: "meal1",
                    type: "Breakfast",
                    title: "Veggie Omelette with Toast",
                    calories: 350,
                    protein: 22,
                    carbs: 30,
                    fat: 15,
                    ingredients: [
                        "2 whole eggs",
                        "1 egg white",
                        "½ bell pepper, diced",
                        "¼ onion, diced",
                        "Handful of spinach",
                        "1 slice whole wheat toast",
                        "1 tsp olive oil",
                    ],
                    instructions: "Beat eggs and whites together. Heat oil in a non-stick pan. Add vegetables and sauté until soft. Pour in egg mixture and cook until set. Serve with whole wheat toast."
                },
                {
                    id: "meal2",
                    type: "Lunch",
                    title: "Grilled Chicken Salad",
                    calories: 450,
                    protein: 35,
                    carbs: 25,
                    fat: 20,
                    ingredients: [
                        "120g grilled chicken breast",
                        "2 cups mixed greens",
                        "½ cup cherry tomatoes",
                        "¼ cucumber, sliced",
                        "¼ avocado",
                        "2 tbsp low-fat dressing",
                    ],
                    instructions: "Grill chicken until cooked through. Combine all vegetables in a bowl. Slice chicken and add to the salad. Dress with your low-fat dressing."
                },
                {
                    id: "meal3",
                    type: "Dinner",
                    title: "Baked Salmon with Quinoa",
                    calories: 500,
                    protein: 30,
                    carbs: 40,
                    fat: 22,
                    ingredients: [
                        "150g salmon fillet",
                        "½ cup cooked quinoa",
                        "1 cup roasted vegetables",
                        "1 tsp olive oil",
                        "Lemon juice",
                        "Fresh herbs",
                    ],
                    instructions: "Preheat oven to 180°C. Season salmon with herbs, salt, and pepper. Bake for 15-20 minutes. Serve with cooked quinoa and roasted vegetables."
                },
            ]
        },
        {
            id: "day2",
            name: "Day 2",
            meals: [
                {
                    id: "meal4",
                    type: "Breakfast",
                    title: "Greek Yogurt with Berries",
                    calories: 300,
                    protein: 20,
                    carbs: 35,
                    fat: 8,
                    ingredients: [
                        "1 cup Greek yogurt",
                        "½ cup mixed berries",
                        "1 tbsp honey",
                        "2 tbsp granola",
                    ],
                    instructions: "Add berries and granola to yogurt. Drizzle with honey and serve."
                },
                // Additional meals would be added here
            ]
        }
    ]
};

const PlanEditor = () => {
    const { planId } = useLocalSearchParams();
    const { loading, setLoading } = useGlobalContext();
    const [mealPlan, setMealPlan] = useState(null);
    const [activeDay, setActiveDay] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");

    useEffect(() => {
        const fetchMealPlan = async () => {
            setLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));
                setMealPlan(mockMealPlan);
                setActiveDay(mockMealPlan.days[0].id);
                setEditedTitle(mockMealPlan.title);
                setEditedDescription(mockMealPlan.description);
            } catch (error) {
                console.error("Error fetching meal plan:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMealPlan();
    }, [planId]);

    const handleSave = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // Update local state with edited values
            setMealPlan({
                ...mealPlan,
                title: editedTitle,
                description: editedDescription
            });

            setIsEditing(false);
            Alert.alert("Success", "Meal plan updated successfully!");
        } catch (error) {
            console.error("Error saving meal plan:", error);
            Alert.alert("Error", "Failed to update meal plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const addNewMeal = (dayId) => {
        // Implementation would depend on your data structure and API
        Alert.alert("Add Meal", "This would open a meal creation form");
    };

    const getActiveDayMeals = () => {
        if (!mealPlan || !activeDay) return [];
        const day = mealPlan.days.find(d => d.id === activeDay);
        return day ? day.meals : [];
    };

    const renderMacroCircle = (value, total, color, label) => {
        const percentage = Math.round((value / total) * 100);

        return (
            <View className="items-center">
                <View className="w-16 h-16 rounded-full border-4 justify-center items-center" style={{ borderColor: color }}>
                    <Text className="font-kbold text-lg">{percentage}%</Text>
                </View>
                <Text className="mt-1 text-xs font-kmedium text-gray-700">{label}</Text>
            </View>
        );
    };

    if (!mealPlan) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <Loader isLoading={loading} />
                {!loading && <Text className="font-kmedium text-gray-500">Meal plan not found</Text>}
            </SafeAreaView>
        );
    }

    const activeDayMeals = getActiveDayMeals();
    const totalCalories = activeDayMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalProtein = activeDayMeals.reduce((sum, meal) => sum + meal.protein, 0);
    const totalCarbs = activeDayMeals.reduce((sum, meal) => sum + meal.carbs, 0);
    const totalFat = activeDayMeals.reduce((sum, meal) => sum + meal.fat, 0);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <Loader isLoading={loading} />

            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2 mr-2"
                    >
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text className="text-xl font-kbold text-gray-800">
                        {isEditing ? "Edit Meal Plan" : mealPlan.title}
                    </Text>
                </View>

                {!isEditing ? (
                    <TouchableOpacity
                        onPress={() => setIsEditing(true)}
                        className="p-2"
                    >
                        <MaterialIcons name="edit" size={22} color={COLORS.primary} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={handleSave}
                        className="p-2"
                    >
                        <MaterialIcons name="check" size={22} color={COLORS.primary} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView className="flex-1">
                {/* Plan details section */}
                <View className="bg-white p-4 mb-2">
                    {isEditing ? (
                        <View>
                            <Text className="mb-1 text-sm font-kmedium text-gray-700">Plan Title</Text>
                            <TextInput
                                className="p-3 mb-3 bg-gray-100 border border-gray-200 rounded-lg font-kregular"
                                value={editedTitle}
                                onChangeText={setEditedTitle}
                            />

                            <Text className="mb-1 text-sm font-kmedium text-gray-700">Description</Text>
                            <TextInput
                                className="p-3 bg-gray-100 border border-gray-200 rounded-lg font-kregular"
                                value={editedDescription}
                                onChangeText={setEditedDescription}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>
                    ) : (
                        <View>
                            <Text className="text-sm font-kregular text-gray-600">{mealPlan.description}</Text>

                            <View className="flex-row items-center mt-3">
                                <MaterialIcons name="event" size={16} color="#666" />
                                <Text className="ml-1 text-xs font-kregular text-gray-600">
                                    Created on {mealPlan.createdAt}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Day selector */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="py-2 px-4 bg-white mb-2"
                >
                    {mealPlan.days.map((day) => (
                        <TouchableOpacity
                            key={day.id}
                            className={`px-4 py-2 mr-2 rounded-full ${activeDay === day.id ? "bg-[#3F836E]" : "bg-gray-100"
                                }`}
                            onPress={() => setActiveDay(day.id)}
                        >
                            <Text
                                className={`font-kmedium ${activeDay === day.id ? "text-white" : "text-gray-700"
                                    }`}
                            >
                                {day.name}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity className="px-4 py-2 rounded-full bg-gray-200 flex-row items-center">
                        <MaterialIcons name="add" size={18} color="#3F836E" />
                        <Text className="font-kmedium text-[#3F836E]">Add Day</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Nutrition summary */}
                <View className="bg-white p-4 mb-2">
                    <Text className="font-kbold text-gray-800 mb-3">Daily Nutrition</Text>

                    <View className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-3">
                        <Text className="font-kbold text-gray-700 text-center mb-1">Total Calories</Text>
                        <Text className="font-kbold text-2xl text-[#3F836E] text-center">{totalCalories} kcal</Text>
                    </View>

                    <View className="flex-row justify-around mt-2">
                        {renderMacroCircle(totalProtein * 4, totalCalories, "#3F836E", `Protein ${totalProtein}g`)}
                        {renderMacroCircle(totalCarbs * 4, totalCalories, "#E67E22", `Carbs ${totalCarbs}g`)}
                        {renderMacroCircle(totalFat * 9, totalCalories, "#9B59B6", `Fat ${totalFat}g`)}
                    </View>
                </View>

                {/* Meals list */}
                <View className="bg-white p-4 mb-6">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="font-kbold text-gray-800">Meals</Text>
                        <TouchableOpacity
                            onPress={() => addNewMeal(activeDay)}
                            className="flex-row items-center"
                        >
                            <MaterialIcons name="add" size={18} color="#3F836E" />
                            <Text className="font-kmedium text-[#3F836E]">Add Meal</Text>
                        </TouchableOpacity>
                    </View>

                    {activeDayMeals.map((meal) => (
                        <View
                            key={meal.id}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-3"
                        >
                            <View className="flex-row justify-between mb-2">
                                <View>
                                    <Text className="text-sm font-kmedium text-[#3F836E]">{meal.type}</Text>
                                    <Text className="font-kbold text-gray-800">{meal.title}</Text>
                                </View>
                                <View className="flex-row">
                                    <TouchableOpacity className="p-2">
                                        <MaterialIcons name="edit" size={18} color="#666" />
                                    </TouchableOpacity>
                                    <TouchableOpacity className="p-2">
                                        <MaterialIcons name="delete" size={18} color="#D32F2F" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="flex-row mb-2">
                                <View className="bg-gray-200 px-2 py-1 rounded-full mr-2">
                                    <Text className="text-xs font-kmedium text-gray-700">{meal.calories} kcal</Text>
                                </View>
                                <View className="bg-gray-200 px-2 py-1 rounded-full mr-2">
                                    <Text className="text-xs font-kmedium text-gray-700">P: {meal.protein}g</Text>
                                </View>
                                <View className="bg-gray-200 px-2 py-1 rounded-full mr-2">
                                    <Text className="text-xs font-kmedium text-gray-700">C: {meal.carbs}g</Text>
                                </View>
                                <View className="bg-gray-200 px-2 py-1 rounded-full">
                                    <Text className="text-xs font-kmedium text-gray-700">F: {meal.fat}g</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                className="mt-1"
                                onPress={() => Alert.alert("Recipe", `${meal.instructions}\n\nIngredients:\n${meal.ingredients.join("\n")}`)}
                            >
                                <Text className="text-sm font-kmedium text-[#3F836E]">View Recipe</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View className="px-4 py-3 bg-white border-t border-gray-200">
                <Button
                    title="Share with Client"
                    onPress={() => Alert.alert("Share", "Choose a client to share this meal plan with")}
                    containerStyle="bg-[#3F836E] py-3 rounded-lg"
                    textStyle="text-white font-kbold text-center"
                />
            </View>
        </SafeAreaView>
    );
};

export default PlanEditor;