import React from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import MyCustomButton from './simple/button';
import { readable_timestamp } from '../../lib/CalculationHelper';
import FontAwesome from '@expo/vector-icons/FontAwesome';


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

  const workoutSessionTimestamp = (b_existingWorkout && template.latestWorkoutSession?.timestamp) ? "Last Workout: " + readable_timestamp(template.latestWorkoutSession.timestamp) : "No Workout Session On Record";

  const lastWorkoutTimestamp = <View style={styles.workoutTimestamp}>
    <Text style={styles.lastWorkout}>{workoutSessionTimestamp}</Text>
  </View>;

  const handlePress = () => {
    Alert.alert('Button Pressed!', 'You tapped the button.');
  };
  

  const confirmDeleteWorkoutTemplate = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this workout template? \n\nAny related workout session data will be preserved.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => handleDeleteWorkoutTemplate(id) }
      ],
      { cancelable: false }
    );
  };

  const handleDeleteWorkoutTemplate = async (id) => {
    try {
      await deleteWorkoutTemplate(id);
      // HERE
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    } catch (err) {
      console.error('Error deleting workout:', err);
    }
    await fetchWorkouts({setWorkouts});
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.templateName}>{template.name}</Text>
        <TouchableOpacity onPress={() => confirmDeleteWorkoutTemplate(template.id)}>
          <Text style={styles.closeTextElement}><FontAwesome name="close" size={24} color="red" /></Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
      <View style={styles.workoutHeaderRow}>
        <Text style={[styles.workoutName, styles.workoutHeaderText]}>WORKOUT</Text>
        <Text style={[styles.workoutGoal, styles.workoutHeaderText]}>DONE LAST SESSION</Text>
      </View>
        {workouts}
        {lastWorkoutTimestamp}
        <MyCustomButton title={"Begin Workout"} onPress={handlePress} variation={1}/>
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
},
lastWorkout: {
  padding:10,
  fontWeight: "bold",
},
closeTextElement: {
  fontSize: 18,
  color: '#ff3b30',
  marginLeft: 10,
},
});

export default WorkoutSessionTemplate; 