import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert } from "react-native";

import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { SignIn, userRole } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigateBasedOnRole = (role) => {
    switch (role) {
      case 'admin':
        router.replace("/adindex");
        break;
      case 'nutritionist':
        router.replace("/dashboard");
        break;
      default:
        // Default for regular users
        router.replace("/home");
    }
  };

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      // Login and get user data with role
      const userData = await SignIn(form.email, form.password);

      // Navigate based on user role
      navigateBasedOnRole(userData.user.role);

      Alert.alert("Success", "Signed in successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

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
            Welcome Back!
          </Text>
          <Text className="text-[15px] font-kregular text-black-200 text-center mt-10">
            sign-in to access your account
          </Text>

          <FormField
            title=""
            value={form.email}
            placeholder={"email"}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-10"
            keyboardType="email-address"
          />

          <FormField
            title=""
            placeholder={"password"}
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-5"
            secureTextEntry={true}
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            otherStyles="mt-20"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-10 flex-row gap-2" style={{ color: "#688F66", textAlign: "center" }}>
            <Text className="text-lg text-black-200 font-kregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-kbold text-secondary"
            >
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;