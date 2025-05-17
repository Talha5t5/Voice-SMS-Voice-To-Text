import { createStackNavigator } from '@react-navigation/stack';
import TranslationScreen from '../screens/TranslationScreen';
import RecordingsListScreen from '../screens/RecordingsListScreen';
import NotesScreen from '../screens/NotesScreen';
import VoiceToTextScreen from '../screens/VoiceToTextScreen';
import VoiceSearchScreen from '../screens/VoiceSearchScreen';
import SearchInputScreen from '../screens/SearchInputScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Notes" 
        component={NotesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="VoiceToText" 
        component={VoiceToTextScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="TranslationScreen" 
        component={TranslationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="RecordingsList" 
        component={RecordingsListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="VoiceSearch" 
        component={VoiceSearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SearchInput" 
        component={SearchInputScreen}
        options={{ headerShown: false }}
      />
      {/* Add other screens here */}
    </Stack.Navigator>
  );
}

export default AppNavigator; 