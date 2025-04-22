import React, { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch
} from 'react-native';
//TODO: hereChunk 
import { fetchWorkouts, insertNewWorkout, deleteWorkout, insertNewWorkoutTemplate } from '../database/database';
import WorkoutModal from '../components/WorkoutModal';  

const NewWorkoutTemplateScreen = ({ navigation }) => {



const [workouts, setWorkouts] = useState([]);
const [selectedIds, setSelectedIds] = useState([]);
const [newWorkoutTemplateName, setNewWorkoutTemplateName] = useState('');

// Load workouts on mount
useEffect(() => {
  fetchWorkouts({setWorkouts});
}, []);


const saveNewWorkoutTemplate = async () => {
  if(!newWorkoutTemplateName && selectedIds.length > 0)
    return false;
  await insertNewWorkoutTemplate(newWorkoutTemplateName, selectedIds);
  navigation.navigate('SelectWorkoutTemplate')
}


const [modalVisible, setModalVisible] = useState(false);

const addWorkout = async (name, description) => {
if (!name) return;
try {
  await insertNewWorkout(name, description);
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

const confirmDeleteWorkout = (id) => {
  Alert.alert(
    "Confirm Delete",
    "Are you sure you want to delete this workout?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { text: "OK", onPress: () => handleDeleteWorkout(id) }
    ],
    { cancelable: false }
  );
};

const handleDeleteWorkout = async (id) => {
  try {
    await deleteWorkout(id);
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  } catch (err) {
    console.error('Error deleting workout:', err);
  }
  await fetchWorkouts({setWorkouts});
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
    <TouchableOpacity onPress={() => confirmDeleteWorkout(item.id)}>
      <Text style={styles.deleteText}><FontAwesome name="close" size={24} color="red" /></Text>
    </TouchableOpacity>
  </View>
);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
      <Text>{newWorkoutTemplateName}</Text>
      <Text style={styles.title}>Select Workouts:</Text>
        <FlatList
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
        <View style={[styles.addRow, styles.centeredView]}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>+  New Workout</Text>
          </TouchableOpacity>
        </View>
        
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
      
    </View>
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
  centeredView:{
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingBottom:20,
    borderBottomStyle:"solid",
    borderBottomColor:"lightgrey",
    borderBottomWidth:1,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 7.5,
    borderRadius: 10,
    width: '75%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
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

export default NewWorkoutTemplateScreen; 