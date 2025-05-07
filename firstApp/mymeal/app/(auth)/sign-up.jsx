import { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, TouchableOpacity } from "react-native";

import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const { SignUp } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' // Default role
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [form]);

  const validateForm = () => {
    let errors = {};

    // Validate username field
    if (!form.username) {
      errors.username = 'Username is required.';
    } else if (form.username.length < 3) {
      errors.username = 'Username must be at least 3 characters.';
    }

    // Validate email field
    if (!form.email) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Email is invalid.';
    }

    // Validate password field
    if (!form.password) {
      errors.password = 'Password is required.';
    } else if (form.password.length < 5) {
      errors.password = 'Password must be at least 5 characters.';
    }

    // Set the errors and update form validity
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  /*const navigateBasedOnRole = (role) => {
    switch (role) {
      case 'admin':
        router.replace("/(admin)/dashboard");
        break;
      case 'nutritionist':
        router.replace("/(nutritionists)/dashboard");
        break;
      default:
        // Default for regular users
        router.replace("/(tabs)/home");
    }
  };*/

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please correct the form errors before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Register user with role
      const userData = await SignUp(
        form.username,
        form.email,
        form.password,
        form.role
      );

      // Navigate based on user role
      navigateBasedOnRole(userData.user.role);

      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RoleSelector = () => (
    <View className="flex-row justify-between my-3">
      <TouchableOpacity
        className={`flex-1 py-3 px-2 rounded-l-md ${form.role === 'user' ? 'bg-secondary-100' : 'bg-gray-300'}`}
        onPress={() => setForm({ ...form, role: 'user' })}
      >
        <Text className={`text-center ${form.role === 'user' ? 'text-white' : 'text-black'}`}>User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-1 py-3 px-2 ${form.role === 'nutritionist' ? 'bg-secondary-100' : 'bg-gray-300'}`}
        onPress={() => setForm({ ...form, role: 'nutritionist' })}
      >
        <Text className={`text-center ${form.role === 'nutritionist' ? 'text-white' : 'text-black'}`}>Nutritionist</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-1 py-3 px-2 rounded-r-md ${form.role === 'admin' ? 'bg-secondary-100' : 'bg-gray-300'}`}
        onPress={() => setForm({ ...form, role: 'admin' })}
      >
        <Text className={`text-center ${form.role === 'admin' ? 'text-white' : 'text-black'}`}>Admin</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: '#D5DEDA' }}>
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Text className="text-4xl font-karegular text-center text-secondary-100">
            Welcome!
          </Text>
          <Text className="text-[15px] font-kregular text-black-200 text-center mt-10">
            sign-up to open an account
          </Text>

          <FormField
            title=""
            value={form.username}
            placeholder={"username"}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
            error={errors.username}
          />

          <FormField
            title=""
            value={form.email}
            placeholder={"email"}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-3"
            keyboardType="email-address"
            error={errors.email}
          />

          <FormField
            title=""
            value={form.password}
            placeholder={"password"}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-3"
            secureTextEntry={true}
            error={errors.password}
          />

          <Text className="text-[15px] font-kregular text-black-200 mt-5">
            Select your role:
          </Text>
          <RoleSelector />

          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit}
            otherStyles="mt-5"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-10 flex-row gap-2" style={{ color: "#688F66", textAlign: "center" }}>
            <Text className="text-lg text-black-200 font-kregular">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-kbold text-secondary"
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

/*import React from 'react';
import { View } from 'react-native';
import { EndpointDebugger } from '../../components';

const SignUp = () => {
  return (
    <View style={{ flex: 1 }}>

      <EndpointDebugger />
    </View>
  );
};

export default SignUp;*/