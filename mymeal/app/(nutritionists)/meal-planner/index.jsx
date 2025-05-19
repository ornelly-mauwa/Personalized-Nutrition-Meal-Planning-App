import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Loader, Button } from "../../../components";
import { COLORS, SIZES, icons } from "../../../constants";
import { useGlobalContext } from "../../../context/GlobalProvider";

// Mock data for meal plan templates
const mockMealPlans = [
    {
        id: "1",
        title: "Weight Loss Plan",
        clientCount: 5,
        createdAt: "2025-04-20",
        thumbnail: "https://via.placeholder.com/150",
        categories: ["Low Carb", "High Protein"],
    },
    {
        id: "2",
        title: "Muscle Gain Plan",
        clientCount: 3,
        createdAt: "2025-04-15",
        thumbnail: "https://via.placeholder.com/150",
        categories: ["High Protein", "High Calorie"],
    },
    {
        id: "3",
        title: "Vegan Diet",
        clientCount: 2,
        createdAt: "2025-04-10",
        thumbnail: "https://via.placeholder.com/150",
        categories: ["Plant-based", "Dairy-free"],
    },
    {
        id: "4",
        title: "Mediterranean Diet",
        clientCount: 4,
        createdAt: "2025-04-05",
        thumbnail: "https://via.placeholder.com/150",
        categories: ["Heart Healthy", "Balanced"],
    },
];

// Mock clients for quick assignment
const mockClients = [
    { id: "1", name: "Emma Wilson", avatar: "https://via.placeholder.com/50", plan: "Weight Loss" },
    { id: "2", name: "John Doe", avatar: "https://via.placeholder.com/50", plan: "Muscle Gain" },
    { id: "3", name: "Sarah Johnson", avatar: "https://via.placeholder.com/50", plan: "Vegan Diet" },
    { id: "4", name: "Michael Brown", avatar: "https://via.placeholder.com/50", plan: "None" },
];

const MealPlanner = () => {
    const { loading, setLoading } = useGlobalContext();
    const [mealPlans, setMealPlans] = useState([]);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));
                setMealPlans(mockMealPlans);
                setClients(mockClients);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const navigateToCreatePlan = () => {
        router.push("/meal-planner/create"); // For now, navigate to a dummy plan ID
    };

    const navigateToTemplates = () => {
        router.push("/meal-planner/templetes");
    };

    const renderMealPlanItem = ({ item }) => (
        <TouchableOpacity
            className="mb-4 bg-white rounded-xl shadow-sm overflow-hidden"
            onPress={() => router.push(`/meal-planner/${item.id}`)}
        >
            <View className="flex-row">
                <View className="w-24 h-24 bg-gray-200">
                    <Image
                        source={{ uri: item.thumbnail }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
                <View className="flex-1 p-3">
                    <Text className="text-lg font-kbold text-gray-800">{item.title}</Text>
                    <View className="flex-row flex-wrap mt-1">
                        {item.categories.map((category, index) => (
                            <View
                                key={index}
                                className="mr-2 mt-1 px-2 py-1 bg-gray-100 rounded-full"
                            >
                                <Text className="text-xs font-kmedium text-gray-600">{category}</Text>
                            </View>
                        ))}
                    </View>
                    <View className="flex-row items-center mt-2">
                        <MaterialIcons name="person" size={16} color="#666" />
                        <Text className="ml-1 text-xs font-kregular text-gray-600">
                            {item.clientCount} clients assigned
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderClient = ({ item }) => (
        <TouchableOpacity
            className="mr-4 items-center"
            onPress={() => router.push(`/users/${item.id}`)}
        >
            <View className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mb-1">
                <Image
                    source={{ uri: item.avatar }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </View>
            <Text className="text-xs font-kmedium text-center text-gray-800" numberOfLines={1}>
                {item.name}
            </Text>
            <Text className="text-xs font-kregular text-center text-gray-500">
                {item.plan}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <Loader isLoading={loading} />

            <View className="px-4 py-3 bg-white border-b border-gray-200">
                <Text className="text-xl font-kbold text-gray-800">Meal Planner</Text>
            </View>

            <ScrollView className="flex-1">
                {/* Quick Actions */}
                <View className="p-4 bg-white mb-2">
                    <Text className="font-kbold text-gray-800 mb-3">Quick Actions</Text>
                    <View className="flex-row">
                        <TouchableOpacity
                            className="flex-1 bg-[#3F836E] py-3 px-4 rounded-lg mr-2 flex-row items-center justify-center"
                            onPress={navigateToCreatePlan}
                        >
                            <MaterialIcons name="add" size={20} color="white" />
                            <Text className="ml-1 text-white font-kmedium">Create Plan</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 bg-gray-100 py-3 px-4 rounded-lg ml-2 flex-row items-center justify-center"
                            onPress={navigateToTemplates}
                        >
                            <MaterialIcons name="library-books" size={20} color="#3F836E" />
                            <Text className="ml-1 text-[#3F836E] font-kmedium">Templates</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Clients Section */}
                <View className="mb-2 bg-white p-4">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="font-kbold text-gray-800">Quick Client Assignment</Text>
                        <TouchableOpacity onPress={() => router.push("/users")}>
                            <Text className="text-sm font-kmedium text-[#3F836E]">View All</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={clients}
                        renderItem={renderClient}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 4 }}
                    />
                </View>

                {/* Meal Plans */}
                <View className="bg-white p-4 mb-2">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="font-kbold text-gray-800">Your Meal Plans</Text>
                        <TouchableOpacity onPress={navigateToTemplates}>
                            <Text className="text-sm font-kmedium text-[#3F836E]">View All</Text>
                        </TouchableOpacity>
                    </View>

                    {mealPlans.map((plan) => renderMealPlanItem({ item: plan }))}
                </View>

                {/* Tips or Articles */}
                <View className="bg-white p-4 mb-6">
                    <Text className="font-kbold text-gray-800 mb-3">Nutrition Tips</Text>
                    <TouchableOpacity className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <Text className="font-kbold text-gray-800 mb-1">Meal Prepping Basics</Text>
                        <Text className="font-kregular text-gray-600 text-sm mb-3" numberOfLines={2}>
                            Discover how meal prepping can save time and help your clients stay on track with their nutrition goals.
                        </Text>
                        <Text className="font-kmedium text-[#3F836E] text-sm">Read More</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MealPlanner;