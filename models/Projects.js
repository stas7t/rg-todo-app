let pg = require('pg');
let connectionString = process.env.DATABASE_URL || 'postgres://localhost';

let client = new pg.Client(connectionString);

client.connect();
client.query('CREATE TABLE IF NOT EXISTS projects(id SERIAL PRIMARY KEY, name TEXT not null, user_id TEXT)');
client.end();