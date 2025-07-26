import dotenv from 'dotenv';
dotenv.config();


const config = {
  development: {
    logging: false, // remember to turn back on 
    username: process.env.DB_USER || "sdo_development",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "sdo_development",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  test: {
    logging: false,
    username: process.env.TEST_DB_USER || "sdo_testing",
    password: process.env.TEST_DB_PASSWORD || "password",
    database: process.env.TEST_DB_NAME || "sdo_testing",
    host: process.env.TEST_DB_HOST || "localhost",
    port: process.env.TEST_DB_PORT || 3306,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  production: {
    logging: false, // remember to turn back on 
    username: process.env.PROD_DB_USER || "sdo_development",
    password: process.env.PROD_DB_PASSWORD || "password",
    database: process.env.PROD_DB_NAME || "sdo_development",
    host: process.env.PROD_DB_HOST || "localhost",
    port: process.env.PROD_DB_PORT || 3306,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};

export default config;
