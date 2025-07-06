import dotenv from 'dotenv';
dotenv.config();

const config = {
  development: {
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
  // Add test and production configs as needed
};

export default config;
