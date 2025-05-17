import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

// Replace with your splash image or logo
const SPLASH_IMAGE = require('./assets/splash.jpg');

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('HomeScreen');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.content}>
        <Image source={SPLASH_IMAGE} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>
          Write <Text style={styles.highlight}>SMS</Text> by Voice
        </Text>
        <Text style={styles.subtitle}>
          Speak and create voice messages and share with others
        </Text>
        <ActivityIndicator size="large" color="#6C63FF" style={styles.loader} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F8F9FA',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  highlight: {
    color: '#6C63FF',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  loader: {
    marginTop: 40,
  },
});

export default SplashScreen;
