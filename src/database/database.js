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
        setWorkouts(workouts);
    });
  };


export const fetchWorkoutSessions = async ({setWorkoutSessions}) => {
  const db = await SQLite.openDatabaseAsync('trainer.db');
  await db.execAsync('PRAGMA journal_mode = WAL');
   await db.withTransactionAsync(async () => {
     // get workout tempates
     const workoutSessions = await db.getAllAsync(`SELECT * FROM workout_sessions`);
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


  // THIS FUNCTION MUST - determine if the - probably could use a function for this - 
  // IF NOT - get the workout_session for this template, delete the workout_session_items for this workout_session, delete the workout_session, finally delete the workout template
  export const deleteWorkoutTemplate = async (id) => {
    const db = await SQLite.openDatabaseAsync('trainer.db');
    await db.execAsync('PRAGMA journal_mode = WAL');
    // get latests workout_session for this template.  
    const latestWorkoutsSession = await db.getFirstAsync(
      'SELECT * from workout_sessions where workout_session_template_id  = "' + id + '" \
      ORDER BY timestamp DESC LIMIT 1;');
      console.log('latestWorkoutsSession');
      console.log(latestWorkoutsSession);
      const workoutSessionId = latestWorkoutsSession.id;
    // get workout session items for the latest workout_session -
    const workoutSessionItems = latestWorkoutsSession ? await db.getAllAsync('\
      SELECT wsi.*, w.* FROM workout_session_items as wsi \
      join workouts as w on wsi.workout_id=w.id \
      where wsi.workout_session_id = "' + workoutSessionId + '";') : [];
    console.log('workoutSessionItems');
    console.log(workoutSessionItems);
    // IF/ELSE - are these legit workout_session_items signifying a workout has taken place?  (is done set to a value greater than 0 for all related workout_session_items)
    let b_legitWorkoutSession = true;
    b_legitWorkoutSession = (!workoutSessionItems || workoutSessionItems.length == 0) ? false : b_legitWorkoutSession;
    for(var x = 0; x < workoutSessionItems.length; x++){
      if(!workoutSessionItems[x].done > 0){
        b_legitWorkoutSession = false;
      }
    }
    // IF - Is legit workout session -> simply set workout_session_template.id to inactive
    // TODO: here - create update sql & run to change this workout session template to inactive
    if(b_legitWorkoutSession){
      
    }

    // ELSE - No legit workout session -> delete all workout_session_items associated with this latest workout_session
    
      // DELETE the workout_session

      // DELETE the workout_session_template
     await db.withTransactionAsync(async () => {
       await db.runAsync(`DELETE FROM workout_session_templates WHERE id = ?`, id);
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
      
      // get latest workout session for this template
      const latestWorkoutsSession = await db.getFirstAsync(
        'SELECT * from workout_sessions where workout_session_template_id  = "' + templateId + '" \
        ORDER BY timestamp DESC LIMIT 1;');
      
      workoutTemplates[x].latestWorkoutSession = latestWorkoutsSession;
      const workoutSessionId = latestWorkoutsSession.id;

      // get workout session items for this workout session
      const workoutSessionItems = latestWorkoutsSession ? await db.getAllAsync('\
        SELECT wsi.*, w.* FROM workout_session_items as wsi \
        join workouts as w on wsi.workout_id=w.id \
        where wsi.workout_session_id = "' + workoutSessionId + '";') : [];
      console.log('workoutSessionItems');
      console.log(workoutSessionItems);

      workoutTemplates[x].workoutSessionItems = workoutSessionItems;
      // get last workout totals
    }
    console.log('all workoutTemplates');
    console.log(workoutTemplates);

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
          { name: 'Push-Ups', description: 'Assume plank position with a rigid back.  Lower yourself all the way to the ground by bending your elbows.  Push yourself all the way up until your elbows are straight.' },
          { name: 'Pull-Ups', description: 'Jump up and grab a bar, tree branch or whatever hanging object you can find.  Pull yourself up so your chin is above the bar. Lower yourself back down 3/4 of the way.' },
          { name: 'Sit-Ups', description: 'Laying down on your back, contract your abdomen muscles to lift your upper torso off the floor, touching your elbow to your knees and then lower yourself back down.' },
          { name: 'Bodyweight Squats', description: 'Extending your arms straight forward, turn your feet out about 30 degrees, a little wider than shoulder width apart.  Keeping your back straight, bring your hips back and sink into a deep squat position, then push yourself back up.' },
          { name: 'Burpees', description: 'Squat, planting your hands on the ground in front of you.  Kick your feet back into push-up position.  Jump your feet forward back between your hand, into a squatting position.  Finally Jump up in the air and land standing up.' },
        ];
        for(var x = 0; x < workouts.length; x++){
          await db.runAsync('INSERT INTO workouts (name, description) VALUES (?, ?);', [workouts[x].name, workouts[x].description]);
        }
        //Insert workout session template
        const templateResult = await db.runAsync('INSERT INTO workout_session_templates (name, is_active) VALUES (?, ?)', ['test workout', 1]);
        const templateId = templateResult.lastInsertRowId;
        // Insert workout session
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(13, 0, 0, 0); // 1 PM UTC
        const sessionResult = await db.runAsync('INSERT INTO workout_sessions (workout_session_template_id, timestamp, duration) VALUES (?, ?, ?)', [templateId, yesterday.toISOString(), 320]);
        const sessionId = sessionResult.lastInsertRowId;
        // Insert workout session items
        await db.runAsync('INSERT INTO workout_session_items (workout_session_id, workout_id, goal, done) VALUES (?, ?, ?, ?)', [sessionId, 1, null, 20]);
        await db.runAsync('INSERT INTO workout_session_items (workout_session_id, workout_id, goal, done) VALUES (?, ?, ?, ?)', [sessionId, 2, null, 30]);
        await db.runAsync('INSERT INTO workout_session_items (workout_session_id, workout_id, goal, done) VALUES (?, ?, ?, ?)', [sessionId, 3, null, 40]);

        // Retrieve the most recent user
        const result = await db.getFirstAsync('SELECT * FROM users ORDER BY id DESC LIMIT 1;');
        setUser(result);
      });
    };