let pg = require('pg');
let connectionString = process.env.DATABASE_URL || 'postgres://localhost';

let client = new pg.Client(connectionString);
client.connect();
//client.query("ALTER TABLE tasks ALTER COLUMN status TYPE TEXT USING CASE status WHEN TRUE THEN 'completed' ELSE 'uncompleted' END");
//client.query("UPDATE tasks SET status='completed' WHERE status='true'");
//client.query("UPDATE tasks SET status='uncompleted' WHERE status='false'");

//client.query("ALTER TABLE tasks ADD priority smallint");
//client.query('ALTER TABLE tasks ADD deadline timestamp');

//client.query("UPDATE tasks SET priority=0");

//client.query('ALTER TABLE tasks ALTER COLUMN deadline TIMESTAMP WITH TIME ZONE');

//client.query("UPDATE tasks SET deadline=null");

//client.query("ALTER TABLE tasks DROP COLUMN user_id");
//client.query("ALTER TABLE tasks ADD COLUMN user_id TEXT");
//client.query("UPDATE tasks SET user_id='5893aae0361dea0400aa52d6'");

/*
client.query("ALTER TABLE projects DROP COLUMN user_id");
client.query("ALTER TABLE projects ADD COLUMN user_id TEXT");
client.query("UPDATE projects SET user_id='5893aae0361dea0400aa52d6'");
*/

//client.query("UPDATE projects SET user_id='5897a389594dc60004c6494c'");

//client.query("UPDATE tasks SET user_id='5897a389594dc60004c6494c'");

//client.query("UPDATE tasks SET status='uncompleted expired' WHERE status='expired'");