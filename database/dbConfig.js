import dotenv from "dotenv";
dotenv.config();

const {
    DBNAME,
    DBUSER,
    DBPASSWORD,
    DBHOSTNAME
} = process.env



let SQL_CONFIG = {
    database: DBNAME,
    username: DBUSER,
    password: DBPASSWORD,
    dialect: "mysql",
    options: {
        host: DBHOSTNAME,
        pool: {
            max: 30,
            min: 0,
            idle: 10000,
            acquire: 30000
        }
    }
};

export default SQL_CONFIG