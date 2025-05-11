import React from "react";
import {
  createBottomTabNavigator,
  Navigator,
} from "@react-navigation/bottom-tabs";
import { COLORS } from "../constants/styles"; // Assuming constants are in a separate file
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import MachineryScreen from "../screens/HireIn/MachineryScreen";
import MachinerySearchScreen from "../screens/HireIn/MachinerySearchScreen";
import FarmSelectScreen from "../screens/HireIn/FarmSelectScreen";
import HireOutScreen from "../screens/HireOut/HireOutScreen";
import AddMachineryScreen from "../screens/HireOut/AddMachineryScreen";
import ManageMachineryScreen from "../screens/HireOut/ManageMachineryScreen";
import BookingListScreen from "../screens/HireOut/BookingListScreen";
import AddFarmForMachineryScreen from "../screens/HireOut/AddFarmForMachineryScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Machinery"
        component={MachineryScreen}
        options={{
          title: "Select Machinery",
          headerStyle: { backgroundColor: COLORS.BACKGROUND },
          headerTintColor: COLORS.TEXT_DARK,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MachinerySearch"
        component={MachinerySearchScreen}
        options={({ navigation }) => ({
          title: "Search Machinery",
          headerStyle: { backgroundColor: COLORS.BACKGROUND },
          headerTintColor: COLORS.TEXT_DARK,
        })}
      />
      <Stack.Screen
        name="Map"
        component={FarmSelectScreen}
        options={{
          title: "Select Farm",
          headerStyle: { backgroundColor: COLORS.BACKGROUND },
          headerTintColor: COLORS.TEXT_DARK,
        }}
      />
      <Stack.Screen
        name="HireOut"
        component={HireOutScreen}
        options={{
          title: "Hire Out",
          headerStyle: { backgroundColor: COLORS.BACKGROUND },
          headerTintColor: COLORS.TEXT_DARK,
        }}
      />
      <Stack.Screen
        name="AddMachinery"
        component={AddMachineryScreen}
        options={{
          title: "Add Machinery",
          headerStyle: { backgroundColor: COLORS.BACKGROUND },
          headerTintColor: COLORS.TEXT_DARK,
        }}
      />
      <Stack.Screen
        name="ManageMachinery"
        component={ManageMachineryScreen}
        options={{
          title: "Your Machinery",
          headerStyle: { backgroundColor: COLORS.BACKGROUND },
          headerTintColor: COLORS.TEXT_DARK,
        }}
      />
      <Stack.Screen
        name="BookingList"
        component={BookingListScreen}
        options={({ navigation }) => ({
          title: "Bookings",
          headerStyle: { backgroundColor: COLORS.BACKGROUND },
          headerTintColor: COLORS.TEXT_DARK,
        })}
      />
      <Stack.Screen
        name="AddFarmForMachineryScreen"
        component={AddFarmForMachineryScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
