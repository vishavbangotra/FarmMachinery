import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu, MenuItem } from "react-native-material-menu";
import { Ionicons, FontAwesome5, Entypo } from "@expo/vector-icons";
import AuthContext from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { COLORS } from "../constants/styles";

const HomeScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { phoneNumber, setIsAuthenticated } = useContext(AuthContext);
  const navigation = useNavigation();

  const toggleMenu = () => setMenuVisible((prev) => !prev);
  const closeMenu = () => setMenuVisible(false);

  const logout = () => {
    setIsAuthenticated(false);
    SecureStore.deleteItemAsync("jwt");
  };
  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerBar}>
        <Text style={styles.title}>Farm Machinery</Text>
        <Menu
          visible={menuVisible}
          anchor={
            <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
              <Ionicons
                name="person-circle-outline"
                size={28}
                color={COLORS.TEXT_DARK}
              />
            </TouchableOpacity>
          }
          onRequestClose={closeMenu}
        >
          <View style={styles.menuHeader}>
            <Text style={styles.menuText}>{phoneNumber}</Text>
          </View>
          <MenuItem onPress={handleLogout}>Logout</MenuItem>
        </Menu>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome back!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Machinery")}
        >
          <FontAwesome5 name="tractor" size={40} color="#fff" />
          <Text style={styles.buttonText}>Hire In</Text>
          <Text style={styles.buttonSubText}>Rent machinery from others</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("HireOut")}
        >
          <Entypo name="address" size={40} color="#fff" />
          <Text style={styles.buttonText}>Hire Out</Text>
          <Text style={styles.buttonSubText}>
            Offer your machinery for rent
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  iconButton: {
    padding: 4,
    color: COLORS.TEXT_DARK,
  },
  menuHeader: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: COLORS.TEXT_DARK,
  },
  menuText: {
    fontSize: 16,
    color: COLORS.TEXT_DARK,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.TEXT_DARK,
    marginBottom: 40,
  },
  button: {
    width: "100%",
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: "center",
    marginVertical: 12,
    backgroundColor: COLORS.PRIMARY,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginTop: 12,
  },
  buttonSubText: {
    fontSize: 14,
    color: "#fff",
    marginTop: 4,
  },
});
