import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();

const RecordingsListScreen = ({ navigation }) => {
  const [recordings, setRecordings] = useState([]);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [newName, setNewName] = useState('');

  React.useEffect(() => {
    loadRecordings();
    return () => {
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

  const showRenameModal = (recording) => {
    setSelectedRecording(recording);
    setNewName(recording.name || `Recording ${recording.id}`);
    setIsRenameModalVisible(true);
  };

  const handleRename = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Please enter a valid name');
      return;
    }

    try {
      const updatedRecordings = recordings.map(rec => 
        rec.id === selectedRecording.id 
          ? { ...rec, name: newName.trim() }
          : rec
      );
      
      await AsyncStorage.setItem('recordings', JSON.stringify(updatedRecordings));
      setRecordings(updatedRecordings);
      setIsRenameModalVisible(false);
    } catch (error) {
      console.error('Failed to rename recording:', error);
      Alert.alert('Error', 'Failed to rename recording');
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
      
      <TouchableOpacity 
        style={styles.recordingInfo}
        onPress={() => showRenameModal(item)}
      >
        <Text style={styles.recordingName}>
          {item.name || `Recording ${item.id}`}
        </Text>
        <View style={styles.recordingDetails}>
          <Text style={styles.recordingDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <Text style={styles.recordingDuration}>
            {item.duration}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => showRenameModal(item)}
        >
          <Icon name="pencil" size={20} color="#6C63FF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteRecording(item.id)}
        >
          <Icon name="delete" size={20} color="#FF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>My Recordings</Text>
        <View style={{ width: 24 }} />
      </View>

      {recordings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="playlist-music" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No recordings yet</Text>
        </View>
      ) : (
        <FlatList
          data={recordings}
          renderItem={renderRecordingItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.recordingsList}
        />
      )}

      {/* Rename Modal */}
      <Modal
        visible={isRenameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsRenameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Recording</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter new name"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsRenameModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleRename}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  playButton: {
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  recordingInfo: {
    flex: 1,
    marginLeft: 16,
  },
  recordingName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  recordingDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingDate: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  recordingDuration: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    backgroundColor: '#6C63FF',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RecordingsListScreen; 