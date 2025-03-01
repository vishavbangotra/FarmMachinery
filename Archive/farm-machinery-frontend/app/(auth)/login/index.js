import { useState } from "react";
import { View, Text, Button } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { router } from "expo-router";
import { auth } from "../../../constants/firebaseConfig";
import { signInWithPhoneNumber } from "firebase/auth";
import { useRef } from "react";


export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const phoneInput = useRef(null);

  const handleSendOTP = async () => {
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneInput.current?.getNumberAfterValidation().number
      );
      router.push("/otp-verify");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 p-4">
      <PhoneInput
        ref={phoneInput}
        defaultValue={phone}
        defaultCode={countryCode}
        layout="first"
        onChangeFormattedText={setPhone}
      />
      <Button title="Send OTP" onPress={handleSendOTP} />
    </View>
  );
}
