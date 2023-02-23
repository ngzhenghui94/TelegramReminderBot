import sequelize from '../database/connect.js'
import { Model, Sequelize } from "sequelize"

class RemindersV2 extends Model { }
RemindersV2.init({
    uuid: Sequelize.STRING,
    msgId: Sequelize.STRING,
    remindMsgId: Sequelize.STRING,
    chatId: Sequelize.STRING,
    addedon: Sequelize.STRING,

}, {
    sequelize,
    modelName: "RemindersV2",
    timestamps: false
})
// const ReminderModel = sequelize.define('remindersV2', RemindersV2)

console.log("🚀 ~ file: index.js ~ line 5 ~ const test = sequelize.define('remindersv2', Remindersv2)", RemindersV2 === sequelize.models.RemindersV2)

// console.log(RemindersV2.findAll())

// console.log(await Reminders.findAll())

// RemindersV2.sync({alter: true, force: true})
//   .then(()=>{
//     console.log("Synced Reminders Table!")
//   });

export default RemindersV2
