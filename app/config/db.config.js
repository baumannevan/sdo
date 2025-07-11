export default {
    HOST: "localhost",
    USER: "development",
    PASSWORD: "password",
    DB: "sdo",
    PORT: 3306,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};