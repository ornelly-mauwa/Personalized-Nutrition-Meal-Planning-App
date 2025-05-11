/*import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

import { icons } from "../../constants";
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";



const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-1 mt-6  ">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-7 h-7"
      />
      <Text
        className={`${focused ? "font-kbold" : "font-kregular"} `}
        style={{ color: color, fontSize: 10 }}

      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;
  <Loader isLoading={loading} />

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#3F836E",
          tabBarInactiveTintColor: "#BDBDBD",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#ffff",
            borderTopWidth: 0,
            borderTopColor: "#232533",
            borderRadius: 30,
            height: 70,
            margin: 15,
            marginBottom: 30,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.20,
            shadowRadius: 3.84,
            elevation: 5
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="store"
          options={{
            title: "Store",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.store}
                color={color}
                name="Store"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="favori"
          options={{
            title: "Favori",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.favori}
                color={color}
                name="Favori"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}

              />
            ),
          }}
        />
      </Tabs>
      <StatusBar />
    </>
  );
};

export default TabLayout;*/

import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const TabIcon = ({ iconName, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-1">
      <Ionicons name={iconName} size={24} color={color} />
      <Text
        className={`${focused ? "font-kbold" : "font-kregular"}`}
        style={{ color: color, fontSize: 10 }}
      >
        {name}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  const { loading, isLogged } = useGlobalContext();

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
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.2,
            shadowRadius: 3.84,
            elevation: 5,
            paddingBottom: 10
          },
        }}
      >
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
        <Tabs.Screen
          name="favori"
          options={{
            headerShown: false,
            href: null, // This prevents the route from being navigable via tabs
          }}
        />
        <Tabs.Screen
          name="store"
          options={{
            headerShown: false,
            href: null, // This prevents the route from being navigable via tabs
          }}
        />

        <Tabs.Screen
          name="meal-detail"
          options={{
            headerShown: false,
            href: null, // This prevents the route from being navigable via tabs
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            headerShown: false,
            href: null, // This prevents the route from being navigable via tabs
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
    </>
  );
}
