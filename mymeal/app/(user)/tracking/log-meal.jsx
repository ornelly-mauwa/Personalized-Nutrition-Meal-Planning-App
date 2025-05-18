import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function LogMealScreen() {
    const { id } = useLocalSearchParams();
    const isEditing = !!id;

    const [isLoading, setIsLoading] = useState(isEditing);
    const [mealType, setMealType] = useState('breakfast');
    const [mealName, setMealName] = useState('');
    const [servingSize, setServingSize] = useState('1');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'search'

    // Mock data for search results
    const mockFoods = [
        { id: '1', name: 'Greek Yogurt', calories: 100, protein: 10, carbs: 3, fat: 5, serving: '100g' },
        { id: '2', name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: '1 medium' },
        { id: '3', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
        { id: '4', name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8, serving: '1 cup cooked' },
        { id: '5', name: 'Avocado', calories: 240, protein: 3, carbs: 12, fat: 22, serving: '1 medium' },
    ];

    // Fetch meal data if editing
    useEffect(() => {
        if (isEditing) {
            // Simulate API call
            setTimeout(() => {
                // Mock data for editing - would come from API
                setMealType('lunch');
                setMealName('Chicken & Quinoa Salad');
                setServingSize('1');
                setCalories('450');
                setProtein('38');
                setCarbs('35');
                setFat('18');
                setIsLoading(false);
            }, 500);
        }
    }, [isEditing]);

    // Handle search
    useEffect(() => {
        if (searchQuery.length > 2) {
            const filtered = mockFoods.filter(food =>
                food.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filtered);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleSelectFood = (food) => {
        setMealName(food.name);
        setCalories(food.calories.toString());
        setProtein(food.protein.toString());
        setCarbs(food.carbs.toString());
        setFat(food.fat.toString());
        setSearchQuery('');
        setActiveTab('manual');
    };

    const handleSaveMeal = () => {
        // Here you would save the meal to your database
        alert(`Meal ${isEditing ? 'updated' : 'saved'}: ${mealName}`);
        router.back();
    };

    const MealTypeButton = ({ type, title, icon }) => (
        <TouchableOpacity
            className={`flex-1 p-3 rounded-xl items-center ${mealType === type ? 'bg-[#3F836E]' : 'bg-slate-100'}`}
            onPress={() => setMealType(type)}
        >
            <Ionicons
                name={icon}
                size={22}
                color={mealType === type ? 'white' : '#64748b'}
            />
            <Text
                className={`text-sm font-kmedium mt-1 ${mealType === type ? 'text-white' : 'text-slate-600'}`}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );

    const TabButton = ({ tab, title, icon }) => (
        <TouchableOpacity
            className={`flex-1 py-3 items-center justify-center flex-row ${activeTab === tab ? 'border-b-2 border-[#3F836E]' : ''}`}
            onPress={() => setActiveTab(tab)}
        >
            <Ionicons
                name={icon}
                size={18}
                color={activeTab === tab ? '#3F836E' : '#64748b'}
            />
            <Text
                className={`text-sm font-kmedium ml-1 ${activeTab === tab ? 'text-[#3F836E]' : 'text-slate-600'}`}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#3F836E" />
                <Text className="text-slate-600 mt-4 font-kmedium">Loading meal data...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center mr-3"
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={22} color="#64748b" />
                        </TouchableOpacity>
                        <Text className="text-slate-800 text-2xl font-kbold">{isEditing ? 'Edit Meal' : 'Log Meal'}</Text>
                    </View>
                    {isEditing && (
                        <TouchableOpacity
                            className="w-10 h-10 bg-red-100 rounded-full items-center justify-center"
                            onPress={() => {
                                alert('Meal deleted');
                                router.back();
                            }}
                        >
                            <Ionicons name="trash-outline" size={20} color="#ef4444" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Tabs for Input Method */}
                <View className="flex-row border-b border-slate-200 mx-5 mt-2">
                    <TabButton tab="manual" title="Manual Entry" icon="create-outline" />
                    <TabButton tab="search" title="Search Food" icon="search-outline" />
                </View>

                {activeTab === 'search' ? (
                    /* Search Tab */
                    <View className="px-5 mt-4">
                        <View className="flex-row items-center bg-slate-100 rounded-xl px-4 py-3 mb-4">
                            <Ionicons name="search" size={20} color="#64748b" />
                            <TextInput
                                className="flex-1 ml-2 text-slate-800 font-kregular"
                                placeholder="Search for a food..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Ionicons name="close-circle" size={20} color="#64748b" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {searchResults.length > 0 ? (
                            searchResults.map((food) => (
                                <TouchableOpacity
                                    key={food.id}
                                    className="p-4 border-b border-slate-100 flex-row justify-between items-center"
                                    onPress={() => handleSelectFood(food)}
                                >
                                    <View>
                                        <Text className="text-slate-800 font-kmedium">{food.name}</Text>
                                        <View className="flex-row mt-1">
                                            <Text className="text-slate-500 text-xs">{food.calories} kcal</Text>
                                            <Text className="text-slate-500 text-xs ml-3">Serving: {food.serving}</Text>
                                        </View>
                                    </View>
                                    <Ionicons name="add-circle-outline" size={22} color="#3F836E" />
                                </TouchableOpacity>
                            ))
                        ) : searchQuery.length > 2 ? (
                            <View className="items-center py-8">
                                <Ionicons name="sad-outline" size={40} color="#94a3b8" />
                                <Text className="text-slate-600 mt-2 font-kmedium">No foods found</Text>
                                <Text className="text-slate-500 text-sm text-center mt-1">
                                    Try another search term or add it manually
                                </Text>
                            </View>
                        ) : searchQuery.length > 0 ? (
                            <Text className="text-slate-500 text-center py-4">Type at least 3 characters to search</Text>
                        ) : (
                            <View className="items-center py-8">
                                <Ionicons name="restaurant-outline" size={40} color="#94a3b8" />
                                <Text className="text-slate-600 mt-2 font-kmedium">Search for foods</Text>
                                <Text className="text-slate-500 text-sm text-center mt-1">
                                    Type a food name to find nutritional information
                                </Text>
                            </View>
                        )}
                    </View>
                ) : (
                    /* Manual Entry Tab */
                    <View className="px-5 mt-4">
                        {/* Meal Type Selector */}
                        <Text className="text-slate-800 font-kbold mb-2">Meal Type</Text>
                        <View className="flex-row space-x-3 mb-4">
                            <MealTypeButton type="breakfast" title="Breakfast" icon="sunny-outline" />
                            <MealTypeButton type="lunch" title="Lunch" icon="restaurant-outline" />
                            <MealTypeButton type="dinner" title="Dinner" icon="moon-outline" />
                            <MealTypeButton type="snack" title="Snack" icon="cafe-outline" />
                        </View>

                        {/* Food Name Input */}
                        <View className="mb-4">
                            <Text className="text-slate-800 font-kbold mb-2">Food Name</Text>
                            <TextInput
                                className="bg-slate-100 rounded-xl px-4 py-3 text-slate-800 font-kregular"
                                placeholder="Enter food name"
                                value={mealName}
                                onChangeText={setMealName}
                            />
                        </View>

                        {/* Serving Size */}
                        <View className="mb-4">
                            <Text className="text-slate-800 font-kbold mb-2">Serving Size</Text>
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    className="w-10 h-10 bg-slate-100 rounded-l-xl items-center justify-center"
                                    onPress={() => {
                                        const currentVal = parseFloat(servingSize) || 0;
                                        if (currentVal > 0.25) setServingSize((currentVal - 0.25).toFixed(2));
                                    }}
                                >
                                    <Ionicons name="remove" size={22} color="#64748b" />
                                </TouchableOpacity>
                                <TextInput
                                    className="flex-1 bg-slate-100 px-4 py-3 text-center text-slate-800 font-kmedium"
                                    value={servingSize}
                                    onChangeText={setServingSize}
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity
                                    className="w-10 h-10 bg-slate-100 rounded-r-xl items-center justify-center"
                                    onPress={() => {
                                        const currentVal = parseFloat(servingSize) || 0;
                                        setServingSize((currentVal + 0.25).toFixed(2));
                                    }}
                                >
                                    <Ionicons name="add" size={22} color="#64748b" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Nutrition Information */}
                        <Text className="text-slate-800 font-kbold mb-2">Nutrition Information</Text>
                        <View className="bg-slate-50 rounded-xl p-4 mb-4">
                            {/* Calories */}
                            <View className="mb-3">
                                <Text className="text-slate-700 font-kmedium text-sm mb-1">Calories (kcal)</Text>
                                <TextInput
                                    className="bg-white rounded-xl px-4 py-3 text-slate-800 font-kregular"
                                    placeholder="0"
                                    value={calories}
                                    onChangeText={setCalories}
                                    keyboardType="numeric"
                                />
                            </View>

                            {/* Protein */}
                            <View className="mb-3">
                                <Text className="text-slate-700 font-kmedium text-sm mb-1">Protein (g)</Text>
                                <TextInput
                                    className="bg-white rounded-xl px-4 py-3 text-slate-800 font-kregular"
                                    placeholder="0"
                                    value={protein}
                                    onChangeText={setProtein}
                                    keyboardType="numeric"
                                />
                            </View>

                            {/* Carbs */}
                            <View className="mb-3">
                                <Text className="text-slate-700 font-kmedium text-sm mb-1">Carbs (g)</Text>
                                <TextInput
                                    className="bg-white rounded-xl px-4 py-3 text-slate-800 font-kregular"
                                    placeholder="0"
                                    value={carbs}
                                    onChangeText={setCarbs}
                                    keyboardType="numeric"
                                />
                            </View>

                            {/* Fat */}
                            <View>
                                <Text className="text-slate-700 font-kmedium text-sm mb-1">Fat (g)</Text>
                                <TextInput
                                    className="bg-white rounded-xl px-4 py-3 text-slate-800 font-kregular"
                                    placeholder="0"
                                    value={fat}
                                    onChangeText={setFat}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Save Button */}
            <View className="px-5 py-4 bg-white border-t border-slate-100">
                <TouchableOpacity
                    className="bg-[#3F836E] py-4 rounded-xl items-center"
                    onPress={handleSaveMeal}
                    disabled={!mealName || !calories}
                >
                    <Text className="text-white font-kbold text-base">
                        {isEditing ? 'Update Meal' : 'Save Meal'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}