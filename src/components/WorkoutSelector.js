import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch
} from 'react-native';
//TODO: hereChunk 
import { fetchWorkouts, insertNewWorkout } from '../database/database';
import WorkoutModal from './WorkoutModal';  


const WorkoutSelector = () => {

  const [workouts, setWorkouts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [newWorkoutTemplateName, setNewWorkoutTemplateName] = useState('');
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [newWorkoutDescription, setNewWorkoutDescription] = useState('');

  // Load workouts on mount
  useEffect(() => {
    fetchWorkouts({setWorkouts});
  }, []);


const [modalVisible, setModalVisible] = useState(false);

const addWorkout = async (name, description) => {
  if (!name.trim()) return;
  try {
    const workoutName = name.trim();
    const workoutDescription = description.trim();
    console.log("here: " + workoutName + " - " + workoutDescription);
    await insertNewWorkout(workoutName, workoutDescription);
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        Alert.alert('Workout already exists');
      } else {
        console.error('Error adding workout:', err);
      }
    }
  await fetchWorkouts({setWorkouts});
};

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const deleteWorkout = async (id) => {
    try {
      await db.runAsync(`DELETE FROM workouts WHERE id = ?`, id);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      fetchWorkouts();
    } catch (err) {
      console.error('Error deleting workout:', err);
    }
  };



  const renderWorkoutItem = ({ item }) => (
    <View style={styles.itemRow}>
        <Switch
        value={selectedIds.includes(item.id)}
        onValueChange={() => toggleSelect(item.id)}
        trackColor={{ false: '#ccc', true: '#4cd964' }} // optional iOS green
        thumbColor={selectedIds.includes(item.id) ? '#ffffff' : '#f4f3f4'}
        style={styles.switch}
        />
      <Text style={styles.itemText}>{item.name}</Text>
      <TouchableOpacity onPress={() => deleteWorkout(item.id)}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Workouts:</Text>
        <FlatList
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
        <View style={styles.addRow}>
          <Text style={styles.title}>New Workout Template Name:</Text>
        </View>
        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            value={newWorkoutTemplateName}
            onChangeText={setNewWorkoutTemplateName}
            placeholder="New workout template name"
          />
        </View>
        <WorkoutModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAddWorkout={addWorkout}
        />
        <Button title="New Workout" onPress={() => setModalVisible(true)} />
    </View>
  );
};

const NewWorkoutModal = () => {
    <Text>Hey</Text>
}

const styles = StyleSheet.create({
  listContent: {
    borderWidth:2,
    borderStyle:"solid",
    borderColor:"lightgrey",
    borderRadius:10,
    paddingLeft:10,
    paddingRight:20,
  },
  list:{

  },
  container: {
    flex:1,
    padding: 20,
    width:"100%",
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: {
    marginRight: 12,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  deleteText: {
    fontSize: 18,
    color: '#ff3b30',
    marginLeft: 10,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10,
  },
});
export default WorkoutSelector; 
