
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HireOutScreen from '../screens/HireOutScreen';
import AddMachineryScreen from '../screens/AddMachineryScreen';
import ManageMachineryScreen from '../screens/ManageMachineryScreen';

const HireOutStack = createStackNavigator();

const HireOutNavigator = () => {
  return (
    <HireOutStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HireOutStack.Screen name="HireOut" component={HireOutScreen} />
      <HireOutStack.Screen name="AddMachinery" component={AddMachineryScreen} />
      <HireOutStack.Screen name="ManageMachinery" component={ManageMachineryScreen} />
    </HireOutStack.Navigator>
  );
}

export default HireOutNavigator