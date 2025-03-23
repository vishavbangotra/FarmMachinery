// App.js
import React from "react";
import RootNavigator from "./navigation/RootNavigator.js";
import 'react-native-get-random-values';
import { AuthProvider } from "./context/AuthContext.js";


export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
