import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs, Stack } from "expo-router";
import { Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useGlobalContext } from "../../context/GlobalProvider";

// Make sure to import Loader properly
import { Loader } from "../../components";

const TabIcon = ({ iconName, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-1">
      <Ionicons name={iconName} size={24} color={color} />
      <Text
        className={`${focused ? "font-kbold" : "font-kregular"}`}
        style={{ color: color, fontSize: 10, marginTop: 15 }}
      >
        {name}
      </Text>
    </View>
  );
};

export default function AppLayout() {
  const { loading, isLogged } = useGlobalContext();

  // Redirect to sign-in if not logged in
  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <>
      {loading && <Loader isLoading={loading} />}

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#3F836E",
          tabBarInactiveTintColor: "#BDBDBD",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 0,
            position: 'absolute',
            bottom: 25,
            left: 20,
            right: 20,
            borderRadius: 30,
            height: 70,
            shadowColor: "#000",
            shadowOffset: {
              width: 15,
              height: 4,
            },
            shadowOpacity: 0.2,
            shadowRadius: 3.84,
            elevation: 5,
            paddingBottom: 10,
            paddingTop: 15,
          },
        }}
      >
        {/* Only include the main tabs you want to show in the tab bar */}
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="home-outline"
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="meal-plan"
          options={{
            title: "Meal Plan",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="calendar-outline"
                color={color}
                name="Meal Plan"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="tracking"
          options={{
            title: "Track",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="add-circle-outline"
                color={color}
                name="Track"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: "Progress",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="stats-chart-outline"
                color={color}
                name="Progress"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="person-outline"
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />

      </Tabs>
      <StatusBar style="auto" />
    </>
  );
}