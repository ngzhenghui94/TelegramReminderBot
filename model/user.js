import sequelize from '../database/connect.js'
// import Reminders from './reminders.js'
import { Model, Sequelize } from "sequelize"

class Users extends Model { }
Users.init({
    uuid: Sequelize.STRING,
    addedon: Sequelize.DATE,
    addedby: Sequelize.STRING,
    reminderdatetime: Sequelize.STRING,
    description: Sequelize.STRING
},{
    sequelize,
    modelName: "Users",
    timestamps: false
})
// const Usersmodel = sequelize.define('users', Users)

console.log("🚀 ~ file: index.js ~ line 5 ~ const test = sequelize.define('users', Users)", Users === sequelize.models.Users)

// console.log(await Users.findAll())

// Users.sync({alter: true, force: true})
//   .then(()=>{
//     console.log("Synced Users Table!")
//   });

export default Users
