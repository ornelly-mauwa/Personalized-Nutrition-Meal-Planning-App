import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Loader, Button } from "../../../components";
import { COLORS, SIZES } from "../../../constants";
import { useGlobalContext } from "../../../context/GlobalProvider";

// Mock data for templates
const mockTemplates = [
    {
        id: "1",
        title: "Weight Loss Plan",
        description: "A balanced meal plan designed for gradual weight loss with adequate nutrition",
        thumbnail: "https://via.placeholder.com/150",
        categories: ["Low Carb", "High Protein"],
        calories: 1500,
        createdAt: "2025-04-20",
        meals: 15
    },
    {
        id: "2",
        title: "Muscle Gain Plan",
        description: "High protein meal plan for active individuals focused on building muscle",
        thumbnail: "https://via.placeholder.com/150",
        categories: ["High Protein", "High Calorie"],
        calories: 2800,
        createdAt: "2025-04-15",
        meals: 18
    },
    {
        id: "3",
        title: "Vegan Diet",
        description: "Plant-based meal plan with complete protein sources and essential nutrients",
        thumbnail: "https://via.placeholder.com/150",
        categories: ["Plant-based", "Dairy-free"],
        calories: 1800,
        createdAt: "2025-04-10",
        meals: 12
    },
    {
        id: "4",
        title: "Mediterranean Diet",
        description: "Heart-healthy meal plan based on traditional Mediterranean cuisine",
        thumbnail: "https://via.placeholder.com/150",
        categories: ["Heart Healthy", "Balanced"],
        calories: 2000,
        createdAt: "2025-04-05",
        meals: 14
    },
    {
        id: "5",
        title: "Low Carb Plan",
        description: "Reduced carbohydrate plan with focus on protein and healthy fats",
        thumbnail: "https://via.placeholder.com/150",
        categories: ["Keto-friendly", "Low Carb"],
        calories: 1700,
        createdAt: "2025-03-28",
        meals: 15
    },
    {
        id: "6",
        title: "Detox Plan",
        description: "Short-term nutrition plan focusing on whole foods and elimination of processed ingredients",
        thumbnail: "https://via.placeholder.com/150",
        categories: ["Cleanse", "Whole Foods"],
        calories: 1400,
        createdAt: "2025-03-20",
        meals: 9
    }
];

// Categories for filtering
const categories = [
    "All",
    "Low Carb",
    "High Protein",
    "Plant-based",
    "Heart Healthy",
    "Keto-friendly",
    "Whole Foods"
];

const Templates = () => {
    const { loading, setLoading } = useGlobalContext();
    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setLoading(true);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));
                setTemplates(mockTemplates);
                setFilteredTemplates(mockTemplates);
                setError(null);
            } catch (error) {
                console.error("Error fetching templates:", error);
                setError("Failed to load templates");
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredTemplates(templates);
        } else {
            const filtered = templates.filter(template =>
                template.categories.some(cat => cat === selectedCategory)
            );
            setFilteredTemplates(filtered);
        }
    }, [selectedCategory, templates]);

    const handleCreateNew = () => {
        try {
            router.push("/meal-planner/create");
        } catch (error) {
            console.error("Navigation error:", error);
            Alert.alert("Error", "Could not navigate to create new template");
        }
    };

    const handleUseTemplate = (template) => {
        try {
            Alert.alert(
                "Use Template",
                `Would you like to use "${template.title}" as a new meal plan or assign it to a client?`,
                [
                    {
                        text: "Create New Plan",
                        onPress: () => router.push(`/meal-planner/${template.id}`)
                    },
                    {
                        text: "Assign to Client",
                        onPress: () => router.push("/users")
                    },
                    {
                        text: "Cancel",
                        style: "cancel"
                    }
                ]
            );
        } catch (error) {
            console.error("Alert error:", error);
        }
    };

    const renderTemplateItem = ({ item }) => (
        <View className="mb-4 bg-white rounded-xl shadow-sm overflow-hidden">
            <View className="h-32 bg-gray-200">
                <Image
                    source={{ uri: item.thumbnail }}
                    className="w-full h-full"
                    resizeMode="cover"
                //defaultSource={require('../../../assets/images/placeholder.png')}
                />
            </View>

            <View className="p-4">
                <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
                <Text className="text-sm text-gray-600 mt-1" numberOfLines={2}>
                    {item.description}
                </Text>

                <View className="flex-row flex-wrap mt-2">
                    {item.categories.map((category, index) => (
                        <View
                            key={`${item.id}-category-${index}`}
                            className="mr-2 mt-1 px-2 py-1 bg-gray-100 rounded-full"
                        >
                            <Text className="text-xs text-gray-600">{category}</Text>
                        </View>
                    ))}
                </View>

                <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <View className="flex-row items-center">
                        <MaterialIcons name="local-fire-department" size={16} color="#E67E22" />
                        <Text className="ml-1 text-xs text-gray-700">
                            {item.calories} kcal/day
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <MaterialIcons name="restaurant" size={16} color="#3F836E" />
                        <Text className="ml-1 text-xs text-gray-700">
                            {item.meals} meals
                        </Text>
                    </View>

                    <TouchableOpacity
                        className="px-3 py-1 bg-[#3F836E] rounded-full"
                        onPress={() => handleUseTemplate(item)}
                    >
                        <Text className="text-xs font-bold text-white">Use</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View className="flex-1 justify-center items-center py-8">
            <MaterialIcons name="search-off" size={48} color="#BDBDBD" />
            <Text className="mt-2 text-base text-gray-500">
                No templates found in this category
            </Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {loading && <Loader isLoading={loading} />}

            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2 mr-2"
                    >
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800">Plan Templates</Text>
                </View>

                <TouchableOpacity
                    onPress={handleCreateNew}
                    className="p-2"
                >
                    <MaterialIcons name="add" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {/* Category filter */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="py-2 px-4 bg-white mb-2"
            >
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={`category-${index}`}
                        className={`px-4 py-2 mr-2 rounded-full ${selectedCategory === category ? "bg-[#3F836E]" : "bg-gray-100"
                            }`}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Text
                            className={`${selectedCategory === category ? "text-white" : "text-gray-700"
                                }`}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {error ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-red-500">{error}</Text>
                    <TouchableOpacity
                        className="mt-4 bg-[#3F836E] px-4 py-2 rounded-lg"
                        onPress={() => {
                            setLoading(true);
                            setTimeout(() => {
                                setTemplates(mockTemplates);
                                setFilteredTemplates(mockTemplates);
                                setError(null);
                                setLoading(false);
                            }, 800);
                        }}
                    >
                        <Text className="text-white">Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredTemplates}
                    keyExtractor={(item) => `template-${item.id}`}
                    renderItem={renderTemplateItem}
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyState}
                />
            )}

            <View className="px-4 py-3 bg-white border-t border-gray-200">
                <Button
                    title="Create New Template"
                    onPress={handleCreateNew}
                    containerStyle="bg-[#3F836E] py-3 rounded-lg"
                    textStyle="text-white font-bold text-center"
                />
            </View>
        </SafeAreaView>
    );
};

export default Templates;