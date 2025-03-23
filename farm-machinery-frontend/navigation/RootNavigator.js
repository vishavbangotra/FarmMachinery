import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext"; // Adjust the path
import AuthNavigator from "./AuthNavigator"; // Your auth stack
import AppNavigator from "./AppNavigator"; // Your main app stack

const RootNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
