import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import WorkoutSessionTemplate from '../components/WorkoutSessionTemplate';
import { getWorkoutTemplates } from '../database/database';


const SelectWorkoutTemplate = ({ navigation }) => {
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
});

export default SelectWorkoutTemplate; 