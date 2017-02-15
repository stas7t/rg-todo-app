let pg = require('pg');
let connectionString = process.env.DATABASE_URL || 'postgres://scsksajxkfacju:63f674e8151fe9a9948849388151831a418571b222e5af36a5f7c8fd7d48b8a7@ec2-23-23-186-157.compute-1.amazonaws.com:5432/d2vogc5ech97g';

let client = new pg.Client(connectionString);
client.connect();
let query = client.query(
  'CREATE TABLE projects(id SERIAL PRIMARY KEY, name TEXT not null, user_id TEXT)');
query.on('end', () => { client.end(); });