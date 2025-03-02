import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Assuming Expo is used
import HireInScreen from "../screens/HireInScreen";
import HireOutNavigator from "./HireOutNavigator";
import { COLORS } from "../constants/styles"; // Assuming constants are in a separate file

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Hide the header as in the original code
        tabBarActiveTintColor: COLORS.PRIMARY, // Color for active tab labels and icons
        tabBarInactiveTintColor: COLORS.SECONDARY, // Color for inactive tab labels and icons
        tabBarStyle: {
          backgroundColor: COLORS.BACKGROUND, // Background color of the tab bar
        },
      }}
    >
      <Tab.Screen
        name="Hire In"
        component={HireInScreen}
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
