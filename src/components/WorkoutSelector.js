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
import { fetchWorkouts } from '../database/database';
  

const WorkoutSelector = () => {

  const [workouts, setWorkouts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [newWorkoutName, setNewWorkoutName] = useState('');

  // Load workouts on mount
  useEffect(() => {
    fetchWorkouts({setWorkouts});
  }, []);

  

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const addWorkout = async () => {
    if (!newWorkoutName.trim()) return;

    try {
      await db.runAsync(
        `INSERT INTO workouts (name, description) VALUES (?, ?)`,
        newWorkoutName.trim(),
        ''
      );
      setNewWorkoutName('');
      fetchWorkouts();
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        Alert.alert('Workout already exists');
      } else {
        console.error('Error adding workout:', err);
      }
    }
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
        style={styles.list}
      />

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          value={newWorkoutName}
          onChangeText={setNewWorkoutName}
          placeholder="New workout name"
        />
        <Button title="Add" onPress={addWorkout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    borderWidth:1,
    borderStyle:"solid",
    borderColor:"grey",
    height:"60%",
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
