import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as CONSTANTS from "../constants/styles";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");
const OTP_BOX_WIDTH = width * 0.12;
const API_BASE_URL = "http://10.0.2.2:8080/auth";

const LoginScreen = ({ navigation }) => {
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const otpInputs = useRef([]);

  const { setIsAuthenticated } = useContext(AuthContext);

  const handleSendOtp = async () => {
    try {
      const fullNumber = `${countryCode}${phoneNumber}`;
      if (!fullNumber.match(/^\+\d{10,15}$/)) {
        Alert.alert("Error", "Please enter a valid phone number");
        return;
      }

      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: fullNumber }),
      });

      const data = await response.json();
      if (data.success) {
        setIsOtpSent(true);
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const otpString = otp.join("");
      if (otpString.length !== 6) {
        Alert.alert("Error", "Please enter a 6-digit OTP");
        return;
      }

      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `${countryCode}${phoneNumber}`,
          otp: otpString,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await SecureStore.setItemAsync("jwt", data.token);
        setIsAuthenticated(true);
        if(data.IsNewUser){
          navigation.navigate("Profile");
        }
      } else {
        throw new Error(data.message || "OTP verification failed");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpDigitChange = (text, index) => {
    if (text.length > 1 || (text && !/^\d$/.test(text))) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      otpInputs.current[index + 1].focus();
    } else if (!text && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleResendOtp = async () => {
    await handleSendOtp();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Please sign in to continue</Text>

      {!isOtpSent ? (
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.countryCode]}
              value={countryCode}
              onChangeText={setCountryCode}
              keyboardType="phone-pad"
              maxLength={4}
            />
            <TextInput
              style={[styles.input, styles.phoneInput]}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
              placeholderTextColor={CONSTANTS.COLORS.TEXT_DARK}
              maxLength={10}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSendOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={CONSTANTS.COLORS.BACKGROUND} />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.otpTitle}>Enter Verification Code</Text>
          <Text style={styles.otpSubtitle}>
            Sent to {countryCode}
            {phoneNumber}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleOtpDigitChange(text, index)}
                keyboardType="numeric"
                maxLength={1}
                ref={(ref) => (otpInputs.current[index] = ref)}
                autoFocus={index === 0}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={CONSTANTS.COLORS.BACKGROUND} />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendContainer}
            onPress={handleResendOtp}
            disabled={loading}
          >
            <Text style={styles.resendText}>
              Didn't receive code?{" "}
              <Text style={styles.resendLink}>Resend OTP</Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: CONSTANTS.COLORS.BACKGROUND,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: CONSTANTS.FONTS.BOLD,
    color: CONSTANTS.COLORS.TEXT_DARK,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: CONSTANTS.FONTS.REGULAR,
    color: CONSTANTS.COLORS.SECONDARY,
    marginBottom: 40,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 24,
  },
  input: {
    backgroundColor: CONSTANTS.COLORS.SECONDARY,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: CONSTANTS.COLORS.TEXT_DARK,
  },
  countryCode: {
    width: 80,
    marginRight: 12,
    textAlign: "center",
  },
  phoneInput: {
    flex: 1,
  },
  button: {
    backgroundColor: CONSTANTS.COLORS.PRIMARY,
    width: "100%",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: CONSTANTS.COLORS.BACKGROUND,
    fontSize: 16,
    fontFamily: CONSTANTS.FONTS.SEMIBOLD,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 32,
  },
  otpInput: {
    width: OTP_BOX_WIDTH,
    height: OTP_BOX_WIDTH,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CONSTANTS.COLORS.BORDER,
    backgroundColor: CONSTANTS.COLORS.SECONDARY,
    textAlign: "center",
    fontSize: 18,
    color: CONSTANTS.COLORS.TEXT_DARK
  },
  otpTitle: {
    fontSize: 20,
    fontFamily: CONSTANTS.FONTS.BOLD,
    color: CONSTANTS.COLORS.TEXT_DARK,
    marginBottom: 8,
  },
  otpSubtitle: {
    fontSize: 14,
    fontFamily: CONSTANTS.FONTS.REGULAR,
    color: CONSTANTS.COLORS.TEXT_DARK,
    marginBottom: 32,
  },
  resendContainer: {
    marginTop: 16,
  },
  resendText: {
    color: CONSTANTS.COLORS.TEXT_DARK,
    fontFamily: CONSTANTS.FONTS.REGULAR,
  },
  resendLink: {
    color: CONSTANTS.COLORS.PRIMARY,
    fontFamily: CONSTANTS.FONTS.SEMIBOLD,
  },
});

export default LoginScreen;
