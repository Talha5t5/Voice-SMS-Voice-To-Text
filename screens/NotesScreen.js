import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
  Alert,
  Share,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotesScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    loadNotes();
    
    // Listen for new notes from VoiceToText screen
    const unsubscribe = navigation.addListener('focus', () => {
      loadNotes();
    });

    return unsubscribe;
  }, [navigation]);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleAddNote = () => {
    navigation.navigate('VoiceToText', { fromNotes: true });
  };

  const handleDuplicate = async () => {
    if (!selectedNote) return;

    const newNote = {
      ...selectedNote,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newNote];
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      setShowOptions(false);
    } catch (error) {
      console.error('Error duplicating note:', error);
    }
  };

  const handleShare = async () => {
    if (!selectedNote) return;
    try {
      await Share.share({
        message: selectedNote.content,
        title: 'Share Note',
      });
      setShowOptions(false);
    } catch (error) {
      console.error('Error sharing note:', error);
    }
  };

  const handlePin = async () => {
    if (!selectedNote) return;
    const updatedNotes = notes.map(note => ({
      ...note,
      pinned: note.id === selectedNote.id ? !note.pinned : note.pinned,
    }));

    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      setShowOptions(false);
    } catch (error) {
      console.error('Error pinning note:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedNote) return;
    
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedNotes = notes.filter(note => note.id !== selectedNote.id);
            try {
              await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
              setNotes(updatedNotes);
              setShowOptions(false);
            } catch (error) {
              console.error('Error deleting note:', error);
            }
          },
        },
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require('./assets/no-data.jpg')} // Make sure to add this image
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyText}>No notes yet</Text>
      <Text style={styles.emptySubtext}>Tap + to create a new note</Text>
    </View>
  );

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.noteCard, item.pinned && styles.pinnedNote]}
      onPress={() => {
        setSelectedNote(item);
        setShowOptions(true);
      }}
    >
      <View>
        <Text style={styles.noteText} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.noteDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text style={styles.notePreview} numberOfLines={1}>
          {item.content}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => {
          setSelectedNote(item);
          setShowOptions(true);
        }}
      >
        <Icon name="dots-vertical" size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Notes</Text>
        <View style={styles.crown}>
          <Icon name="crown" size={24} color="white" />
        </View>
      </View>

      {notes.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={[...notes].sort((a, b) => (b.pinned ? 1 : -1))}
          renderItem={renderNoteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notesList}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddNote}
      >
        <Icon name="plus" size={24} color="#FFF" />
      </TouchableOpacity>

      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleDuplicate}
            >
              <Icon name="content-copy" size={20} color="#333" />
              <Text style={styles.optionText}>Duplicate</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleShare}
            >
              <Icon name="share-variant" size={20} color="#333" />
              <Text style={styles.optionText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={handlePin}
            >
              <Icon name="pin" size={20} color="#333" />
              <Text style={styles.optionText}>Pin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleDelete}
            >
              <Icon name="delete" size={20} color="#FF4444" />
              <Text style={[styles.optionText, { color: '#FF4444' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    height: 0,
    backgroundColor: '#FFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  notesList: {
    padding: 16,
  },
  noteCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pinnedNote: {
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  noteText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  notePreview: {
    fontSize: 14,
    color: '#666',
  },
  moreButton: {
    padding: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  optionsContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#333',
  },
});

export default NotesScreen; 