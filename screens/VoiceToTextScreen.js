import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Clipboard, Image, Animated, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Add the getCountryFlag function from TranslationScreen
const getCountryFlag = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

const VoiceToTextScreen = ({ navigation }) => {
  const webViewRef = useRef(null);
  const [transcription, setTranscription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [openDropdown, setOpenDropdown] = useState(false);

  const [dotOpacities] = useState([
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3)
  ]);

  // Updated languages array
  const languages = [
    { 
      label: 'English (US)', 
      value: 'en-US', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('US')}</Text>
    },
    { 
      label: 'Spanish', 
      value: 'es-ES', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('ES')}</Text>
    },
    { 
      label: 'French', 
      value: 'fr-FR', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('FR')}</Text>
    },
    { 
      label: 'German', 
      value: 'de-DE', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('DE')}</Text>
    },
    { 
      label: 'Italian', 
      value: 'it-IT', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('IT')}</Text>
    },
    { 
      label: 'Portuguese', 
      value: 'pt-PT', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('PT')}</Text>
    },
    { 
      label: 'Russian', 
      value: 'ru-RU', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('RU')}</Text>
    },
    { 
      label: 'Chinese', 
      value: 'zh-CN', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('CN')}</Text>
    },
    { 
      label: 'Japanese', 
      value: 'ja-JP', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('JP')}</Text>
    },
    { 
      label: 'Korean', 
      value: 'ko-KR', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('KR')}</Text>
    },
    { 
      label: 'Arabic', 
      value: 'ar-SA', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('SA')}</Text>
    },
    { 
      label: 'Hindi', 
      value: 'hi-IN', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('IN')}</Text>
    },
    { 
      label: 'Urdu', 
      value: 'ur-PK', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('PK')}</Text>
    },
    { 
      label: 'Turkish', 
      value: 'tr-TR', 
      icon: () => <Text style={styles.flagEmoji}>{getCountryFlag('TR')}</Text>
    }
  ];

  const animateDots = () => {
    const animations = dotOpacities.map((opacity, i) => {
      return Animated.sequence([
        Animated.delay(i * 200),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true
        })
      ]);
    });

    Animated.loop(
      Animated.parallel(animations)
    ).start();
  };

  const handleStartListening = () => {
    setIsListening(true);
    webViewRef.current.injectJavaScript(`startListening();`);
    animateDots();
  };

  const handleStopListening = () => {
    setIsListening(false);
    webViewRef.current.injectJavaScript(`stopListening();`);
  };

  // Add clipboard handling
  const handleCopy = async () => {
    try {
      await Clipboard.setString(transcription);
      alert('Text copied to clipboard!');
    } catch (error) {
      alert('Failed to copy text');
    }
  };

  const saveNote = async (text) => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      const existingNotes = savedNotes ? JSON.parse(savedNotes) : [];
      
      const newNote = {
        id: Date.now().toString(),
        content: text,
        date: new Date().toISOString(),
        pinned: false,
      };

      const updatedNotes = [...existingNotes, newNote];
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      
      // Navigate back to Notes screen
      navigation.navigate('Notes');
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Voice To Text</Text>
        <View style={styles.crown}>
          <Icon name="crown" size={1} color="white" />
        </View>
      </View>

      <DropDownPicker
        open={openDropdown}
        setOpen={setOpenDropdown}
        value={language}
        setValue={setLanguage}
        items={languages}
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        listMode="MODAL"
        modalProps={{
          animationType: "slide"
        }}
        modalContentContainerStyle={styles.modalContent}
        modalTitle="Select Language"
        searchable={true}
        searchPlaceholder="Search language..."
        searchTextInputStyle={styles.searchInput}
        searchContainerStyle={styles.searchContainer}
        itemSeparator={true}
        itemSeparatorStyle={styles.separator}
      />

      <View style={styles.textBox}>
        <TextInput
          placeholder="Speak to add text here"
          placeholderTextColor="#999"
          value={transcription}
          onChangeText={setTranscription}
          multiline
          style={styles.input}
        />
        <View style={styles.textBoxIcons}>
          <TouchableOpacity onPress={() => setTranscription('')} style={styles.iconButton}>
            <Icon name="delete" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCopy} style={styles.iconButton}>
            <Icon name="content-copy" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => saveNote(transcription)}
        >
          <Icon name="content-save" size={20} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.micButton, isListening && styles.micButtonActive]}
        onPress={isListening ? handleStopListening : handleStartListening}
      >
        <Icon 
          name={isListening ? "microphone" : "microphone-outline"} 
          size={32} 
          color="#FFF" 
        />
      </TouchableOpacity>

      {isListening && (
        <View style={styles.waveformContainer}>
          <View style={styles.listeningIndicator}>
            <Text style={styles.listeningText}>Listening...</Text>
            <View style={styles.dots}>
              {dotOpacities.map((opacity, index) => (
                <Animated.Text 
                  key={index} 
                  style={[
                    styles.dot,
                    { opacity }
                  ]}
                >
                  ●
                </Animated.Text>
              ))}
            </View>
          </View>
        </View>
      )}

<WebView
  ref={webViewRef}
  source={{
    html: `
      <html>
      <body>
        <script>
          const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
          recognition.lang = '${language}';

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
    setTranscription(prevText => prevText + ' ' + event.nativeEvent.data);
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 20,
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
  dropdownContainer: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  dropdown: {
    borderRadius: 8,
    borderColor: '#E0E0E0',
  },
  textBox: {
    margin: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  textBoxIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  input: {
    fontSize: 16,
    minHeight: 100,
    color: '#333',
    textAlignVertical: 'top',
    padding: 0
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C63FF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '45%',
  },
  micButton: {
    backgroundColor: '#6C63FF',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  micButtonActive: {
    backgroundColor: '#FF4444',
  },
  waveformContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  listeningText: {
    color: '#666',
    fontSize: 16,
    marginRight: 10,
  },
  dots: {
    flexDirection: 'row',
  },
  dot: {
    color: '#6C63FF',
    fontSize: 8,
    marginHorizontal: 2,
    opacity: 0.6,
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

export default VoiceToTextScreen;

