import * as SQLite from 'expo-sqlite';

const setupDB = async () => {
  const db = await SQLite.openDatabaseAsync('trainer.db');
  await db.execAsync('PRAGMA journal_mode = WAL');
}

export const fetchWorkouts = async ({setWorkouts}) => {
   const db = await SQLite.openDatabaseAsync('trainer.db');
   await db.execAsync('PRAGMA journal_mode = WAL');
    await db.withTransactionAsync(async () => {
      // get workout tempates
      const workouts = await db.getAllAsync(`SELECT * FROM workouts`);
        console.log('workouts');
        console.log(workouts);
        setWorkouts(workouts);
    });
  };


export const fetchWorkoutSessions = async ({setWorkoutSessions}) => {
  const db = await SQLite.openDatabaseAsync('trainer.db');
  await db.execAsync('PRAGMA journal_mode = WAL');
   await db.withTransactionAsync(async () => {
     // get workout tempates
     const workoutSessions = await db.getAllAsync(`SELECT * FROM workout_sessions`);
       console.log('workouts');
       console.log(workoutSessions);
       setWorkoutSessions(workoutSessions);
   });
 };

  export const insertNewWorkout = async (workoutName, workoutDescription) => {
    const db = await SQLite.openDatabaseAsync('trainer.db');
    await db.execAsync('PRAGMA journal_mode = WAL');
     await db.withTransactionAsync(async () => {
       await db.runAsync(
        `INSERT INTO workouts (name, description) VALUES (?, ?)`,
        workoutName,
        workoutDescription
      );
     });
   };


  export const insertNewWorkoutTemplate = async (workoutTemplateName, workoutIds) => {
    const db = await SQLite.openDatabaseAsync('trainer.db');
    await db.execAsync('PRAGMA journal_mode = WAL');
     await db.withTransactionAsync(async () => {
       // insert new workout template and get id
       const templateResult = await db.runAsync(
        `INSERT INTO workout_session_templates (name) VALUES (?)`,
        workoutTemplateName
      );
      const templateId = templateResult.lastInsertRowId;
      // insert new workout session and get id with workout_session_template_id, timestamp: now, duration: null. 
      const workoutSessionResult = await db.runAsync(
        `INSERT INTO workout_sessions (workout_session_template_id) VALUES (?)`,
        templateId
      );
      const workoutSessionId = workoutSessionResult.lastInsertRowId;
      // insert workout session items for each workoutId - workout_session_id, workout_id, goal=0, done=0
      for(var x=0;x<workoutIds.length; x++){
        await db.runAsync(
          `INSERT INTO workout_session_items (workout_session_id, workout_id) VALUES (?, ?)`,
          workoutSessionId,
          workoutIds[x]
        );
      }
     });
   };


  export const deleteWorkout = async (id) => {
    const db = await SQLite.openDatabaseAsync('trainer.db');
    await db.execAsync('PRAGMA journal_mode = WAL');
     await db.withTransactionAsync(async () => {
       await db.runAsync(`DELETE FROM workouts WHERE id = ?`, id);
     });
   };


export const getWorkoutTemplates = async({setWorkoutTemplates}) => {
   const db = await SQLite.openDatabaseAsync('trainer.db');
   await db.execAsync('PRAGMA journal_mode = WAL');

   // Run database operations within a transaction
   await db.withTransactionAsync(async () => {
    // get workout tempates
    const workoutTemplates = await db.getAllAsync('SELECT * FROM workout_session_templates where is_active = true;');
    console.log('initial workoutTemplates');
    console.log(workoutTemplates);
    // loop through each workout template and pull latest workout_session, and then workout_session_items for that workout_session
    for(let x = 0; x < workoutTemplates.length;x++){
      const templateId = workoutTemplates[x].id;

      console.log("this workout template ID: " + templateId);
      
      // get latest workout session 
      const latestWorkoutsSession = await db.getFirstAsync(
        'SELECT * from workout_sessions where workout_session_template_id  = "' + templateId + '" \
        ORDER BY timestamp DESC LIMIT 1;');
      
        console.log('latestWorkoutsSession');
        console.log(latestWorkoutsSession);
      workoutTemplates[x].latestWorkoutSession = latestWorkoutsSession;
      const workoutSessionId = latestWorkoutsSession.id;

      // get workout session items for this workout session
      const workoutSessionItems = latestWorkoutsSession ? await db.getAllAsync('\
        SELECT wsi.*, w.* FROM workout_session_items as wsi \
        join workouts as w on wsi.workout_id=w.id \
        where wsi.workout_session_id = "' + workoutSessionId + '";') : [];
      console.log('workoutSessionItems');
      console.log(workoutSessionItems);

      workoutTemplates[x].workouts = workoutSessionItems;
      // get last workout totals
    }
    console.log('workoutTemplates');
    console.log(workoutTemplates[x]);

    setWorkoutTemplates(workoutTemplates);
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
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            duration INTEGER DEFAULT 0,
            FOREIGN KEY (workout_session_template_id) 
              REFERENCES workout_session_templates(id)
              ON DELETE CASCADE
          );`
        );
        // WORKOUT SESSION ITEMS table
        await db.execAsync('DROP TABLE IF EXISTS workout_session_items;'); 
        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS workout_session_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workout_session_id INTEGER NOT NULL,
            workout_id INTEGER NOT NULL,
            goal INTEGER DEFAULT 0,
            done INTEGER DEFAULT 0,
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
        await db.runAsync('INSERT INTO workout_session_items (workout_session_id, workout_id, goal, done) VALUES (?, ?, ?, ?)', [sessionId, 1, null, 0]);
        await db.runAsync('INSERT INTO workout_session_items (workout_session_id, workout_id, goal, done) VALUES (?, ?, ?, ?)', [sessionId, 2, null, 0]);
        await db.runAsync('INSERT INTO workout_session_items (workout_session_id, workout_id, goal, done) VALUES (?, ?, ?, ?)', [sessionId, 3, null, 0]);

        // Retrieve the most recent user
        const result = await db.getFirstAsync('SELECT * FROM users ORDER BY id DESC LIMIT 1;');
        setUser(result);
        const testString = await db.getFirstAsync('SELECT done FROM workout_session_items ORDER BY id DESC LIMIT 1;');
        console.log('testString');
        console.log(testString);
        setTestString(testString.done)
      });
    };