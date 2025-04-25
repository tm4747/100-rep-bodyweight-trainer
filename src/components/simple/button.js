import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const MyCustomButton = ({ title, onPress, variation }) => {
    
    let buttonStyling;
    switch(variation) {
        case 1:
          buttonStyling = styles.color1;
          break;
        case 2:
            buttonStyling = styles.color2;
          break;
        default:
            buttonStyling = styles.colorDefault;
      }
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, buttonStyling]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    textAlign: "center",
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  color1: {
    backgroundColor: '#007AFF',
  },
  color2: {
    backgroundColor: 'red',
  },
  colorDefault: {
    backgroundColor: 'green',
  }
});

export default MyCustomButton;
