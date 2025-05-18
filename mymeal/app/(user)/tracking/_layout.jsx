
import { Stack } from "expo-router";

export default function TrackingLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="log-meal"
                options={{
                    headerTitle: "Log Meal",
                    headerTitleStyle: {
                        fontFamily: "Montserrat-SemiBold", // Adjust with your font
                    },
                    headerShadowVisible: false,
                    headerTintColor: "#3F836E",
                }}
            />
        </Stack>
    );
}