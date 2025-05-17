import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const platforms = {
  communication: {
    title: 'Communication',
    icon: 'message-text',
    items: [
      { name: 'Reddit', icon: 'reddit', color: '#FF4500' },
      { name: 'Quora', icon: 'help-circle', color: '#B92B27' },
      { name: 'Flipboard', icon: 'flip-horizontal', color: '#E12828' },
      { name: 'MSN', icon: 'microsoft', color: '#0078D4' },
    ]
  },
  shopping: {
    title: 'Shopping',
    icon: 'shopping',
    items: [
      { name: 'Amazon', icon: 'amazon', color: '#FF9900' },
      { name: 'AliBaba', icon: 'shopping', color: '#FF6A00' },
      { name: 'Daraz.pk', icon: 'shopping', color: '#F85606' },
      { name: 'OLX', icon: 'store', color: '#3DB64D' },
      { name: 'Ebay', icon: 'shopping', color: '#E53238' },
      { name: 'AliExpress', icon: 'shopping', color: '#FF4747' },
    ]
  },
  socialMedia: {
    title: 'Social Media',
    icon: 'account-group',
    items: [
      { name: 'Facebook', icon: 'facebook', color: '#1877F2' },
      { name: 'Instagram', icon: 'instagram', color: '#E4405F' },
      { name: 'Twitter', icon: 'twitter', color: '#1DA1F2' },
      { name: 'Youtube', icon: 'youtube', color: '#FF0000' },
      { name: 'TikTok', icon: 'music-note', color: '#000000' },
      { name: 'Pinterest', icon: 'pinterest', color: '#E60023' },
    ]
  },
  searchEngine: {
    title: 'Search Engine',
    icon: 'magnify',
    items: [
      { name: 'Google', icon: 'google', color: '#4285F4' },
      { name: 'Bing', icon: 'microsoft-bing', color: '#00809D' },
      { name: 'DuckDuckGo', icon: 'duck', color: '#DE5833' },
      { name: 'Yahoo', icon: 'yahoo', color: '#6001D2' },
      { name: 'Wikipedia', icon: 'wikipedia', color: '#000000' },
    ]
  }
};

const VoiceSearchScreen = ({ navigation }) => {
  const handlePlatformPress = (platform) => {
    navigation.navigate('SearchInput', { platform });
  };

  const renderPlatformSection = (section) => (
    <View style={styles.section} key={section.title}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Icon name={section.icon} size={20} color="#6C63FF" />
        </View>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
      <View style={styles.platformGrid}>
        {section.items.map((platform) => (
          <TouchableOpacity
            key={platform.name}
            style={styles.platformCard}
            onPress={() => handlePlatformPress(platform)}
          >
            <View style={[styles.platformIcon, { backgroundColor: platform.color }]}>
              <Icon name={platform.icon} size={24} color="#FFF" />
            </View>
            <Text style={styles.platformName}>{platform.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Voice Search</Text>
        <View style={styles.crown}>
          <Icon name="crown" size={24} color="white" />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {Object.values(platforms).map(section => renderPlatformSection(section))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    elevation: 2,
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
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  platformCard: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  platformIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  platformName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
});

export default VoiceSearchScreen; 