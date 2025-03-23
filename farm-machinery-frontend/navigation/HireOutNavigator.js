
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HireOutScreen from '../screens/HireOut/HireOutScreen';
import AddMachineryScreen from '../screens/HireOut/AddMachineryScreen';
import ManageMachineryScreen from '../screens/HireOut/ManageMachineryScreen';
import AddMachineryDetailScreen from '../screens/HireOut/AddMachineryDetailScreen';
import BookingListScreen from '../screens/HireOut/BookingListScreen';

const HireOutStack = createStackNavigator();

const HireOutNavigator = () => {
  return (
    <HireOutStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
    </HireOutStack.Navigator>
  );
}

export default HireOutNavigator