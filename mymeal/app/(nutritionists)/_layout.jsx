import { StatusBar } from "expo-status-bar";
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
          name="dashboard"
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

export default TabLayout;
