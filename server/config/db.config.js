const dbConfig = {
    HOST: process.env.DB_HOST || "localhost",
    USER: process.env.DB_USER || "sdo_development",
    PASSWORD: process.env.DB_PASSWORD || "password",
    DB: process.env.DB_NAME || "sdo_development",
    PORT: process.env.DB_PORT || 3306,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
export default dbConfig;