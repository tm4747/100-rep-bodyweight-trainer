import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const MessageModal = ({ visible, title, message, onClose }) => {
  const titleDisplay = title ? <Text style={styles.messageTitle}>{title}</Text> : "";
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.deleteText}><FontAwesome name="close" size={20} color="#333" /></Text>
            </TouchableOpacity>
              {titleDisplay}
              <Text style={styles.messageText}>{message}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 300,
    position: 'relative',
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 10,
    zIndex: 1,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333',
  },
  messageTitle:{
    fontSize: 18,
    paddingBottom:12,
    fontWeight: "bold",
    color: '#333',
    textAlign: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  deleteText: {
    textAlign: "right",
    fontSize: 16,
    marginRight: 10,
    marginBottom:10,
  },
});

export default MessageModal;
