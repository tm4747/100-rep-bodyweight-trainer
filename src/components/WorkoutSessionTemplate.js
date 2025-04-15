import React from 'react';
import { View, Text, StyleSheet, Lis } from 'react-native';

const WorkoutSessionTemplate = ({ template }) => {

  const workoutsArray = template.workouts.length > 0 ? template.workouts : [];

  const workouts = workoutsArray.map((workout) =>
    <Text key={workout.id}>
      {workout.name}
    </Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.templateName}>{template.name}</Text>
      </View>
      <View style={styles.content}>
        {workouts}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f8f8',
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 15,
  },
  placeholder: {
    color: '#666',
    fontStyle: 'italic',
  },
});

export default WorkoutSessionTemplate; 