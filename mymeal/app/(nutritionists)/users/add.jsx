import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import { Loader, } from "../../../components";
import { useGlobalContext } from "../../../context/GlobalProvider";

const AddClient = () => {
    const { loading, setLoading } = useGlobalContext();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        height: "",
        weight: "",
        goal: "",
        dietaryRestrictions: "",
        medicalConditions: "",
    });

    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleSubmit = async () => {
        const requiredFields = ["name", "email"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
            Alert.alert("Missing Information", `Please fill in all required fields: ${missingFields.join(", ")}`);
            return;
        }

        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            Alert.alert("Success", "Client added successfully!", [
                { text: "OK", onPress: () => router.replace("/users/index") },
            ]);
        } catch (error) {
            Alert.alert("Error", "Failed to add client. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Loader isLoading={loading} />

            <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <MaterialIcons
                        name="arrow-back"
                        size={24}
                        color={"#3F836E"}
                    />
                </TouchableOpacity>
                <Text className="ml-2 text-xl font-kbold text-gray-800">Add New Client</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="mb-6">
                    <Text className="mb-4 text-lg font-kbold text-gray-800">Basic Information</Text>

                    <View className="mb-4">
                        <Text className="mb-1 text-sm font-kmedium text-gray-700">Full Name *</Text>
                        <TextInput
                            className="p-3 bg-gray-100 border border-gray-200 rounded-lg font-kregular"
                            placeholder="Enter client's full name"
                            value={formData.name}
                            onChangeText={(text) => handleChange("name", text)}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="mb-1 text-sm font-kmedium text-gray-700">Email Address *</Text>
                        <TextInput
                            className="p-3 bg-gray-100 border border-gray-200 rounded-lg font-kregular"
                            placeholder="Enter client's email"
                            keyboardType="email-address"
                            value={formData.email}
                            onChangeText={(text) => handleChange("email", text)}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="mb-1 text-sm font-kmedium text-gray-700">Phone Number</Text>
                        <TextInput
                            className="p-3 bg-gray-100 border border-gray-200 rounded-lg font-kregular"
                            placeholder="Enter client's phone number"
                            keyboardType="phone-pad"
                            value={formData.phone}
                            onChangeText={(text) => handleChange("phone", text)}
                        />
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="mb-4 text-lg font-kbold text-gray-800">Physical Information</Text>

                    <View className="flex-row mb-4">
                        <View className="flex-1 mr-2">
                            <Text className="mb-1 text-sm font-kmedium text-gray-700">Age</Text>
                            <TextInput
                                className="p-3 bg-gray-100 border border-gray-200 rounded-lg font-kregular"
                                placeholder="Age"
                                keyboardType="numeric"
                                value={formData.age}
                                onChangeText={(text) => handleChange("age", text)}
                            />
                        </View>

                        <View className="flex-1 ml-2">
                            <Text className="mb-1 text-sm font-kmedium text-gray-700">Gender</Text>
                            <TextInput
                                className="p-3 bg-gray-100 border border-gray-200 rounded-lg font-kregular"
                                placeholder="Gender"
                                value={formData.gender}
                                onChangeText={(text) => handleChange("gender", text)}
                            />
                        </View>
                    </View>

                    <View className="flex-row mb-4">
                        <View className="flex-1 mr-2">
                            <Text className="mb-1 text-sm font-kmedium text-gray-700">Height (cm)</Text>
                            <TextInput
                                className="p-3 bg-gray-100 border border-gray-200 rounded-lg font-kregular"
                                placeholder="Height"
                                keyboardType="numeric"
                                value={formData.height}
                                onChangeText={(text) => handleChange("height", text)}
                            />
                        </View>

                        <View className="flex-1 ml-2">
                            <Text className="mb-1 text-sm font-kmedium text-gray-700">Weight (kg)</Text>
                            <TextInput
                                className="p-3 bg-gray-100 border border-gray-200 rounded-lg font-kregular"
                                placeholder="Weight"
                                keyboardType="numeric"
                                value={formData.weight}
                                onChangeText={(text) => handleChange("weight", text)}
                            />
                        </View>
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="mb-4 text-lg font-kbold text-gray-800">Nutrition Information</Text>

                    <View className="mb-4">
                        <Text className="mb-1 text-sm font-kmedium text-gray-700">Goal</Text>
                        <TextInput
                            className="p-3 bg-gray-100 border border-gray-200 rounded-lg font-kregular"
                            placeholder="Weight loss, muscle gain, etc."
                            value={formData.goal}
                            onChangeText={(text) => handleChange("goal", text)}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="mb-1 text-sm font-kmedium text-gray-700">Dietary Restrictions</Text>
                        <TextInput
                            className="p-3 bg-gray-100 border border-gray-200 rounded-lg font-kregular"
                            placeholder="Vegetarian, gluten-free, etc."
                            value={formData.dietaryRestrictions}
                            onChangeText={(text) => handleChange("dietaryRestrictions", text)}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="mb-1 text-sm font-kmedium text-gray-700">Medical Conditions</Text>
                        <TextInput
                            className="p-3 bg-gray-100 border border-gray-200 rounded-lg font-kregular"
                            placeholder="Diabetes, hypertension, etc."
                            value={formData.medicalConditions}
                            onChangeText={(text) => handleChange("medicalConditions", text)}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Add Client</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    cancelButtonText: {
        color: '#4a5568',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'kbold',
    },
    submitButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#3F836E',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'kbold',
    },
});

export default AddClient;
