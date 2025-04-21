import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, ScrollView, StyleSheet, Text } from 'react-native';
import WorkoutSessionTemplate from '../components/WorkoutSessionTemplate';
import { getWorkoutTemplates, fetchWorkoutSessions } from '../database/database';


const SelectWorkoutTemplate = ({ navigation }) => {
  const [workoutSessions, setWorkoutSessions] = useState([]);
  const [templates, setWorkoutTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    try{
      getWorkoutTemplates({setWorkoutTemplates});
      setIsLoading(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    try{
      fetchWorkoutSessions({setWorkoutSessions});
      console.log('workoutSessions');
      console.log(workoutSessions);
    } catch {
      setError(true);
    }
  }, []);

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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {templates.map((template) => (
          <WorkoutSessionTemplate key={template.id} template={template} />
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('NewWorkoutTemplate')}
        >
          <Text style={styles.buttonText}>New Workout Template</Text>
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
});

export default SelectWorkoutTemplate; 