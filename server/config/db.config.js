const dbConfig = {
    HOST: "localhost",
    USER: "sdo_development", // Use a dedicated DB user with least privilege
    PASSWORD: "password", // Store secrets in environment variables in production
    DB: "sdo_development", // Database name
    PORT: 3306,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
export default dbConfig;