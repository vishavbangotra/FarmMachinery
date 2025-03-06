
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OperationScreen from '../screens/HireIn/OperationScreen';
import MachineryScreen from '../screens/HireIn/MachineryScreen';
import DistanceSliderScreen from '../screens/HireIn/DistanceSliderScreen';
import MachinerySearchScreen from '../screens/HireIn/MachinerySearchScreen';
import MachinerySearchDetailScreen from '../screens/HireIn/MachinerySearchDetailScreen';

const HireInStack = createStackNavigator();

const HireInNavigator = () => {
  return (
    <HireInStack.Navigator initialRouteName="Operation">
      <HireInStack.Screen name="Operation" component={OperationScreen} />
      <HireInStack.Screen name="Machinery" component={MachineryScreen} />
      <HireInStack.Screen
        name="DistanceSlider"
        component={DistanceSliderScreen}
      />
      <HireInStack.Screen
        name="MachinerySearch"
        component={MachinerySearchScreen}
        options={{ title: "Search Machinery" }}
      />
      <HireInStack.Screen
        name="MachinerySearchDetail"
        component={MachinerySearchDetailScreen}
        options={{ title: "Search Machinery" }}
      />
    </HireInStack.Navigator>
  );
}

export default HireInNavigator