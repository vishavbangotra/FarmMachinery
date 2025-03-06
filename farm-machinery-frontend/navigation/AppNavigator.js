import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Assuming Expo is used
import HireInScreen from "../screens/HireInScreen";
import HireOutNavigator from "./HireOutNavigator";
import HireInNavigator from "./HireInNavigator";
import { COLORS } from "../constants/styles"; // Assuming constants are in a separate file

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.TERTIARY, // Green for active tab
        tabBarInactiveTintColor: COLORS.PRIMARY, // Ensure this contrasts with BACKGROUND
        tabBarStyle: {
          backgroundColor: COLORS.BACKGROUND,
          height: 60,
          elevation: 4, // Shadow for Android
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12, // Adjust as needed
          fontFamily: "YourSansSerifFont", // Replace with your font
        },
      }}
    >
      <Tab.Screen
        name="Hire In"
        component={HireInNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bus-sharp" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Hire Out"
        component={HireOutNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-sharp" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
