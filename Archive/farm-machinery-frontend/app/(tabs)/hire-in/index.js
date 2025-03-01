import { FlatList, View, Text } from "react-native";
import { useRouter } from "expo-router";
import MachineryCard from "../../../components/MachineryCard";
import { useMachinery } from "../../../hooks/useMachinery";

export default function HireInScreen() {
  const router = useRouter();
  const { machinery, loading } = useMachinery();

  return (
    <View className="flex-1 p-2">
      <FlatList
        data={machinery}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MachineryCard
            item={item}
            onPress={() => router.push(`/hire-in/${item.id}`)}
          />
        )}
        ListEmptyComponent={<Text>No machinery available</Text>}
      />
    </View>
  );
}
