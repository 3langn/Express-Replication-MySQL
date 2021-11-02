module.exports = {
  type: 'mysql',
  replication: {
    master: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    slaves: [
      {
        host: process.env.DB_READ_HOST1,
        port: 3306,
        username: 'root',
        password: '111',
        database: 'mydb',
      },
      {
        host: process.env.DB_READ_HOST2,
        port: 3306,
        username: 'root',
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
