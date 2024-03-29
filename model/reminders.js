import sequelize from '../database/connect.js'
// import Reminders from './reminders.js'
import { Model, Sequelize } from "sequelize"

class Reminders extends Model { }
Reminders.init({
    uuid: Sequelize.STRING,
    addedon: Sequelize.DATE,
    addedby: Sequelize.STRING,
    reminderdate: Sequelize.STRING,
    remindertime: Sequelize.STRING,
    description: Sequelize.STRING,
    sendTo: Sequelize.STRING,
},{
    sequelize,
    modelName: "Reminders",
    timestamps: false
})
// const ReminderModel = sequelize.define('reminders', Reminders)

console.log("🚀 ~ file: index.js ~ line 5 ~ const test = sequelize.define('reminders', Reminders)", Reminders === sequelize.models.Reminders)

// console.log(await Reminders.findAll())

// Reminders.sync({alter: true, force: true})
//   .then(()=>{
//     console.log("Synced Reminders Table!")
//   });

export default Reminders
