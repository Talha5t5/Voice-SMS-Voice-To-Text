import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ChatbotScreen from "./screens/ChatbotScreen";
import HomeScreen from "./screens/HomeScreen";
import TranslationScreen from './screens/TranslationScreen';
import VoiceToTextScreen from "./screens/VoiceToTextScreen";
import VoiceRecordingScreen from "./screens/VoiceRecordingScreen";
import RecordingsListScreen from './screens/RecordingsListScreen';
import NotesScreen from './screens/NotesScreen';
import VoiceSearchScreen from './screens/VoiceSearchScreen';
import SearchInputScreen from './screens/SearchInputScreen';
import SplashScreen from "./screens/SplashScreen";
import mobileAds from "react-native-google-mobile-ads";
const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    // initialize AdMob SDK
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log("✅ AdMob initialized", adapterStatuses);
      })
      .catch(err => {
        console.warn("⚠️ AdMob init failed:", err);
      });
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="SplashScreen" component={SplashScreen}  options={{
    headerShown: false
  }} />
      <Stack.Screen name="HomeScreen" component={HomeScreen}  options={{
    headerShown: false
  }} />
      <Stack.Screen name="ChatbotScreen" component={ChatbotScreen} />
      <Stack.Screen
  name="VoiceToText"
  component={VoiceToTextScreen}
  options={{
    headerShown: false
  }}
/>
<Stack.Screen 
        name="VoiceSearch" 
        component={VoiceSearchScreen}
        options={{ headerShown: false }}
      />
<Stack.Screen 
        name="TranslationScreen" 
        component={TranslationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
  name="VoiceRecording" 
  component={VoiceRecordingScreen}
  options={{ headerShown: false }}
/><Stack.Screen 
        name="RecordingsList" 
        component={RecordingsListScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen 
        name="Notes" 
        component={NotesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SearchInput" 
        component={SearchInputScreen}
        options={{ headerShown: false }}
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
