import { useLocalSearchParams, router } from "expo-router";
import { View, Text, Button } from "react-native";
import { useMachinery } from "../../../hooks/useMachinery";

export default function MachineryDetails() {
  const { id } = useLocalSearchParams();
  const { getMachineryById } = useMachinery();
  const machinery = getMachineryById(id);

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold">{machinery?.name}</Text>
      <Text className="text-lg">Rate: ${machinery?.hourlyRate}/hr</Text>
      <Button
        title="Request Booking"
        onPress={() => router.push(`/booking/${machinery?.id}`)}
      />
    </View>
  );
}
