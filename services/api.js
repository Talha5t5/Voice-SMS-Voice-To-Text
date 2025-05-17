import axios from "axios";

const API_URL = "http://192.168.10.40:5000/api/chat"; // Change this to your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Save a message
export const saveChat = async (userId, message, botResponse) => {
  try {
    const response = await api.post("/save", { userId, message, botResponse });
    return response.data;
  } catch (error) {
    console.error("Error saving chat:", error);
    return { error: "Failed to save chat" };
  }
};

// Get chat history
export const getChatHistory = async (userId) => {
  try {
    const response = await api.get(`/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return { error: "Failed to fetch chat history" };
  }
};

export default api;
