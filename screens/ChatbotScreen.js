import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";

const ChatbotScreen = ({ userId }) => {
  const [loading, setLoading] = useState(true);

  const sendMessageToBackend = async (message) => {
    try {
      const response = await axios.post("http://192.168.10.40:5000/api/chat/send", {
        userId,
        message,
      });

      console.log("Bot Response:", response.data.botResponse);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Inject JavaScript into WebView
  const injectedJavaScript = `
    window.addEventListener("message", (event) => {
      if (event.data && event.data.text) {
        window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
      }
    });
    true;
  `;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}

      <WebView
        source={{
          uri: "https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/03/20/14/20250320145334-QEVNCDRX.json",
        }}
        style={styles.webView}
        onLoad={() => setLoading(false)}
        injectedJavaScript={injectedJavaScript}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          sendMessageToBackend(data.text);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  webView: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});

export default ChatbotScreen;
