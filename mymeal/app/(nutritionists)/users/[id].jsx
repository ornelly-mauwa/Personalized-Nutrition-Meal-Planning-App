import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "../../../constants";
import { Loader } from "../../../components";

const ClientDetail = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [client, setClient] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would be an API call using the id parameter
        const fetchClientDetails = () => {
            // Mock data
            setTimeout(() => {
                setClient({
                    id: parseInt(id),
                    name: "Jane Smith",
                    image: null,
                    email: "jane.smith@example.com",
                    phone: "555-123-4567",
                    goal: "Weight loss - 15 pounds",
                    status: "active",
                    dietaryRestrictions: ["Gluten-free", "Low sodium"],
                    allergies: ["Nuts", "Shellfish"],
                    age: 34,
                    height: "5'6\"",
                    weight: "165 lbs",
                    targetWeight: "150 lbs",
                    activityLevel: "Moderate",
                    medicalConditions: ["Hypertension"],
                    notes: "Jane is motivated to lose weight for her sister's wedding in August. She works a desk job and finds it hard to be active during the day.",
                    joinDate: "February 15, 2025",
                    lastVisit: "May 16, 2025",
                    nextAppointment: "May 23, 2025",
                    mealPlans: [
                        { id: 101, title: "Weight Loss - Week 1", date: "May 2, 2025", status: "completed" },
                        { id: 102, title: "Weight Loss - Week 2", date: "May 9, 2025", status: "completed" },
                        { id: 103, title: "Weight Loss - Week 3", date: "May 16, 2025", status: "active" },
                    ],
                    progressData: [
                        { date: "Mar 1, 2025", weight: 172 },
                        { date: "Mar 15, 2025", weight: 170 },
                        { date: "Apr 1, 2025", weight: 168 },
                        { date: "Apr 15, 2025", weight: 167 },
                        { date: "May 1, 2025", weight: 165 },
                        { date: "May 15, 2025", weight: 165 },
                    ],
                    appointments: [
                        { id: 201, date: "March 2, 2025", time: "10:00 AM", type: "Initial Consultation", notes: "Discussed goals and dietary preferences" },
                        { id: 202, date: "March 16, 2025", time: "10:30 AM", type: "Follow-up", notes: "Reviewed first meal plan and progress" },
                        { id: 203, date: "April 6, 2025", time: "11:00 AM", type: "Follow-up", notes: "Adjusted plan due to travel schedule" },
                        { id: 204, date: "April 27, 2025", time: "10:00 AM", type: "Follow-up", notes: "Progress is on track, discussed exercise options" },
                        { id: 205, date: "May 16, 2025", time: "10:30 AM", type: "Follow-up", notes: "Weight loss has plateaued, adjusting macros" },
                        { id: 206, date: "May 23, 2025", time: "10:00 AM", type: "Follow-up", status: "scheduled" },
                    ]
                });
                setLoading(false);
            }, 500);
        };

        fetchClientDetails();
    }, [id]);

    const handleCreateMealPlan = () => {
        if (client) {
            router.push(`/users/[id]=${client.id}`);
        }
    };

    const handleScheduleAppointment = () => {
        Alert.alert(
            "Schedule Appointment",
            "Would you like to schedule a new appointment for this client?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Schedule", onPress: () => console.log("Schedule appointment") }
            ]
        );
    };

    const renderOverviewTab = () => (
        <View>
            {/* Client Stats */}
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <Text className="font-kbold text-gray-800 mb-3">Client Information</Text>

                <View className="flex-row flex-wrap">
                    <View className="w-1/2 mb-3">
                        <Text className="text-xs text-gray-500">Age</Text>
                        <Text className="font-kmedium">{client.age} years</Text>
                    </View>

                    <View className="w-1/2 mb-3">
                        <Text className="text-xs text-gray-500">Height</Text>
                        <Text className="font-kmedium">{client.height}</Text>
                    </View>

                    <View className="w-1/2 mb-3">
                        <Text className="text-xs text-gray-500">Current Weight</Text>
                        <Text className="font-kmedium">{client.weight}</Text>
                    </View>

                    <View className="w-1/2 mb-3">
                        <Text className="text-xs text-gray-500">Target Weight</Text>
                        <Text className="font-kmedium">{client.targetWeight}</Text>
                    </View>

                    <View className="w-1/2 mb-3">
                        <Text className="text-xs text-gray-500">Activity Level</Text>
                        <Text className="font-kmedium">{client.activityLevel}</Text>
                    </View>

                    <View className="w-1/2 mb-3">
                        <Text className="text-xs text-gray-500">Client Since</Text>
                        <Text className="font-kmedium">{client.joinDate}</Text>
                    </View>
                </View>
            </View>

            {/* Dietary Info */}
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <Text className="font-kbold text-gray-800 mb-3">Dietary Information</Text>

                <View className="mb-3">
                    <Text className="text-xs text-gray-500 mb-1">Dietary Restrictions</Text>
                    <View className="flex-row flex-wrap">
                        {client.dietaryRestrictions.map((item, index) => (
                            <View key={index} className="bg-green-100 rounded-full px-3 py-1 mr-2 mb-2">
                                <Text className="text-green-700 text-xs">{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View>
                    <Text className="text-xs text-gray-500 mb-1">Allergies</Text>
                    <View className="flex-row flex-wrap">
                        {client.allergies.map((item, index) => (
                            <View key={index} className="bg-red-100 rounded-full px-3 py-1 mr-2 mb-2">
                                <Text className="text-red-700 text-xs">{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* Medical Conditions */}
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <Text className="font-kbold text-gray-800 mb-3">Medical Information</Text>

                <View>
                    <Text className="text-xs text-gray-500 mb-1">Medical Conditions</Text>
                    <View className="flex-row flex-wrap">
                        {client.medicalConditions.length > 0 ? (
                            client.medicalConditions.map((item, index) => (
                                <View key={index} className="bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2">
                                    <Text className="text-blue-700 text-xs">{item}</Text>
                                </View>
                            ))
                        ) : (
                            <Text className="text-gray-500">None reported</Text>
                        )}
                    </View>
                </View>
            </View>

            {/* Notes */}
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <Text className="font-kbold text-gray-800 mb-3">Notes</Text>
                <Text className="text-gray-700">{client.notes}</Text>
            </View>
        </View>
    );

    const renderMealPlansTab = () => (
        <View>
            <View className="flex-row justify-between items-center mb-4">
                <Text className="font-kbold text-gray-800">Meal Plans</Text>
                <TouchableOpacity
                    className="bg-green-500 px-3 py-2 rounded-lg flex-row items-center"
                    onPress={handleCreateMealPlan}
                >
                    <Image source={icons.plus} className="w-4 h-4 mr-1" tintColor="#ffffff" />
                    <Text className="text-white text-sm font-kmedium">Create Plan</Text>
                </TouchableOpacity>
            </View>

            {client.mealPlans.map((plan, index) => (
                <TouchableOpacity
                    key={index}
                    className="bg-white rounded-lg p-4 mb-3 shadow-sm"
                    onPress={() => router.push(`/nutritionists/meal-planner/${plan.id}`)}
                >
                    <View className="flex-row justify-between items-center">
                        <Text className="font-kbold">{plan.title}</Text>
                        <View className={`py-1 px-2 rounded-full ${plan.status === 'active' ? 'bg-green-100' :
                            plan.status === 'completed' ? 'bg-gray-100' :
                                'bg-yellow-100'
                            }`}>
                            <Text className={`text-xs font-kmedium ${plan.status === 'active' ? 'text-green-700' :
                                plan.status === 'completed' ? 'text-gray-700' :
                                    'text-yellow-700'
                                }`}>
                                {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mt-2">
                        <Image source={icons.calendar} className="w-4 h-4 mr-2" tintColor="#9CA3AF" />
                        <Text className="text-gray-500 text-sm">{plan.date}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderProgressTab = () => (
        <View>
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <Text className="font-kbold text-gray-800 mb-3">Weight Progress</Text>

                {/* Here would be a chart component in a real app */}
                <View className="h-40 bg-gray-100 rounded-lg items-center justify-center mb-3">
                    <Text className="text-gray-500">Weight Progress Chart</Text>
                </View>

                <View className="py-2">
                    {client.progressData.map((entry, index) => (
                        <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-100">
                            <Text className="text-gray-700">{entry.date}</Text>
                            <Text className="font-kmedium">{entry.weight} lbs</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const renderAppointmentsTab = () => (
        <View>
            <View className="flex-row justify-between items-center mb-4">
                <Text className="font-kbold text-gray-800">Appointments</Text>
                <TouchableOpacity
                    className="bg-blue-500 px-3 py-2 rounded-lg flex-row items-center"
                    onPress={handleScheduleAppointment}
                >
                    <Image source={icons.calendar} className="w-4 h-4 mr-1" tintColor="#ffffff" />
                    <Text className="text-white text-sm font-kmedium">Schedule</Text>
                </TouchableOpacity>
            </View>

            {client.appointments.map((appointment, index) => (
                <View
                    key={index}
                    className="bg-white rounded-lg p-4 mb-3 shadow-sm"
                >
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="font-kbold">{appointment.type}</Text>
                        {appointment.status === "scheduled" ? (
                            <View className="bg-blue-100 py-1 px-2 rounded-full">
                                <Text className="text-blue-700 text-xs font-kmedium">Upcoming</Text>
                            </View>
                        ) : null}
                    </View>

                    <View className="flex-row items-center mb-2">
                        <Image source={icons.calendar} className="w-4 h-4 mr-2" tintColor="#9CA3AF" />
                        <Text className="text-gray-500 text-sm">{appointment.date}</Text>

                        <Image source={icons.clock} className="w-4 h-4 ml-4 mr-2" tintColor="#9CA3AF" />
                        <Text className="text-gray-500 text-sm">{appointment.time}</Text>
                    </View>

                    {appointment.notes ? (
                        <View>
                            <Text className="text-xs text-gray-500 mb-1">Notes</Text>
                            <Text className="text-gray-700">{appointment.notes}</Text>
                        </View>
                    ) : null}
                </View>
            ))}
        </View>
    );

    if (loading) return <Loader isLoading={loading} />;
    if (!client) return <Text className="p-5">Client not found.</Text>;

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-4 pt-4 pb-6">
                <View className="flex-row items-center mb-2">
                    <TouchableOpacity
                        className="mr-4"
                        onPress={() => router.back()}
                    >
                        <Image source={icons.arrowLeft} className="w-6 h-6" />
                    </TouchableOpacity>
                    <Text className="text-xl font-kbold text-gray-800 flex-1">Client Details</Text>
                    <TouchableOpacity className="ml-2">
                        <Image source={icons.edit} className="w-5 h-5" tintColor="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center mt-3">
                    <View className="w-16 h-16 rounded-full bg-gray-200 mr-4 items-center justify-center">
                        {client.image ? (
                            <Image source={{ uri: client.image }} className="w-full h-full rounded-full" />
                        ) : (
                            <Text className="text-2xl font-kbold text-gray-500">
                                {client.name.charAt(0)}
                            </Text>
                        )}
                    </View>

                    <View className="flex-1">
                        <Text className="text-2xl font-kbold">{client.name}</Text>
                        <Text className="text-gray-500">{client.goal}</Text>

                        <View className="flex-row items-center mt-1">
                            <View className={`py-1 px-2 rounded-full ${client.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                <Text className={`text-xs font-kmedium ${client.status === 'active' ? 'text-green-700' : 'text-gray-700'}`}>
                                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="flex-row mt-4">
                    <TouchableOpacity
                        className="bg-green-500 rounded-full p-2 mr-3"
                        onPress={() => { /* Make phone call */ }}
                    >
                        <Image source={icons.phone} className="w-5 h-5" tintColor="#ffffff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-blue-500 rounded-full p-2 mr-3"
                        onPress={() => { /* Send email */ }}
                    >
                        <Image source={icons.mail} className="w-5 h-5" tintColor="#ffffff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-purple-500 rounded-full p-2"
                        onPress={() => { /* Send message */ }}
                    >
                        <Image source={icons.message} className="w-5 h-5" tintColor="#ffffff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <View className="bg-white px-4 py-2 flex-row justify-between border-t border-gray-100">
                <TouchableOpacity
                    className={`pb-2 px-2 ${activeTab === 'overview' ? 'border-b-2 border-green-500' : ''}`}
                    onPress={() => setActiveTab('overview')}
                >
                    <Text className={`font-kmedium ${activeTab === 'overview' ? 'text-green-500' : 'text-gray-500'}`}>
                        Overview
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`pb-2 px-2 ${activeTab === 'mealplans' ? 'border-b-2 border-green-500' : ''}`}
                    onPress={() => setActiveTab('mealplans')}
                >
                    <Text className={`font-kmedium ${activeTab === 'mealplans' ? 'text-green-500' : 'text-gray-500'}`}>
                        Meal Plans
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`pb-2 px-2 ${activeTab === 'progress' ? 'border-b-2 border-green-500' : ''}`}
                    onPress={() => setActiveTab('progress')}
                >
                    <Text className={`font-kmedium ${activeTab === 'progress' ? 'text-green-500' : 'text-gray-500'}`}>
                        Progress
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`pb-2 px-2 ${activeTab === 'appointments' ? 'border-b-2 border-green-500' : ''}`}
                    onPress={() => setActiveTab('appointments')}
                >
                    <Text className={`font-kmedium ${activeTab === 'appointments' ? 'text-green-500' : 'text-gray-500'}`}>
                        Appointments
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'mealplans' && renderMealPlansTab()}
                {activeTab === 'progress' && renderProgressTab()}
                {activeTab === 'appointments' && renderAppointmentsTab()}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ClientDetail;