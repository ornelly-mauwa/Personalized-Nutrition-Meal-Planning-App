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
          name="admin-dashboard"
          options={{
            title: "dashboard",
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

export default TabLayout;*/
import { StatusBar } from "expo-status-bar";
import { Redirect, Stack, useRouter, usePathname } from "expo-router";
import { Image, Text, View, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { icons } from "../../constants";
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

// Navigation items for the sidebar
const navigationItems = [
  {
    title: 'Dashboard',
    icon: icons.home,
    path: '/adindex'
  },
  {
    title: 'Users',
    icon: icons.profile,
    path: '/users',
    expanded: false,
    children: [
      { title: 'All Users', path: '/users/usindex' },
      { title: 'Create User', path: '/users/create' }
    ]
  },
  {
    title: 'Nutritionists',
    icon: icons.nutrition || icons.home, // Fallback if nutrition icon doesn't exist
    path: '/nutritionists',
    expanded: false,
    children: [
      { title: 'All Nutritionists', path: '/nutritionists/nuindex' },
      { title: 'Approval Queue', path: '/nutritionists/approval' }
    ]
  },
  {
    title: 'Settings',
    icon: icons.settings || icons.home, // Fallback if settings icon doesn't exist
    path: '/settings',
    expanded: false,
    children: [
      { title: 'General', path: '/settings/setindex' },
      { title: 'System', path: '/settings/system' }, // Fixed path
      { title: 'Templates', path: '/settings/templates' },
      { title: 'Food Database', path: '/settings/food-database' }
    ]
  }
];

const AdminLayout = () => {
  const { loading, isLogged } = useGlobalContext();
  const dimensions = useWindowDimensions();
  const [expandedItems, setExpandedItems] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(dimensions.width > 768);
  const pathname = usePathname();
  const router = useRouter();

  // Check if not logged in and redirect
  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  // Toggle expand/collapse of navigation group
  const toggleExpand = (title) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Check if a path is active (current route)
  const isActiveRoute = (path) => {
    if (path === '/admin' && pathname === '/admin') {
      return true;
    }
    return pathname.startsWith(path) && path !== '/admin';
  };

  // Check if a navigation group has an active child
  const hasActiveChild = (children) => {
    return children?.some(child => pathname === child.path);
  };

  const renderSidebarContent = () => (

    <ScrollView style={styles.drawerScrollView}>
      <View style={styles.drawerHeader}>
        <Text style={styles.appTitle}>Admin Panel</Text>
      </View>
      <View style={styles.drawerContent}>
        {navigationItems.map((item, index) => (
          <View key={index}>
            {item.children ? (
              // Item with children (expandable)
              <View>
                <TouchableOpacity
                  style={[
                    styles.drawerItem,
                    (isActiveRoute(item.path) || hasActiveChild(item.children)) && styles.activeItem
                  ]}
                  onPress={() => toggleExpand(item.title)}
                >
                  <View style={styles.itemRow}>
                    <Image
                      source={item.icon}
                      resizeMode="contain"
                      style={styles.drawerItemIcon}
                      tintColor={(isActiveRoute(item.path) || hasActiveChild(item.children)) ? "#3F836E" : "#BDBDBD"}
                    />
                    <Text
                      style={[
                        styles.drawerItemText,
                        (isActiveRoute(item.path) || hasActiveChild(item.children)) && styles.activeItemText
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <Ionicons
                    name={expandedItems[item.title] ? "chevron-down-outline" : "chevron-forward-outline"}
                    size={18}
                    color="#BDBDBD"
                  />
                </TouchableOpacity>

                {expandedItems[item.title] && (
                  <View style={styles.childrenContainer}>
                    {item.children.map((child, childIndex) => (
                      <TouchableOpacity
                        key={childIndex}
                        style={[
                          styles.childItem,
                          pathname === child.path && styles.activeChildItem
                        ]}
                        onPress={() => router.push(child.path)}
                      >
                        <Text
                          style={[
                            styles.childItemText,
                            pathname === child.path && styles.activeItemText
                          ]}
                        >
                          {child.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ) : (
              // Single item (no children)
              <TouchableOpacity
                style={[
                  styles.drawerItem,
                  isActiveRoute(item.path) && styles.activeItem
                ]}
                onPress={() => router.push(item.path)}
              >
                <View style={styles.itemRow}>
                  <Image
                    source={item.icon}
                    resizeMode="contain"
                    style={styles.drawerItemIcon}
                    tintColor={isActiveRoute(item.path) ? "#3F836E" : "#BDBDBD"}
                  />
                  <Text
                    style={[
                      styles.drawerItemText,
                      isActiveRoute(item.path) && styles.activeItemText
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // Responsive handling
  const isMobile = dimensions.width < 768;

  return (
    <SafeAreaView style={styles.container}>
      {/* Loading indicator */}
      <Loader isLoading={loading} />

      {/* Mobile drawer toggle button */}
      {isMobile && (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setDrawerOpen(!drawerOpen)}
        >
          <Ionicons name={drawerOpen ? "close-outline" : "menu-outline"} size={24} color="#333" />
        </TouchableOpacity>
      )}

      <View style={styles.contentWrapper}>
        {/* Sidebar drawer */}
        {(drawerOpen || !isMobile) && (
          <View style={[
            styles.drawer,
            isMobile && styles.mobileDrawer
          ]}>
            {renderSidebarContent()}
          </View>
        )}

        {/* Main content */}
        <View style={[
          styles.content,
          (!isMobile && drawerOpen) && styles.contentWithDrawer,
          (isMobile && drawerOpen) && styles.hiddenContent
        ]}>
          {/* Stack navigator for the admin section */}
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </View>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  drawer: {
    width: 260,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  mobileDrawer: {
    position: 'absolute',
    height: '100%',
    zIndex: 1000,
  },
  drawerScrollView: {
    flex: 1,
  },
  drawerHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3F836E',
    fontFamily: 'kbold', // Use your custom font
  },
  drawerContent: {
    paddingVertical: 8,
  },
  drawerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerItemIcon: {
    width: 22,
    height: 22,
  },
  drawerItemText: {
    fontSize: 15,
    color: '#BDBDBD',
    marginLeft: 12,
    fontFamily: 'kregular', // Use your custom font
  },
  activeItem: {
    backgroundColor: '#f0faf8',
  },
  activeItemText: {
    color: '#3F836E',
    fontWeight: '500',
    fontFamily: 'kbold', // Use your custom font
  },
  childrenContainer: {
    paddingLeft: 12,
    backgroundColor: '#fafafa',
  },
  childItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    paddingLeft: 34,
  },
  activeChildItem: {
    backgroundColor: '#f0faf8',
  },
  childItemText: {
    fontSize: 14,
    color: '#BDBDBD',
    fontFamily: 'kregular', // Use your custom font
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f7fafc',
  },
  contentWithDrawer: {
    marginLeft: 0,
  },
  hiddenContent: {
    opacity: 0.3,
  },
  menuButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1100,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default AdminLayout;
