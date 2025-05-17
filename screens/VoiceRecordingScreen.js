import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  SafeAreaView,
  Alert,
  PermissionsAndroid,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();

const VoiceRecordingScreen = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [recordings, setRecordings] = useState([]);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);

  useEffect(() => {
    loadRecordings();
    return () => {
      stopRecording();
      stopPlaying();
    };
  }, []);

  const loadRecordings = async () => {
    try {
      const savedRecordings = await AsyncStorage.getItem('recordings');
      if (savedRecordings) {
        setRecordings(JSON.parse(savedRecordings));
      }
    } catch (error) {
      console.error('Error loading recordings:', error);
    }
  };

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        const allGranted = Object.values(grants).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          Alert.alert('Permissions required', 'Please grant all permissions to use voice recording');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const startRecording = async () => {
    if (!await checkPermission()) {
      return;
    }

    const path = Platform.select({
      ios: 'recording.m4a',
      android: `${RNFS.ExternalDirectoryPath}/recording_${Date.now()}.mp4`,
    });

    try {
      const result = await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      });
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;

    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      
      const newRecording = {
        id: Date.now().toString(),
        uri: result,
        duration: recordTime,
        date: new Date().toISOString(),
        name: `Recording ${new Date().toLocaleString()}`,
      };
      
      const updatedRecordings = [...recordings, newRecording];
      await AsyncStorage.setItem('recordings', JSON.stringify(updatedRecordings));
      setRecordings(updatedRecordings);
      setIsRecording(false);
      setRecordTime('00:00:00');
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const playRecording = async (uri, id) => {
    try {
      if (currentPlayingId) {
        await stopPlaying();
      }

      await audioRecorderPlayer.startPlayer(uri);
      setCurrentPlayingId(id);

      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition === e.duration) {
          stopPlaying();
        }
      });
    } catch (error) {
      console.error('Failed to play recording:', error);
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  const stopPlaying = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setCurrentPlayingId(null);
    } catch (error) {
      console.error('Failed to stop playing:', error);
    }
  };

  const deleteRecording = async (id) => {
    try {
      const recordingToDelete = recordings.find(rec => rec.id === id);
      if (recordingToDelete) {
        await RNFS.unlink(recordingToDelete.uri).catch(err => console.warn(err));
      }

      const updatedRecordings = recordings.filter(rec => rec.id !== id);
      await AsyncStorage.setItem('recordings', JSON.stringify(updatedRecordings));
      setRecordings(updatedRecordings);
    } catch (error) {
      console.error('Failed to delete recording:', error);
      Alert.alert('Error', 'Failed to delete recording');
    }
  };

  const renderRecordingItem = ({ item }) => (
    <View style={styles.recordingItem}>
      <TouchableOpacity 
        style={styles.playButton}
        onPress={() => currentPlayingId === item.id ? stopPlaying() : playRecording(item.uri, item.id)}
      >
        <Icon 
          name={currentPlayingId === item.id ? "pause" : "play"} 
          size={24} 
          color="#6C63FF" 
        />
      </TouchableOpacity>
      <View style={styles.recordingInfo}>
        <Text style={styles.recordingDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text style={styles.recordingDuration}>{item.duration}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteRecording(item.id)}
      >
        <Icon name="delete" size={24} color="#FF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Voice Recording</Text>
        <TouchableOpacity onPress={() => navigation.navigate('RecordingsList')}>
          <Icon name="playlist-music" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{recordTime}</Text>
        <Text style={styles.recordingStatus}>
          {isRecording ? 'Recording...' : 'Start Recording'}
        </Text>
      </View>

      <View style={styles.waveformContainer}>
        {isRecording && (
          <View style={styles.waveform}>
            {[...Array(20)].map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.waveformBar,
                  { height: Math.random() * 50 + 10 }
                ]} 
              />
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recordingActive]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Icon 
          name={isRecording ? "stop" : "microphone"} 
          size={32} 
          color="#FFF" 
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  timer: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#000',
    fontVariant: ['tabular-nums'],
  },
  recordingStatus: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
  waveformContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    gap: 4,
  },
  waveformBar: {
    width: 4,
    backgroundColor: '#6C63FF',
    borderRadius: 2,
  },
  recordButton: {
    backgroundColor: '#6C63FF',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  recordingActive: {
    backgroundColor: '#FF4444',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  recordingsList: {
    padding: 16,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
  },
  playButton: {
    padding: 8,
  },
  recordingInfo: {
    flex: 1,
    marginLeft: 16,
  },
  recordingDate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  recordingDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
});

export default VoiceRecordingScreen; 