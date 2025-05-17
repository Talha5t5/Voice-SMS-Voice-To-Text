import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Share, Clipboard } from 'react-native';
import { WebView } from 'react-native-webview';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const getCountryFlag = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

const TranslationScreen = ({ navigation }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const webViewRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  // Dropdown states
  const [sourceOpen, setSourceOpen] = useState(false);
  const [targetOpen, setTargetOpen] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('es');

  // Expanded language list with country flags
  const languages = [
    { 
      label: 'Auto Detect', 
      value: 'auto', 
      icon: () => <MaterialCommunityIcons name="web" size={20} color="#4285F4" />
    },
    { 
      label: 'English (US)', 
      value: 'en', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('US')}</Text>
    },
    { 
      label: 'Spanish', 
      value: 'es', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('ES')}</Text>
    },
    { 
      label: 'French', 
      value: 'fr', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('FR')}</Text>
    },
    { 
      label: 'German', 
      value: 'de', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('DE')}</Text>
    },
    { 
      label: 'Italian', 
      value: 'it', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('IT')}</Text>
    },
    { 
      label: 'Portuguese', 
      value: 'pt', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('PT')}</Text>
    },
    { 
      label: 'Russian', 
      value: 'ru', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('RU')}</Text>
    },
    { 
      label: 'Chinese', 
      value: 'zh', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('CN')}</Text>
    },
    { 
      label: 'Japanese', 
      value: 'ja', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('JP')}</Text>
    },
    { 
      label: 'Korean', 
      value: 'ko', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('KR')}</Text>
    },
    { 
      label: 'Arabic', 
      value: 'ar', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('SA')}</Text>
    },
    { 
      label: 'Hindi', 
      value: 'hi', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('IN')}</Text>
    },
    { 
      label: 'Turkish', 
      value: 'tr', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('TR')}</Text>
    },
    { 
      label: 'Vietnamese', 
      value: 'vi', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('VN')}</Text>
    },
    { 
      label: 'Thai', 
      value: 'th', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('TH')}</Text>
    },
    { 
      label: 'Dutch', 
      value: 'nl', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('NL')}</Text>
    },
    { 
      label: 'Greek', 
      value: 'el', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('GR')}</Text>
    },
    { 
      label: 'Polish', 
      value: 'pl', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('PL')}</Text>
    },
    { 
      label: 'Indonesian', 
      value: 'id', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('ID')}</Text>
    },
    { 
      label: 'Ukrainian', 
      value: 'uk', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('UA')}</Text>
    },
    { 
      label: 'Urdu', 
      value: 'ur', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('PK')}</Text>
    }
  ];

  // Free translation function using Google Translate
  const translateText = async (text, targetLang) => {
    if (!text.trim()) {
      alert('Please enter text to translate');
      return;
    }

    setIsLoading(true);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data[0]) {
        const translatedText = data[0]
          .map(segment => segment[0])
          .join('');
        setTranslatedText(translatedText);
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Voice recognition setup
  const handleStartListening = () => {
    setIsListening(true);
    webViewRef.current.injectJavaScript(`startListening();`);
  };

  const handleStopListening = () => {
    setIsListening(false);
    webViewRef.current.injectJavaScript(`stopListening();`);
  };

  // Add these functions for copy and share
  const handleCopy = async () => {
    try {
      await Clipboard.setString(translatedText);
      alert('Text copied to clipboard!');
    } catch (error) {
      alert('Failed to copy text');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: translatedText,
        title: 'Translated Text'
      });
    } catch (error) {
      alert('Failed to share text');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Translation</Text>
        <View style={styles.crown}>
          <Icon name="crown" size={24} color="white" />
        </View>
      </View>

      <View style={styles.languageSelector}>
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={sourceOpen}
            value={sourceLanguage}
            items={languages}
            setOpen={setSourceOpen}
            setValue={setSourceLanguage}
            style={styles.dropdown}
            containerStyle={styles.dropdownList}
            placeholder="Select language"
            zIndex={2000}
            listMode="MODAL"
            modalProps={{
              animationType: "slide"
            }}
            modalContentContainerStyle={styles.modalContent}
            modalTitle="Select Source Language"
            searchable={true}
            searchPlaceholder="Search language..."
            searchTextInputStyle={styles.searchInput}
            searchContainerStyle={styles.searchContainer}
            itemSeparator={true}
            itemSeparatorStyle={styles.separator}
          />
        </View>

        <View style={styles.arrowContainer}>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
        </View>

        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={targetOpen}
            value={targetLanguage}
            items={languages.filter(lang => lang.value !== 'auto')}
            setOpen={setTargetOpen}
            setValue={setTargetLanguage}
            style={styles.dropdown}
            containerStyle={styles.dropdownList}
            placeholder="Select language"
            zIndex={1000}
            listMode="MODAL"
            modalProps={{
              animationType: "slide"
            }}
            modalContentContainerStyle={styles.modalContent}
            modalTitle="Select Target Language"
            searchable={true}
            searchPlaceholder="Search language..."
            searchTextInputStyle={styles.searchInput}
            searchContainerStyle={styles.searchContainer}
            itemSeparator={true}
            itemSeparatorStyle={styles.separator}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Type in here.."
          placeholderTextColor="#999"
          value={sourceText}
          onChangeText={setSourceText}
        />
        <TouchableOpacity 
          style={[styles.micButton, isListening && styles.micButtonActive]}
          onPress={isListening ? handleStopListening : handleStartListening}
        >
          <Icon 
            name={isListening ? "microphone" : "microphone-outline"} 
            size={24} 
            color="#FFF" 
          />
        </TouchableOpacity>
      </View>

      {translatedText ? (
        <View style={styles.outputContainer}>
          <Text style={styles.translatedText}>{translatedText}</Text>
          <View style={styles.outputActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleCopy}
            >
              <Icon name="content-copy" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Icon name="share-variant" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <TouchableOpacity 
        style={[styles.translateButton, isLoading && styles.translateButtonDisabled]}
        onPress={() => translateText(sourceText, targetLanguage)}
        disabled={isLoading}
      >
        <Icon name="translate" size={24} color="#FFF" style={styles.translateIcon} />
        <Text style={styles.translateButtonText}>
          {isLoading ? 'Translating...' : 'Translate'}
        </Text>
      </TouchableOpacity>

      <WebView
        ref={webViewRef}
        source={{
          html: `
            <html>
            <body>
              <script>
                const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                recognition.lang = '${sourceLanguage}';
                recognition.continuous = false;
                recognition.interimResults = false;

                window.startListening = function() {
                  recognition.start();
                  recognition.onresult = function(event) {
                    let text = event.results[0][0].transcript;
                    window.ReactNativeWebView.postMessage(text);
                  };
                };

                window.stopListening = function() {
                  recognition.stop();
                };
              </script>
            </body>
            </html>
          `,
        }}
        onMessage={(event) => {
          setSourceText(event.nativeEvent.data);
          setIsListening(false);
        }}
        style={{ height: 0 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  crown: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#6C63FF',
    borderRadius: 25,
    padding: 10,
    marginBottom: 20,
    zIndex: 1000,
  },
  dropdownContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    borderRadius: 20,
    minHeight: 40,
    paddingHorizontal: 10,
  },
  dropdownList: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  arrowContainer: {
    paddingHorizontal: 10,
  },
  inputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    minHeight: 150,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  micButton: {
    width: 40,
    height: 40,
    backgroundColor: '#6C63FF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  micButtonActive: {
    backgroundColor: '#FF4444',
  },
  outputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  translatedText: {
    fontSize: 16,
    color: '#333',
  },
  outputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    padding: 8,
    marginLeft: 10,
  },
  translateButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 25,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  translateButtonDisabled: {
    backgroundColor: '#A8A8A8',
  },
  translateIcon: {
    marginRight: 8,
  },
  translateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  modalContent: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },
  searchContainer: {
    padding: 15,
    borderBottomColor: '#F0F0F0',
    borderBottomWidth: 1,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
});

export default TranslationScreen; 