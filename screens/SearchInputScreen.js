import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Linking,
  Alert,
  Clipboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WebView } from 'react-native-webview';
import DropDownPicker from 'react-native-dropdown-picker';

const platformUrls = {
  // Communication
  Reddit: 'https://www.reddit.com/search?q=',
  Quora: 'https://www.quora.com/search?q=',
  Flipboard: 'https://flipboard.com/search/',
  MSN: 'https://www.msn.com/search?q=',

  // Shopping
  Amazon: 'https://www.amazon.com/s?k=',
  AliBaba: 'https://www.alibaba.com/trade/search?SearchText=',
  'Daraz.pk': 'https://daraz.pk/catalog/?q=',
  OLX: 'https://www.olx.com/items?q=',
  Ebay: 'https://www.ebay.com/sch/i.html?_nkw=',
  AliExpress: 'https://www.aliexpress.com/wholesale?SearchText=',

  // Social Media
  Facebook: 'https://www.facebook.com/search/top?q=',
  Instagram: 'https://www.instagram.com/explore/tags/',
  Twitter: 'https://twitter.com/search?q=',
  Youtube: 'https://www.youtube.com/results?search_query=',
  TikTok: 'https://www.tiktok.com/search?q=',
  Pinterest: 'https://www.pinterest.com/search/pins/?q=',

  // Search Engines
  Google: 'https://www.google.com/search?q=',
  Bing: 'https://www.bing.com/search?q=',
  DuckDuckGo: 'https://duckduckgo.com/?q=',
  Yahoo: 'https://search.yahoo.com/search?p=',
  Wikipedia: 'https://wikipedia.org/wiki/Special:Search?search=',
};

const SearchInputScreen = ({ navigation, route }) => {
  const { platform } = route.params;
  const [searchText, setSearchText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [openLanguage, setOpenLanguage] = useState(false);
  const webViewRef = useRef(null);

  const languages = [
    { label: 'English (US)', value: 'en-US', icon: () => <Text>🇺🇸</Text> },
    { label: 'English (UK)', value: 'en-GB', icon: () => <Text>🇬🇧</Text> },
    { label: 'Spanish', value: 'es-ES', icon: () => <Text>🇪🇸</Text> },
    { label: 'French', value: 'fr-FR', icon: () => <Text>🇫🇷</Text> },
    { label: 'German', value: 'de-DE', icon: () => <Text>🇩🇪</Text> },
    { label: 'Italian', value: 'it-IT', icon: () => <Text>🇮🇹</Text> },
    { label: 'Portuguese', value: 'pt-PT', icon: () => <Text>🇵🇹</Text> },
    { label: 'Russian', value: 'ru-RU', icon: () => <Text>🇷🇺</Text> },
    { label: 'Chinese', value: 'zh-CN', icon: () => <Text>🇨🇳</Text> },
    { label: 'Japanese', value: 'ja-JP', icon: () => <Text>🇯🇵</Text> },
    { label: 'Korean', value: 'ko-KR', icon: () => <Text>🇰🇷</Text> },
    { label: 'Arabic', value: 'ar-SA', icon: () => <Text>🇸🇦</Text> },
    { label: 'Hindi', value: 'hi-IN', icon: () => <Text>🇮🇳</Text> },
    { label: 'Turkish', value: 'tr-TR', icon: () => <Text>🇹🇷</Text> },
    { label: 'Urdu', value: 'ur-PK', icon: () => <Text>🇵🇰</Text> },
  ];

  const handleSearch = () => {
    if (!searchText.trim()) return;
    const query = encodeURIComponent(searchText);
    const url = platformUrls[platform.name] + query;
    Linking.openURL(url);
  };

  const handleCopy = () => {
    if (!searchText) {
      Alert.alert('Nothing to copy');
      return;
    }
    Clipboard.setString(searchText);
    Alert.alert('Copied to clipboard');
  };

  const startListening = () => {
    setIsListening(true);
    webViewRef.current.injectJavaScript(`startListening();`);
  };

  const stopListening = () => {
    setIsListening(false);
    webViewRef.current.injectJavaScript(`stopListening();`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{platform.name}</Text>
        <View style={styles.crown}>
          <Icon name="crown" size={24} color="white" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.languagePickerContainer}>
          <DropDownPicker
            open={openLanguage}
            value={selectedLanguage}
            items={languages}
            setOpen={setOpenLanguage}
            setValue={setSelectedLanguage}
            style={styles.languagePicker}
            dropDownContainerStyle={styles.dropDownContainer}
            searchable={true}
            searchPlaceholder="Search language..."
          />
        </View>

        <View style={styles.searchCard}>
          <TextInput
            style={styles.textInput}
            placeholder="Speak or type here..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            multiline
          />
          <View style={styles.inputActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setSearchText('')}>
              <Icon name="delete-outline" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
              <Icon name="content-copy" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="magnify" size={24} color="#FFF" />
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.micButton, isListening && styles.micButtonActive]}
          onPress={isListening ? stopListening : startListening}
        >
          <Icon name={isListening ? 'microphone' : 'microphone-outline'} size={32} color="#FFF" />
        </TouchableOpacity>
      </View>

      <WebView
        ref={webViewRef}
        source={{ html: `
          <html><body>
          <script>
            const recognition = new (window.SpeechRecognition||window.webkitSpeechRecognition)();
            recognition.lang = '${selectedLanguage}';
            recognition.continuous = false;
            recognition.interimResults = false;
            window.startListening = () => { recognition.start(); recognition.onresult = e => window.ReactNativeWebView.postMessage(e.results[0][0].transcript); };
            window.stopListening = () => recognition.stop();
          </script>
          </body></html>
        ` }}
        onMessage={e => { setSearchText(e.nativeEvent.data); setIsListening(false); }}
        style={{ height: 0 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF', elevation: 2 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  crown: { width: 40, height: 0, backgroundColor: 'white', borderRadius: 0, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  content: { flex: 1, padding: 16, alignItems: 'center' },
  languagePickerContainer: { width: '100%', marginBottom: 20 },
  languagePicker: { backgroundColor: '#FFF', borderColor: '#E0E0E0', borderRadius: 12 },
  dropDownContainer: { backgroundColor: '#FFF', borderColor: '#E0E0E0', borderRadius: 12, elevation: 4 },
  searchCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 20, elevation: 2, width: '100%' },
  textInput: { fontSize: 16, color: '#333', minHeight: 120, textAlignVertical: 'top', marginBottom: 8 },
  inputActions: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12 },
  actionButton: { padding: 8, marginLeft: 16 },
  searchButton: {
    backgroundColor: '#6C63FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 30,
    marginBottom: 12,
    zIndex: 2,
    elevation: 4,
    position: 'relative',
    width: '80%',
  },
  searchButtonText: { color: '#FFF', fontSize: 18, fontWeight: '600', marginLeft: 8 },
  micButton: {
    backgroundColor: '#6C63FF',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    zIndex: 1,
    position: 'relative',
    marginTop: 8,
  },
  micButtonActive: { backgroundColor: '#FF4444' },
});

export default SearchInputScreen;
