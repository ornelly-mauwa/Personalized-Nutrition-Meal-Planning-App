import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    Alert
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Check if icons are properly imported
// If you don't have these icons defined, we'll use fallback text
import { icons } from "../../../constants";

const ClientsList = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Added local loading state
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterActive, setFilterActive] = useState("all");

    // Verify icon existence - use this helper function for safety
    const getIcon = (iconName) => {
        try {
            // If the icon exists in your constants file
            if (icons && icons[iconName]) {
                return icons[iconName];
            }
            // Return null if the icon doesn't exist
            return null;
        } catch (error) {
            console.error(`Error accessing icon: ${iconName}`, error);
            return null;
        }
    };

    useEffect(() => {
        // In a real app, this would be an API call
        const fetchClients = () => {
            try {
                // Mock data
                const mockClients = [
                    {
                        id: 1,
                        name: "Jane Smith",
                        image: null,
                        email: "jane.smith@example.com",
                        phone: "555-123-4567",
                        goal: "Weight loss",
                        status: "active",
                        dietaryRestrictions: ["Gluten-free"],
                        lastVisit: "May 16, 2025",
                        nextAppointment: "May 23, 2025"
                    },
                    {
                        id: 2,
                        name: "John Doe",
                        image: null,
                        email: "john.doe@example.com",
                        phone: "555-987-6543",
                        goal: "Muscle gain",
                        status: "active",
                        dietaryRestrictions: ["Dairy-free"],
                        lastVisit: "May 10, 2025",
                        nextAppointment: "May 24, 2025"
                    },
                    {
                        id: 3,
                        name: "Alice Johnson",
                        image: null,
                        email: "alice.j@example.com",
                        phone: "555-555-5555",
                        goal: "Diabetes management",
                        status: "active",
                        dietaryRestrictions: ["Low-carb"],
                        lastVisit: "May 17, 2025",
                        nextAppointment: "May 22, 2025"
                    },
                    {
                        id: 4,
                        name: "Robert Garcia",
                        image: null,
                        email: "robert.g@example.com",
                        phone: "555-222-3333",
                        goal: "Athletic performance",
                        status: "inactive",
                        dietaryRestrictions: ["Vegan"],
                        lastVisit: "April 05, 2025",
                        nextAppointment: null
                    },
                    {
                        id: 5,
                        name: "Sarah Kim",
                        image: null,
                        email: "sarah.kim@example.com",
                        phone: "555-777-8888",
                        goal: "Pregnancy nutrition",
                        status: "active",
                        dietaryRestrictions: ["No seafood"],
                        lastVisit: "May 12, 2025",
                        nextAppointment: "May 26, 2025"
                    },
                ];

                setClients(mockClients);
                setLoading(false); // Turn off loading state after data is loaded
            } catch (error) {
                console.error("Error fetching clients:", error);
                Alert.alert("Error", "Failed to load client data");
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const filteredClients = clients.filter(client => {
        // Apply status filter
        if (filterActive !== "all" && client.status !== filterActive) {
            return false;
        }

        // Apply search filter
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            return (
                client.name.toLowerCase().includes(query) ||
                client.email.toLowerCase().includes(query) ||
                client.goal.toLowerCase().includes(query)
            );
        }

        return true;
    });

    const renderClientItem = ({ item }) => (
        <TouchableOpacity
            className="bg-white rounded-lg p-4 mb-3 shadow-sm"
            onPress={() => router.push(`/users/[id]/${item.id}`)}
        >
            <View className="flex-row">
                <View className="w-14 h-14 rounded-full bg-gray-200 mr-3 items-center justify-center">
                    {item.image ? (
                        <Image source={{ uri: item.image }} className="w-full h-full rounded-full" />
                    ) : (
                        <Text className="text-xl font-bold text-gray-500">
                            {item.name.charAt(0)}
                        </Text>
                    )}
                </View>

                <View className="flex-1">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-lg font-bold">{item.name}</Text>
                        <View className={`py-1 px-2 rounded-full ${item.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <Text className={`text-xs font-medium ${item.status === 'active' ? 'text-green-700' : 'text-gray-700'}`}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Text>
                        </View>
                    </View>

                    <Text className="text-gray-500 mb-1">{item.goal}</Text>

                    <View className="flex-row justify-between mt-2">
                        <View>
                            <Text className="text-xs text-gray-500">Last Visit</Text>
                            <Text className="text-xs">{item.lastVisit || "N/A"}</Text>
                        </View>

                        <View>
                            <Text className="text-xs text-gray-500">Next Appointment</Text>
                            <Text className="text-xs">{item.nextAppointment || "Not Scheduled"}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Custom loading component
    const LoadingView = () => (
        <View className="flex-1 justify-center items-center">
            <Text>Loading clients...</Text>
        </View>
    );

    if (loading) return <LoadingView />;

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="px-4 pt-6 pb-4 bg-white">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-2xl font-bold text-gray-800">Clients</Text>
                    <TouchableOpacity
                        className="bg-green-500 p-2 rounded-full"
                        onPress={() => router.push('/users/add')}
                    >
                        {getIcon('userPlus') ? (
                            <Image source={getIcon('userPlus')} className="w-5 h-5" tintColor="#ffffff" />
                        ) : (
                            <Text className="text-white text-sm">+</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className="flex-row bg-gray-100 rounded-lg px-3 py-2 items-center mb-4">
                    {getIcon('search') ? (
                        <Image source={getIcon('search')} className="w-5 h-5 mr-2" tintColor="#9CA3AF" />
                    ) : (
                        <Text className="text-gray-400 mr-2">🔍</Text>
                    )}
                    <TextInput
                        placeholder="Search clients..."
                        className="flex-1 text-gray-800"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            {getIcon('x') ? (
                                <Image source={getIcon('x')} className="w-5 h-5" tintColor="#9CA3AF" />
                            ) : (
                                <Text className="text-gray-400">✕</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filter Tabs */}
                <View className="flex-row">
                    <TouchableOpacity
                        className={`mr-4 pb-2 ${filterActive === 'all' ? 'border-b-2 border-green-500' : ''}`}
                        onPress={() => setFilterActive('all')}
                    >
                        <Text className={`font-medium ${filterActive === 'all' ? 'text-green-500' : 'text-gray-500'}`}>
                            All
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`mr-4 pb-2 ${filterActive === 'active' ? 'border-b-2 border-green-500' : ''}`}
                        onPress={() => setFilterActive('active')}
                    >
                        <Text className={`font-medium ${filterActive === 'active' ? 'text-green-500' : 'text-gray-500'}`}>
                            Active
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`mr-4 pb-2 ${filterActive === 'inactive' ? 'border-b-2 border-green-500' : ''}`}
                        onPress={() => setFilterActive('inactive')}
                    >
                        <Text className={`font-medium ${filterActive === 'inactive' ? 'text-green-500' : 'text-gray-500'}`}>
                            Inactive
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={filteredClients}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderClientItem}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="items-center justify-center py-8">
                        {getIcon('emptyList') ? (
                            <Image source={getIcon('emptyList')} className="w-16 h-16 mb-4" tintColor="#D1D5DB" />
                        ) : (
                            <Text className="text-gray-300 text-5xl mb-4">📋</Text>
                        )}
                        <Text className="text-gray-500 text-center mb-2">No clients found</Text>
                        <Text className="text-gray-400 text-center text-sm">
                            {searchQuery.trim() !== "" ? "Try a different search term" : "Add your first client to get started"}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default ClientsList;