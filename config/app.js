module.exports = {
    development: {
      dialect: "mysql",
      storage: "./db.development.sqlite"

    },
    test: {
      dialect: "sqlite",
      storage: ":memory:"
    },
    production: {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      dialect: 'mysql',
      use_env_variable: 'DATABASE_URL'
    },
    siteTitle:"THP website"
  };