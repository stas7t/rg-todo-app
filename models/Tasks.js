let pg = require('pg');
let connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo_db:5432/todo';

let client = new pg.Client(connectionString);

client.connect();
let query = client.query(
    'CREATE TABLE IF NOT EXISTS tasks(id SERIAL PRIMARY KEY, name TEXT not null, status TEXT, priority SMALLINT, deadline TIMESTAMP WITH TIME ZONE, user_id TEXT, project_id INTEGER REFERENCES projects (id))'
);
query.on('end', function () { client.end(); });