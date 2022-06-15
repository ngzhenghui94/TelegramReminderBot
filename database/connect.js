import Sequelize from 'sequelize'
import SQL_CONFIG from './dbConfig.js'

const sequelize = new Sequelize(SQL_CONFIG)

sequelize.authenticate()
  .then(() => {
    console.log("-------------- Connected to DB success ------------------");
  })
  .catch(err => {
    console.log("-------------- Failed to Connect to DB ------------------");
    console.log("-------------- " + err + " ------------------");
  });

export default sequelize