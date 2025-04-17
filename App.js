import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import SelectWorkoutTemplate from './src/screens/SelectWorkoutTemplate';
import PastResultsScreen from './src/screens/PastResultsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ActiveWorkoutScreen from './src/screens/ActiveWorkoutScreen';
import NewWorkoutTemplateScreen from './src/screens/NewWorkoutTemplateScreen';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: '100 Rep Bodyweight Trainer' }}
        />
        <Stack.Screen 
          name="SelectWorkoutTemplate" 
          component={SelectWorkoutTemplate}
          options={{ title: 'Select Workout Template' }}
        />
        <Stack.Screen 
          name="PastResults" 
          component={PastResultsScreen}
          options={{ title: 'Past Results' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'App Settings' }}
        />
        <Stack.Screen 
          name="ActiveWorkout" 
          component={ActiveWorkoutScreen}
          options={{ title: 'Active Workout' }}
        />
      <Stack.Screen 
          name="NewWorkoutTemplate" 
          component={NewWorkoutTemplateScreen}
          options={{ title: 'New Workout Template' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
