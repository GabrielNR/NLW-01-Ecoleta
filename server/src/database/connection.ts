import knex from 'knex';

const connection = knex({
    client: 'pg',
    connection: {
      host: 'localhost', 
      port: 5432,
      user: 'docker',
      password: 'docker',
      database: 'nlw01-ecoleta',
    },
    useNullAsDefault: false, 
});

export default connection;