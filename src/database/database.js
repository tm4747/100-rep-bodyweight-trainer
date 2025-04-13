import * as SQLite from 'expo-sqlite';

export const getWorkoutTemplates = async({setWorkoutTemplates}) => {

   // Open or create the database
   const db = await SQLite.openDatabaseAsync('trainer.db');

   // Enable WAL mode for better performance
   await db.execAsync('PRAGMA journal_mode = WAL');

   // Run database operations within a transaction
   await db.withTransactionAsync(async () => {
    const results = await db.getAllAsync('SELECT * FROM workout_session_templates where is_active = true;');
    setWorkoutTemplates(results);
  });
}

export const setupDatabase = async ({setUser, setTestString}) => {
      // Open or create the database
      const db = await SQLite.openDatabaseAsync('trainer.db');

      // Enable WAL mode for better performance
      await db.execAsync('PRAGMA journal_mode = WAL');

      // Run database operations within a transaction
      await db.withTransactionAsync(async () => {
        // Drop & recreate the users table if it doesn't exist
        await db.execAsync('DROP TABLE IF EXISTS users;'); 
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
          );
        `);
        // OPTIONS table
        await db.execAsync('DROP TABLE IF EXISTS options;'); 
        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS options (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT NOT NULL UNIQUE,
            value TEXT NOT NULL
          );`
        );
        // WORKOUTS table
        await db.execAsync('DROP TABLE IF EXISTS workouts;'); 
        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT
          );`
        );
        // WORKOUT SESSION TEMPLATES table
        await db.execAsync('DROP TABLE IF EXISTS workout_session_templates;'); 
        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS workout_session_templates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            is_active BOOLEAN DEFAULT 1
          );`
        );
        // WORKOUT SESSIONS table
        await db.execAsync('DROP TABLE IF EXISTS workout_sessions;'); 
        await db.execAsync(
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
        // WORKOUT SESSION TEMPLATES TO WORKOUTS table
        await db.execAsync('DROP TABLE IF EXISTS workout_session_templates_to_workouts;'); 
        await db.execAsync(
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
        // WORKOUT SESSION ITEMS table
        await db.execAsync('DROP TABLE IF EXISTS workout_session_items;'); 
        await db.execAsync(
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

        // Insert a new user
        await db.runAsync('INSERT INTO users (name) VALUES (?);', ['Margo the hun']);
        // Insert workouts
        const workouts = [
          { name: 'Push-Ups' },
          { name: 'Pull-Ups' },
          { name: 'Sit-Ups' },
          { name: 'Bodyweight Squats' },
          { name: 'Burpees' },
          { name: 'Squat-Jumps' },
          { name: 'Lunges' }
        ];
        for(var x = 0; x < workouts.length; x++){
          await db.runAsync('INSERT INTO workouts (name) VALUES (?);', [workouts[x].name]);
        }
        //Insert workout session template
        const templateResult = await db.runAsync('INSERT INTO workout_session_templates (name, is_active) VALUES (?, ?)', ['test workout', 1]);
        const templateId = templateResult.lastInsertRowId;
        console.log('templateId');
        console.log(templateId);
        // Insert workout session template to workouts
        await db.runAsync('INSERT INTO workout_session_templates_to_workouts (workout_session_template_id, workout_id) VALUES (?, ?)', [templateId, 1]);
        await db.runAsync('INSERT INTO workout_session_templates_to_workouts (workout_session_template_id, workout_id) VALUES (?, ?)', [templateId, 2]);
        await db.runAsync('INSERT INTO workout_session_templates_to_workouts (workout_session_template_id, workout_id) VALUES (?, ?)', [templateId, 3]);
        // Insert workout session
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(13, 0, 0, 0); // 1 PM UTC
        const sessionResult = await db.runAsync('INSERT INTO workout_sessions (workout_session_template_id, timestamp, duration) VALUES (?, ?, ?)', [templateId, yesterday.toISOString(), 320]);
        console.log('sessionResult');
        console.log(sessionResult);
        const sessionId = sessionResult.lastInsertRowId;
        console.log('sessionId');
        console.log(sessionId);
        // Insert workout session items
        await db.runAsync('INSERT INTO workout_session_items (workout_session_id, workout_id, goal, done) VALUES (?, ?, ?, ?)', [sessionId, 1, null, 25]);
        await db.runAsync('INSERT INTO workout_session_items (workout_session_id, workout_id, goal, done) VALUES (?, ?, ?, ?)', [sessionId, 2, null, 35]);
        await db.runAsync('INSERT INTO workout_session_items (workout_session_id, workout_id, goal, done) VALUES (?, ?, ?, ?)', [sessionId, 3, null, 45]);

        // Retrieve the most recent user
        const result = await db.getFirstAsync('SELECT * FROM users ORDER BY id DESC LIMIT 1;');
        setUser(result);
        const testString = await db.getFirstAsync('SELECT done FROM workout_session_items ORDER BY id DESC LIMIT 1;');
        console.log('testString');
        console.log(testString);
        setTestString(testString.done)
      });
    };