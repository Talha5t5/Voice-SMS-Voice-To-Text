import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from "react-native";
import { WebView } from "react-native-webview";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ChatbotScreen = () => {
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const handleReportSubmit = () => {
    if (!reportText.trim()) {
      Alert.alert("Please enter a message to report.");
      return;
    }

    setShowReportModal(false);
    setReportText("");
    Alert.alert("✅ Report submitted successfully");
  };

  const injectedJavaScript = `
    window.addEventListener("message", (event) => {
      if (event.data && event.data.text) {
        window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
      }
    });
    true;
  `;

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#000" : "#fff" }]}>
      {/* WebView */}
      <WebView
        source={{
          uri: "https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/03/20/14/20250320145334-QEVNCDRX.json",
        }}
        style={styles.webView}
        onLoad={() => setLoading(false)}
        injectedJavaScript={injectedJavaScript}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          console.log("Message from Botpress:", data.text);
        }}
      />

      {/* Report Button */}
      <TouchableOpacity
        onPress={() => setShowReportModal(true)}
        style={[
          styles.reportButton,
          {
            backgroundColor: isDarkMode ? "rgba(50, 50, 53, 0.6)" : "#f2f2f7",
          },
        ]}
      >
        <Text
          style={{
            color: isDarkMode ? "rgba(194, 194, 204, 0.6)" : "rgba(27, 27, 36, 0.6)",
            fontWeight: "600",
            marginRight: 6,
          }}
        >
          Report
        </Text>
        <Icon
          name="alert-circle-outline"
          size={18}
          color={isDarkMode ? "rgba(194, 194, 204, 0.6)" : "rgba(60,60,67,0.6)"}
        />
      </TouchableOpacity>

      {/* Loading Spinner */}
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}

      {/* Report Modal */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? "#222" : "#fff" }]}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 10,
                color: isDarkMode ? "#fff" : "#000",
              }}
            >
              Report Message
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: isDarkMode ? "#fff" : "#000",
                  borderColor: isDarkMode ? "#555" : "#ccc",
                },
              ]}
              placeholder="Describe the issue..."
              placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
              value={reportText}
              onChangeText={setReportText}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowReportModal(false)} style={styles.modalButton}>
                <Text style={{ color: "#aaa" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleReportSubmit} style={styles.modalButton}>
                <Text style={{ color: "#2196F3", fontWeight: "bold" }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
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
  reportButton: {
    position: "absolute",
    top: 12,
    right: 120,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  modalContent: {
    borderRadius: 10,
    padding: 20,
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  modalButton: {
    marginLeft: 15,
  },
});

export default ChatbotScreen;
