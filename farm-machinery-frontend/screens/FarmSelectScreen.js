import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FarmSelectScreen from "./FarmSelectScreen";

const Stack = createStackNavigator();

const FarmSelectScreen = () => {
  

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Map">
          {(props) => (
            <FarmSelectScreen
              {...props}
              savedFarms={farms}
              onSelectFarm={handleSelectFarm}
              onAddFarm={handleAddFarm}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default FarmSelectScreen;
