import { openDatabaseAsync } from 'expo-sqlite';

// Open the database
let db = null;

// Initialize the database
export const initDB = async () => {
  try {
    console.log('Starting database initialization...');
    
    if (!db) {
      console.log('Opening database...');
      db = await openDatabaseAsync('workout.db');
      console.log('Database opened successfully:', db);
    } else {
      console.log('Database already initialized');
    }

    // Verify database connection with a simple query
    console.log('Verifying database connection...');
    await db.withTransactionAsync(async (tx) => {
      await tx.executeSqlAsync('SELECT 1');
    });
    console.log('Database connection verified');

    // Create tables one at a time with error handling
    console.log('Starting table creation...');
    
    // Create options table
    try {
      console.log('Creating options table...');
      await db.withTransactionAsync(async (tx) => {
        await tx.executeSqlAsync(
          `CREATE TABLE IF NOT EXISTS options (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT NOT NULL UNIQUE,
            value TEXT NOT NULL
          );`
        );
      });
      console.log('Options table created successfully');
    } catch (error) {
      console.error('Error creating options table:', error);
      throw error;
    }

    // Create workouts table
    try {
      console.log('Creating workouts table...');
      await db.withTransactionAsync(async (tx) => {
        await tx.executeSqlAsync(
          `CREATE TABLE IF NOT EXISTS workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT
          );`
        );
      });
      console.log('Workouts table created successfully');
    } catch (error) {
      console.error('Error creating workouts table:', error);
      throw error;
    }

    // Create workout_session_templates table
    try {
      console.log('Creating workout_session_templates table...');
      await db.withTransactionAsync(async (tx) => {
        await tx.executeSqlAsync(
          `CREATE TABLE IF NOT EXISTS workout_session_templates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            is_active BOOLEAN DEFAULT 1
          );`
        );
      });
      console.log('Workout_session_templates table created successfully');
    } catch (error) {
      console.error('Error creating workout_session_templates table:', error);
      throw error;
    }

    // Create workout_sessions table
    try {
      console.log('Creating workout_sessions table...');
      await db.withTransactionAsync(async (tx) => {
        await tx.executeSqlAsync(
          `CREATE TABLE IF NOT EXISTS workout_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workout_session_template_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            duration INTEGER NOT NULL,
            FOREIGN KEY (workout_session_template_id) 
              REFERENCES workout_session_templates(id)
              ON DELETE CASCADE
          );`
        );
      });
      console.log('Workout_sessions table created successfully');
    } catch (error) {
      console.error('Error creating workout_sessions table:', error);
      throw error;
    }

    // Create workout_session_templates_to_workouts table
    try {
      console.log('Creating workout_session_templates_to_workouts table...');
      await db.withTransactionAsync(async (tx) => {
        await tx.executeSqlAsync(
          `CREATE TABLE IF NOT EXISTS workout_session_templates_to_workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workout_session_template_id INTEGER NOT NULL,
            workout_id INTEGER NOT NULL,
            FOREIGN KEY (workout_session_template_id) 
              REFERENCES workout_session_templates(id)
              ON DELETE CASCADE,
            FOREIGN KEY (workout_id) 
              REFERENCES workouts(id)
              ON DELETE CASCADE,
            UNIQUE(workout_session_template_id, workout_id)
          );`
        );
      });
      console.log('Workout_session_templates_to_workouts table created successfully');
    } catch (error) {
      console.error('Error creating workout_session_templates_to_workouts table:', error);
      throw error;
    }

    // Create workout_session_items table
    try {
      console.log('Creating workout_session_items table...');
      await db.withTransactionAsync(async (tx) => {
        await tx.executeSqlAsync(
          `CREATE TABLE IF NOT EXISTS workout_session_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workout_session_id INTEGER NOT NULL,
            workout_id INTEGER NOT NULL,
            goal INTEGER,
            done INTEGER NOT NULL,
            FOREIGN KEY (workout_session_id) 
              REFERENCES workout_sessions(id)
              ON DELETE CASCADE,
            FOREIGN KEY (workout_id) 
              REFERENCES workouts(id)
              ON DELETE CASCADE,
            UNIQUE(workout_session_id, workout_id)
          );`
        );
      });
      console.log('Workout_session_items table created successfully');
    } catch (error) {
      console.error('Error creating workout_session_items table:', error);
      throw error;
    }

    // Insert initial workout data
    try {
      console.log('Inserting initial workout data...');
      const workouts = [
        { name: 'Push-Ups' },
        { name: 'Pull-Ups' },
        { name: 'Sit-Ups' },
        { name: 'Bodyweight Squats' },
        { name: 'Burpees' },
        { name: 'Squat-Jumps' },
        { name: 'Lunges' }
      ];

      for (const workout of workouts) {
        await db.withTransactionAsync(async (tx) => {
          await tx.executeSqlAsync(
            'INSERT OR IGNORE INTO workouts (name) VALUES (?)',
            [workout.name]
          );
        });
      }
      console.log('Initial workout data inserted successfully');
    } catch (error) {
      console.error('Error inserting initial workout data:', error);
      throw error;
    }

    console.log('Database initialization completed successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Execute a query and return the result
export const executeQuery = async (sql, params = []) => {
  if (!db) {
    console.error('Database not initialized when executing query');
    throw new Error('Database not initialized');
  }

  try {
    console.log('Executing query:', sql);
    return await db.withTransactionAsync(async (tx) => {
      const result = await tx.executeSqlAsync(sql, params);
      console.log('Query executed successfully');
      return result;
    });
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

// Insert test data
export const insertTestData = async () => {
  try {
    // Insert test workout session template
    const templateResult = await executeQuery(
      'INSERT INTO workout_session_templates (name, is_active) VALUES (?, ?)',
      ['test workout', 1]
    );
    const templateId = templateResult.insertId;

    // Insert template-to-workout relationships
    await executeQuery(
      'INSERT INTO workout_session_templates_to_workouts (workout_session_template_id, workout_id) VALUES (?, ?)',
      [templateId, 1]
    );
    await executeQuery(
      'INSERT INTO workout_session_templates_to_workouts (workout_session_template_id, workout_id) VALUES (?, ?)',
      [templateId, 2]
    );
    await executeQuery(
      'INSERT INTO workout_session_templates_to_workouts (workout_session_template_id, workout_id) VALUES (?, ?)',
      [templateId, 3]
    );

    // Insert workout session
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(13, 0, 0, 0); // 1 PM UTC

    const sessionResult = await executeQuery(
      'INSERT INTO workout_sessions (workout_session_template_id, timestamp, duration) VALUES (?, ?, ?)',
      [templateId, yesterday.toISOString(), 320] // 5 minutes 20 seconds = 320 seconds
    );
    const sessionId = sessionResult.insertId;

    // Insert workout session items
    await executeQuery(
      'INSERT INTO workout_session_items (workout_session_id, workout_id, goal, done) VALUES (?, ?, ?, ?)',
      [sessionId, 1, null, 25]
    );
    await executeQuery(
      'INSERT INTO workout_session_items (workout_session_id, workout_id, goal, done) VALUES (?, ?, ?, ?)',
      [sessionId, 2, null, 35]
    );
    await executeQuery(
      'INSERT INTO workout_session_items (workout_session_id, workout_id, goal, done) VALUES (?, ?, ?, ?)',
      [sessionId, 3, null, 40]
    );

    return true;
  } catch (error) {
    console.error('Error inserting test data:', error);
    return false;
  }
};

// Options table operations
export const setOption = async (key, value) => {
  try {
    // First try to update
    const result = await executeQuery(
      'UPDATE options SET value = ? WHERE key = ?',
      [value, key]
    );
    
    // If no rows were updated, insert new
    if (result.rowsAffected === 0) {
      await executeQuery(
        'INSERT INTO options (key, value) VALUES (?, ?)',
        [key, value]
      );
    }
    return true;
  } catch (error) {
    console.error('Error setting option:', error);
    return false;
  }
};

export const getOption = async (key) => {
  try {
    const result = await executeQuery(
      'SELECT value FROM options WHERE key = ?',
      [key]
    );
    return result.rows.length > 0 ? result.rows.item(0).value : null;
  } catch (error) {
    console.error('Error getting option:', error);
    return null;
  }
};

export const getAllOptions = async () => {
  try {
    const result = await executeQuery('SELECT * FROM options');
    return result.rows._array;
  } catch (error) {
    console.error('Error getting all options:', error);
    return [];
  }
};

export const deleteOption = async (key) => {
  try {
    await executeQuery('DELETE FROM options WHERE key = ?', [key]);
    return true;
  } catch (error) {
    console.error('Error deleting option:', error);
    return false;
  }
};

// Workouts table operations
export const addWorkout = async (name, description = null) => {
  try {
    const result = await executeQuery(
      'INSERT INTO workouts (name, description) VALUES (?, ?)',
      [name, description]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error adding workout:', error);
    return null;
  }
};

export const getAllWorkouts = async () => {
  try {
    const result = await executeQuery('SELECT * FROM workouts ORDER BY name');
    return result.rows._array;
  } catch (error) {
    console.error('Error getting workouts:', error);
    return [];
  }
};

export const getWorkoutById = async (id) => {
  try {
    const result = await executeQuery(
      'SELECT * FROM workouts WHERE id = ?',
      [id]
    );
    return result.rows.length > 0 ? result.rows.item(0) : null;
  } catch (error) {
    console.error('Error getting workout:', error);
    return null;
  }
};

export const updateWorkout = async (id, name, description = null) => {
  try {
    await executeQuery(
      'UPDATE workouts SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
    return true;
  } catch (error) {
    console.error('Error updating workout:', error);
    return false;
  }
};

export const deleteWorkout = async (id) => {
  try {
    await executeQuery('DELETE FROM workouts WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Error deleting workout:', error);
    return false;
  }
};

export default db; 