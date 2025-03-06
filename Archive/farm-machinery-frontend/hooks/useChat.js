import { useState, useEffect } from "react";
import axios from "axios";
// import { API_BASE_URL } from "../constants/config";
import { useAuth } from "../context/AuthContext";

export function useChat(chatId) {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch chat messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
    //   const response = await axios.get(
    //     `${API_BASE_URL}/api/chats/${chatId}/messages`,
    //     {
    //       headers: { Authorization: `Bearer ${token}` },
    //     }
    //   );
      setMessages("");
    } catch (error) {
      setError(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async (text) => {
    try {
      const newMessage = {
        text,
        senderId: "currentUserId", // Replace with actual sender ID
        timestamp: new Date().toISOString(),
      };

      // Optimistic update
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Send to backend
      await axios.post(
        `${API_BASE_URL}/api/chats/${chatId}/messages`,
        newMessage,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refetch messages to ensure consistency
      await fetchMessages();
    } catch (error) {
      setError(error.response?.data || error.message);
      // Revert optimistic update on error
      setMessages((prevMessages) => prevMessages.slice(0, -1));
    }
  };

  // Polling for new messages (optional)
  useEffect(() => {
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [chatId]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
}
