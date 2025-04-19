import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  StyleSheet,
} from 'react-native';

const WorkoutModal = ({ visible, onClose, onAddWorkout }) => {
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [newWorkoutDescription, setNewWorkoutDescription] = useState('');

  const handleAdd = async () => {
    if (!newWorkoutName.trim()) return;

    await onAddWorkout(newWorkoutName.trim(), newWorkoutDescription.trim());

    // Clear inputs and close modal
    setNewWorkoutName('');
    setNewWorkoutDescription('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalBackground} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            {/* Input Fields */}
            <TextInput
              style={styles.input}
              value={newWorkoutName}
              onChangeText={setNewWorkoutName}
              placeholder="New workout name"
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              value={newWorkoutDescription}
              onChangeText={setNewWorkoutDescription}
              placeholder="New workout description"
              multiline
              numberOfLines={4}
            />

            {/* Add Button */}
            <Button
              title="Add Workout"
              onPress={handleAdd}
              disabled={!newWorkoutName.trim()}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 5,
    zIndex: 1,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default WorkoutModal;
