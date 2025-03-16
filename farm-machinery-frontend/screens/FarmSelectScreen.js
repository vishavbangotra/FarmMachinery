import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "./MapScreen";

const Stack = createStackNavigator();

const FarmSelectScreen = () => {
  

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Map">
          {(props) => (
            <MapScreen
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
