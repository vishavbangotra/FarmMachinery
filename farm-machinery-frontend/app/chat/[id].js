import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import { useChat } from "../../hooks/useChat";
import { useLocalSearchParams } from "expo-router";

export default function ChatScreen() {
  const { id: chatId } = useLocalSearchParams();
  const { messages, loading, error, sendMessage } = useChat(chatId);
  const [messageText, setMessageText] = useState("");

  const handleSend = async () => {
    if (messageText.trim()) {
      await sendMessage(messageText);
      setMessageText("");
    }
  };

  if (loading) return <Text>Loading messages...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.timestamp}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={messageText}
          onChangeText={setMessageText}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    padding: 8,
    marginVertical: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
});
