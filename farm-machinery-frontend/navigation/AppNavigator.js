import React from "react";
import { createBottomTabNavigator, Navigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Assuming Expo is used
import HireInScreen from "../screens/HireInScreen";
import HireOutNavigator from "./HireOutNavigator";
import HireInNavigator from "./HireInNavigator";
import { COLORS } from "../constants/styles"; // Assuming constants are in a separate file
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import MachineryScreen from "../screens/HireIn/MachineryScreen";
import MachinerySearchScreen from "../screens/HireIn/MachinerySearchScreen";
import MapScreen from "../screens/HireIn/MapScreen";
import MachinerySearchDetailScreen from "../screens/HireIn/MachinerySearchDetailScreen";
import HireOutScreen from "../screens/HireOut/HireOutScreen";
import AddMachineryScreen from "../screens/HireOut/AddMachineryScreen";
import ManageMachineryScreen from "../screens/HireOut/ManageMachineryScreen";
import AddMachineryDetailScreen from "../screens/HireOut/AddMachineryDetailScreen";
import BookingListScreen from "../screens/HireOut/BookingListScreen"; 
import AddFarmForMachineryScreen from "../screens/HireOut/AddFarmForMachineryScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Machinery" component={MachineryScreen} options={{headerShown: false}}/>
      <Stack.Screen
        name="MachinerySearch"
        component={MachinerySearchScreen}
        options={{ title: "Search Machinery" }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ title: "Map" }}
      />

      <Stack.Screen
        name="MachinerySearchDetail"
        component={MachinerySearchDetailScreen}
        options={{ title: "Search Machinery" }}
      />
      <Stack.Screen name="HireOut" component={HireOutScreen} />
      <Stack.Screen
        name="AddMachinery"
        component={AddMachineryScreen}
        options={{ title: "Add Machinery" }}
      />
      <Stack.Screen name="ManageMachinery" component={ManageMachineryScreen} />
      <Stack.Screen name="BookingList" component={BookingListScreen} />
      <Stack.Screen
        name="AddFarmForMachineryScreen"
        component={AddFarmForMachineryScreen}
      />
      <Stack.Screen
        name="AddMachineryDetailScreen"
        component={AddMachineryDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
