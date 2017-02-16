let pg = require('pg');
let connectionString = process.env.DATABASE_URL || 'postgres://localhost';

let client = new pg.Client(connectionString);
client.connect();
let query = client.query(
  'CREATE TABLE projects(id SERIAL PRIMARY KEY, name TEXT not null, user_id TEXT)');
query.on('end', function() { client.end(); });