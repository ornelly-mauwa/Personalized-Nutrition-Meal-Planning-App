import { StatusBar } from "expo-status-bar";
import { Redirect, router, Link } from "expo-router";
import { View, Text, Image, ScrollView, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

import { images } from "../constants";
import { CustomButton, Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";
import { getUserRoles } from "../lib/api";

const Welcome = () => {

  const { loading, isLogged, userRole, setUserRole } = useGlobalContext();
  const [checkingRole, setCheckingRole] = useState(true); // new state to avoid flicker

  useEffect(() => {
    const fetchRole = async () => {
      if (isLogged && !userRole) {
        try {
          const role = await getUserRoles();
          setUserRole(role);
        } catch (error) {
          console.error("Failed to fetch user role:", error);
        }
      }
      setCheckingRole(false);
    };

    fetchRole();
  }, [isLogged]);

  if (!loading && isLogged && !checkingRole) {
    if (userRole === "admin") return <Redirect href="/admin-dashboard" />;
    if (userRole === "nutritionist") return <Redirect href="/dashboard" />;
    return <Redirect href="/home" />;
  }

  return (
    <SafeAreaView>
      <Loader isLoading={loading || checkingRole} />
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <Text className="text-3xl font-karegular text-black-100 mt-40 text-center">
            My meal
          </Text>
          <Text className="text-xl font-jregular text-secondary-100 mt-10 text-center">
            healthy meal made possible!
          </Text>

          <CustomButton
            title="Start"
            handlePress={() => router.push("/sign-up")}
            containerStyles="mt-60"
            otherStyles="mt-10"
          />

          <View className="flex justify-center pt-10 flex-row gap-2">
            <Text className="text-lg text-black-200 font-kregular">
              Already have an account?
            </Text>
            <Link href="/sign-in" className="text-lg font-kbold text-secondary">
              sign in
            </Link>
          </View>
        </View>
      </ScrollView>

      <StatusBar style="light" />
    </SafeAreaView>
  );
};

export default Welcome;