import React, { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
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
  const [b_submitWorkoutDisabled, setSubmitWorkoutDisabled] = useState(true);

  const handleAdd = async () => {
    if (!newWorkoutName.trim()) return;
    await onAddWorkout(newWorkoutName.trim(), newWorkoutDescription.trim());
    // Clear inputs and close modal
    setNewWorkoutName('');
    setNewWorkoutDescription('');
    onClose();
  };

    useEffect(() => {
      setSubmitWorkoutDisabled(!newWorkoutName.trim());
    }, [newWorkoutName]);


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
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.deleteText}><FontAwesome name="close" size={24} color="#333" /></Text>
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
            <TouchableOpacity style={b_submitWorkoutDisabled ? [styles.button, styles.buttonDisabled] : styles.button} onPress={handleAdd} disabled={b_submitWorkoutDisabled}>
              <Text style={styles.buttonText}>Add Workout {b_submitWorkoutDisabled}</Text>
            </TouchableOpacity>
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
  deleteText: {
    textAlign: "right",
    fontSize: 18,
    marginRight: 10,
    marginBottom:10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: "#667",
  }
});

export default WorkoutModal;
