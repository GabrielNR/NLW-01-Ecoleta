import path from 'path';


const postgresConfig = {
  client: 'pg', 
  connection: {
    host: 'localhost', 
    port: 5432,
    user: 'docker', 
    password: 'docker', 
    database: 'nlw01-ecoleta', 
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  },
  seeds: {
    directory: path.resolve(__dirname, 'src', 'database', 'seeds')
  },
  useNullAsDefault: false, 
};

module.exports = postgresConfig;