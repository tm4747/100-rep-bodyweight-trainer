import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity, View, ScrollView, StyleSheet, Text } from 'react-native';
import WorkoutSessionTemplate from '../components/WorkoutSessionTemplate';
import { getWorkoutTemplates } from '../database/database';


const SelectWorkoutTemplate = ({ navigation }) => {
  const [templates, setWorkoutTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workoutTemplateCount, setWorkoutTemplateCount] = useState(0);


  useFocusEffect(
    useCallback(() => {
      try{
        getWorkoutTemplates({setWorkoutTemplates});
        setIsLoading(false);
      } catch {
        setError(true);
      }
    }, [])
  );


  useFocusEffect(
    useCallback(() => {
      setWorkoutTemplateCount(templates.length)
    }, [templates])
  );


  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }
  let buttonFunction, buttonText, buttonStyles;
  if(workoutTemplateCount < 3){
    buttonText = "Create New Workout Template";
    buttonFunction = () => navigation.navigate('NewWorkoutTemplate');
    buttonStyles = styles.button;
  } else {
    buttonText = "Workout Template Limit Reached";
    buttonFunction = () => console.log('too many tempalates');
    buttonStyles = [styles.button, styles.buttonDisabled];
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {templates.map((template) => (
          <WorkoutSessionTemplate key={template.id} template={template} />
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={buttonStyles}
          onPress={buttonFunction}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: 'darkred',
  }
});

export default SelectWorkoutTemplate; 