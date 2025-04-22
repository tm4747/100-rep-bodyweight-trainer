import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import MyCustomButton from './simple/button';

const WorkoutSessionTemplate = ({ template }) => {

  const workoutsArray = template.workoutSessionItems.length > 0 ? template.workoutSessionItems : [];

  const workouts = workoutsArray.map((workout) => (
    <View key={workout.id} style={styles.workoutRow}>
      <Text style={styles.workoutName}>{workout.name}</Text>
      <Text style={styles.workoutGoal}>{workout.done}</Text>
    </View>
  ));

  let b_existingWorkout = false;
  for(let x = 0; x < workoutsArray.length; x++){
    b_existingWorkout = workoutsArray[x].done > 0 ? true : b_existingWorkout;
  }

  const lastWorkoutTimestamp = b_existingWorkout ? (<View style={styles.workoutTimestamp}>
    <Text>{template.workout_session.timestamp}</Text>
  </View>) : (<View style={styles.workoutTimestamp}>
    <Text>No workout data on record.</Text>
  </View>);

  const handlePress = () => {
    Alert.alert('Button Pressed!', 'You tapped the button.');
  };
  
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.templateName}>{template.name}</Text>
        <MyCustomButton title={"Begin Workout"} onPress={handlePress} variation={1}/>
      </View>
      <View style={styles.content}>
      <View style={styles.workoutHeaderRow}>
        <Text style={[styles.workoutName, styles.workoutHeaderText]}>WORKOUT</Text>
        <Text style={[styles.workoutGoal, styles.workoutHeaderText]}>DONE LAST SESSION</Text>
      </View>
        {workouts}
        {lastWorkoutTimestamp}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f8f8',
  },
  actionButton: {
    paddingLeft: 50,
    paddingRight:24,
    backgroundColor:'black',
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
  workoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 16,
    color: '#333',
  },
  workoutGoal: {
    fontSize: 16,
    color: '#888',
  },
  workoutHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 4,
  },
  
workoutHeaderText: {
  fontWeight: 'bold',
},
workoutTimestamp: {
  flexDirection: 'row',
  justifyContent: 'center',
}  
});

export default WorkoutSessionTemplate; 