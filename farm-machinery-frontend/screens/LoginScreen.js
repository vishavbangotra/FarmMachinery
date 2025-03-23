import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import 'dotenv/config'
import * as CONSTANTS from "../constants/styles";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
  PhoneAuthProvider,
} from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig,{
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const auth = getAuth(app);

const { width } = Dimensions.get("window");
const OTP_BOX_WIDTH = width * 0.12;

const LoginScreen = ({ navigation }) => {
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const recaptchaVerifier = useRef(null);
  const otpInputs = [];

  const handleSendOtp = async () => {
    try {
      if (phoneNumber.length !== 10) {
        Alert.alert("Error", "Please enter a valid 10-digit phone number");
        return;
      }

      setLoading(true);
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const phoneProvider = await signInWithPhoneNumber(
        auth,
        fullPhoneNumber,
        recaptchaVerifier.current
      );

      setVerificationId(phoneProvider.verificationId);
      setIsOtpSent(true);
      Alert.alert(
        "OTP Sent",
        "Please check your phone for the verification code"
      );
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
      otpInputs[index + 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const otpString = otp.join("");
      if (otpString.length !== 6) {
        Alert.alert("Error", "Please enter a 6-digit OTP");
        return;
      }

      const credential = PhoneAuthProvider.credential(
        verificationId,
        otpString
      );

      await signInWithCredential(auth, credential);
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", "Invalid OTP code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
      />

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
          <TouchableOpacity
            style={styles.button}
            onPress={handleSendOtp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Sending..." : "Send OTP"}
            </Text>
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
          <TouchableOpacity
            style={styles.button}
            onPress={handleVerifyOtp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Text>
          </TouchableOpacity>
        </>
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
    borderRadius: 4,
  },
  buttonText: {
    color: CONSTANTS.COLORS.BACKGROUND,
    fontSize: CONSTANTS.SIZES.BUTTON,
    fontFamily: CONSTANTS.FONTS.REGULAR,
  },
  countryCodeInput: {
    // ... existing styles
    color: CONSTANTS.COLORS.TEXT,
  },
  phoneInput: {
    // ... existing styles
    color: CONSTANTS.COLORS.TEXT,
  },
  otpInput: {
    // ... existing styles
    color: CONSTANTS.COLORS.TEXT,
  },
});

export default LoginScreen;
