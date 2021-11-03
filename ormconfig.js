module.exports = {
  type: 'mysql',
  replication: {
    master: {
      host: '172.24.0.7',
      port: process.env.DB_PORT,
      username: 'root',
      password: 'mypass',
      database: 'mydb',
    },
    slaves: [
      {
        host: '172.24.0.7',
        port: 3306,
        username: 'root',
        password: '111',
        database: 'mydb',
      },
      {
        host: '172.24.0.7',
        port: 3306,
        username: 'repl',
        password: '111',
        database: 'mydb',
      },
    ],
  },
  selector: 'RR',
  removeNodeErrorCount: 5,
  synchronize: true,
  logging: false,
  migrationsTableName: 'migrations',
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
  },
};
