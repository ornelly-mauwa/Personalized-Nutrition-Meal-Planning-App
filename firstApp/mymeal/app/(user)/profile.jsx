

import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useCallback } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";


const profile = () => {
  // Logout button component
  const { handleLogout } = useGlobalContext();

  const onLogout = async () => {
    try {
      await handleLogout();
      // Redirect to welcome/login screen
      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show error message to user
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <SafeAreaView >
      <Text>profile</Text>
      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default profile;
