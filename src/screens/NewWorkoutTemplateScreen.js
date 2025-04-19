import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useState } from 'react-native';
import WorkoutSelector from '../components/WorkoutSelector';

const NewWorkoutTemplateScreen = ({ navigation }) => {


const saveNewWorkoutTemplate = () => {
  console.log("here");
}

  return (
    <View style={styles.container}>
      <WorkoutSelector/>
      <TouchableOpacity
        style={styles.button}
        onPress={() => saveNewWorkoutTemplate()}
      >
        <Text style={styles.buttonText}>Save New Workout Template</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NewWorkoutTemplateScreen; 