import Sequelize from "sequelize";

let SQL_CONFIG = {
  database: process.env.DBNAME,
  username: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  dialect: "mysql",
  options: {
    host: process.env.DBHOSTNAME,
    pool: {
      max: 30,
      min: 0,
      idle: 10000,
      acquire: 30000,
    },
  },
};

const sequelize = new Sequelize(SQL_CONFIG);

export default sequelize
  .authenticate()
  .then(() => {
    console.log("-------------- Connected to DB success ------------------");
  })
  .catch((err) => {
    console.log("-------------- Failed to Connect to DB ------------------");
    console.log("-------------- " + err + " ------------------");
  });
