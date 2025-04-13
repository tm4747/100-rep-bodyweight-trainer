import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { initDB, executeQuery, insertTestData } from '../database/database';
import WorkoutSessionTemplate from '../components/WorkoutSessionTemplate';

const SelectWorkoutTemplate = ({ navigation }) => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        console.log('Starting template loading process...');
        
        // Initialize database first
        console.log('Initializing database...');
        const database = await initDB();
        console.log('Database initialized:', database);
        
        if (!database) {
          throw new Error('Failed to initialize database');
        }

        // Insert test data
        console.log('Inserting test data...');
        await insertTestData();
        console.log('Test data inserted');

        // Fetch active templates
        console.log('Fetching active templates...');
        const result = await executeQuery(
          'SELECT * FROM workout_session_templates WHERE is_active = 1'
        );
        console.log('Query result:', result);

        if (result.rows.length > 0) {
          console.log('Found templates:', result.rows.length);
          const templatesArray = [];
          for (let i = 0; i < result.rows.length; i++) {
            templatesArray.push(result.rows.item(i));
          }
          setTemplates(templatesArray);
        } else {
          console.log('No templates found');
        }
      } catch (error) {
        console.error('Error loading templates:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
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