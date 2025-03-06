import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import * as CONSTANTS from "../constants/styles";

const { width } = Dimensions.get("window");
const OTP_BOX_WIDTH = width * 0.12;

const LoginScreen = ({ setIsAuthenticated }) => {
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const otpInputs = [];

  const handleSendOtp = () => {
    if (phoneNumber.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return;
    }
    setIsOtpSent(true);
    Alert.alert("OTP Sent", "A mock OTP has been sent to your phone");
  };

  const handleOtpDigitChange = (text, index) => {
    if (text.length > 1 || (text && !/^\d$/.test(text))) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      otpInputs[index + 1].focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      Alert.alert("Error", "Please enter a 6-digit OTP");
      return;
    }
    // Mock verification: assume "123456" is correct
    if (otpString === "123456") {
      setIsAuthenticated(true);
    } else {
      Alert.alert("Error", "Invalid OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { marginBottom: 20 }]}>Login</Text>
      {!isOtpSent ? (
        <>
          <View style={styles.phoneContainer}>
            <TextInput
              style={styles.countryCodeInput}
              value={countryCode}
              onChangeText={setCountryCode}
              keyboardType="phone-pad"
              maxLength={3}
            />
            <TextInput
              style={styles.phoneInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="Enter phone number"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Enter the 6-digit OTP</Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleOtpDigitChange(text, index)}
                keyboardType="numeric"
                maxLength={1}
                ref={(ref) => (otpInputs[index] = ref)}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const LoginScreenWithAuth = (props) => {
  const { setIsAuthenticated } = props.route.params;
  return <LoginScreen setIsAuthenticated={setIsAuthenticated} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: CONSTANTS.COLORS.BACKGROUND,
  },
  title: {
    fontSize: CONSTANTS.SIZES.TITLE,
    fontFamily: CONSTANTS.FONTS.BOLD,
    color: CONSTANTS.COLORS.TEXT,
  },
  subtitle: {
    fontSize: CONSTANTS.SIZES.SUBTITLE,
    color: CONSTANTS.COLORS.TEXT,
    marginBottom: 20,
  },
  phoneContainer: { flexDirection: "row", marginBottom: 20 },
  countryCodeInput: {
    width: 60,
    height: 50,
    borderWidth: 1,
    borderColor: CONSTANTS.COLORS.BORDER,
    textAlign: "center",
    marginRight: 10,
  },
  phoneInput: {
    width: 200,
    height: 50,
    borderWidth: 1,
    borderColor: CONSTANTS.COLORS.BORDER,
    paddingHorizontal: 10,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: OTP_BOX_WIDTH * 6 + 30,
    marginBottom: 20,
  },
  otpInput: {
    width: OTP_BOX_WIDTH,
    height: 50,
    borderWidth: 1,
    borderColor: CONSTANTS.COLORS.BORDER,
    textAlign: "center",
  },
  button: {
    backgroundColor: CONSTANTS.COLORS.PRIMARY,
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: CONSTANTS.COLORS.WHITE,
    fontSize: CONSTANTS.SIZES.BUTTON,
    fontFamily: CONSTANTS.FONTS.REGULAR,
  },
});

export default LoginScreenWithAuth;
