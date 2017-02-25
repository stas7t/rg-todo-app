let pg = require('pg');
let connectionString = process.env.DATABASE_URL || 'postgres://localhost';

let client = new pg.Client(connectionString);

client.connect();
client.query('CREATE TABLE IF NOT EXISTS tasks(id SERIAL PRIMARY KEY, name TEXT not null, status TEXT, priority SMALLINT, deadline TIMESTAMP WITH TIME ZONE, user_id TEXT, project_id INTEGER REFERENCES projects (id))');
client.end();