import { React, useState, useEffect }from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { setupDatabase } from '../database/database';


const HomeScreen = ({ navigation }) => {

  const [user, setUser] = useState(null);
  const [testString, setTestString] = useState(null);
  
    useEffect(() => {
          setupDatabase({setUser, setTestString});
    }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>SQLite Demo</Text>
        {user ? (
          <Text style={styles.text}>Latest User: {user.name}</Text>
        ) : (
          <Text style={styles.text}>Loading User...</Text>
        )}
        {testString ? (
          <Text style={styles.text}>Latest testString: {testString}</Text>
        ) : (
          <Text style={styles.text}>Loading testString...</Text>
        )}
      <Text style={styles.title}>100 Rep Bodyweight Trainer</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SelectWorkoutTemplate')}
        >
          <Text style={styles.buttonText}>Start Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PastResults')}
        >
          <Text style={styles.buttonText}>Past Results</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>App Settings</Text>
        </TouchableOpacity>
      </View>
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

export default HomeScreen; 