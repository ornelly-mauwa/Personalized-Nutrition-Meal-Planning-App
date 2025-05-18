import { Stack } from "expo-router";

export default function MealPlanLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    headerTitle: "Meal Details",
                    headerTitleStyle: {
                        fontFamily: "Montserrat-SemiBold", // Adjust with your font
                    },
                    headerShadowVisible: false,
                    headerTintColor: "#3F836E",
                }}
            />
            <Stack.Screen
                name="favorites"
                options={{
                    headerTitle: "Favorites",
                    headerTitleStyle: {
                        fontFamily: "Montserrat-SemiBold", // Adjust with your font
                    },
                    headerShadowVisible: false,
                    headerTintColor: "#3F836E",
                }}
            />
            <Stack.Screen
                name="store"
                options={{
                    headerTitle: "Meal Store",
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