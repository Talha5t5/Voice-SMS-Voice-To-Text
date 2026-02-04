import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import BannerAdComponent from '../services/BannerAdComponent';
import {
  InterstitialAd,
  AdEventType,
  TestIds
} from 'react-native-google-mobile-ads';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;
//const adUnitId = __DEV__
//  ? TestIds.INTERSTITIAL
//: 'ca-app-pub-3373899001969249/6549827367';
const adUnitId = TestIds.INTERSTITIAL;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const HomeScreen = ({ navigation }) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const pendingNavigation = useRef(null);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => setAdLoaded(true)
    );

    const dismissListener = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        if (pendingNavigation.current) {
          navigation.navigate(pendingNavigation.current);
          pendingNavigation.current = null;
        }
        interstitial.load();
      }
    );

    interstitial.load();

    return () => {
      unsubscribe();
      dismissListener();
    };
  }, [navigation]);

  const handleFeaturePress = (screenName) => {
    const newCount = interactionCount + 1;
    setInteractionCount(newCount);

    const shouldShowAd = newCount % 2 === 1;

    if (shouldShowAd && adLoaded) {
      pendingNavigation.current = screenName;
      interstitial.show();
      setAdLoaded(false);
    } else {
      navigation.navigate(screenName);
    }
  };

  const features = [
    { id: 1, title: 'Voice To Text', icon: 'text-to-speech', screen: 'VoiceToText', gradient: ['#6C63FF', '#5B50E0'], size: 'large' },
    { id: 2, title: 'Voice Search', icon: 'magnify-plus', screen: 'VoiceSearch', gradient: ['#FF6B6B', '#EE5253'] },
    { id: 3, title: 'Translation', icon: 'translate', screen: 'TranslationScreen', gradient: ['#4CAF50', '#388E3C'] },
    { id: 4, title: 'Voice Recording', icon: 'microphone', screen: 'VoiceRecording', gradient: ['#FF9F43', '#F7B731'] },
    { id: 5, title: 'Notes', icon: 'note-text', screen: 'Notes', gradient: ['#5F27CD', '#4834DF'] },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Type SMS By Voice</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleFeaturePress('ChatbotScreen')}
            >
              <LinearGradient
                colors={['#6C2FD8', '#4834DF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.banner}
              >
                <View style={styles.bannerContent}>
                  <View style={styles.bannerTextContainer}>
                    <View style={styles.aiLabel}>
                      <Icon name="robot" size={16} color="#FFF" />
                      <Text style={styles.aiLabelText}>AI POWERED</Text>
                    </View>
                    <Text style={styles.bannerTitle}>Voice Chat</Text>
                    <Text style={styles.bannerSubtitle}>
                      Experience smooth conversations with AI
                    </Text>
                  </View>
                  <View style={styles.robotContainer}>
                    <View style={styles.robotIconBg}>
                      <Icon name="robot" size={48} color="#FFF" />
                    </View>
                    <View style={styles.robotDot} />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.grid}>
              {features.map(feature => (
                <TouchableOpacity
                  key={feature.id}
                  activeOpacity={0.9}
                  onPress={() => handleFeaturePress(feature.screen)}
                  style={[styles.cardWrapper, feature.size === 'large' && styles.largeCardWrapper]}
                >
                  <LinearGradient
                    colors={feature.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.card, feature.size === 'large' && styles.largeCard]}
                  >
                    <Icon
                      name={feature.icon}
                      size={feature.size === 'large' ? 40 : 32}
                      color="#FFF"
                    />
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.fixedAdContainer}>
          <BannerAdComponent />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  wrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // prevent overlap with bottom ad
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  banner: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  aiLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  aiLabelText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
    letterSpacing: 1,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 22,
  },
  robotContainer: {
    position: 'relative',
  },
  robotIconBg: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 16,
    transform: [{ rotate: '-5deg' }],
  },
  robotDot: {
    position: 'absolute',
    right: -4,
    top: -4,
    width: 12,
    height: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 20,
  },
  cardWrapper: {
    width: cardWidth,
  },
  largeCardWrapper: {
    width: '100%',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  largeCard: {
    height: 160,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 12,
  },
  fixedAdContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 0,
    borderTopWidth: 0,
    borderColor: '#ddd',
  },
});

export default HomeScreen;
