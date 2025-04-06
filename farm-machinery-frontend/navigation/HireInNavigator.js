
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MachineryScreen from '../screens/HireIn/MachineryScreen';
import MachinerySearchScreen from '../screens/HireIn/MachinerySearchScreen';
import MachinerySearchDetailScreen from '../screens/HireIn/MachinerySearchDetailScreen';
import MapScreen from '../screens/HireIn/MapScreen';

const HireInStack = createStackNavigator();

const HireInNavigator = () => {
  return (
    <HireInStack.Navigator initialRouteName="Machinery">
    </HireInStack.Navigator>
  );
}

export default HireInNavigator