import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert } from "react-native";
import { createClient } from '@supabase/supabase-js';
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

// Supabase configuration
const supabaseUrl = 'https://jygkhetecyfdvyfgxuer.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5Z2toZXRlY3lmZHZ5Zmd4dWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDYxOTIsImV4cCI6MjA2MzI4MjE5Mn0.z63Ggm5QwvxXFoosYwdIrYs94JuzM7WFcAAIj3gymi0';
const supabase = createClient(supabaseUrl, supabaseKey);

const SignIn = () => {
  const { setUser } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigateBasedOnRole = async (user) => {
    try {
      // Get user profile with role information
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const role = data?.role || 'user';

      // Store user info in context
      setUser({
        id: user.id,
        email: user.email,
        role: role
      });

      // Navigate based on role
      switch (role) {
        case 'admin':
          router.replace("/adindex");
          break;
        case 'nutritionist':
          router.replace("/nuindex");
          break;
        default:
          // Default for regular users
          router.replace("/home");
      }
    } catch (error) {
      console.error("Error fetching user role:", error.message);
      // Default navigation if role fetch fails
      router.replace("/home");
    }
  };

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Correct usage of Supabase signInWithPassword
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;

      // Navigate based on user role if login successful
      await navigateBasedOnRole(data.user);

      Alert.alert("Success", "Signed in successfully");
    } catch (error) {
      setError(error.message);
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

          {error && (
            <Text className="text-red-500 text-center mt-2">
              {error}
            </Text>
          )}

          <CustomButton
            title="Sign In"
            handlePress={submit}
            otherStyles="mt-20"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-10 flex-row gap-2">
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

          <Link
            href="/forgot-password"
            className="text-lg font-kregular text-secondary-100 text-center mt-4"
          >
            Forgot Password?
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;