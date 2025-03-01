import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreenWithAuth from "../screens/LoginScreen";

const Stack = createStackNavigator();

const AuthNavigator = ({ setIsAuthenticated }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Login"
        component={LoginScreenWithAuth}
        initialParams={{ setIsAuthenticated }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
