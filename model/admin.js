import sequelize from '../database/connect.js'
// import Reminders from './reminders.js'
import { Model, Sequelize } from "sequelize"

class Admins extends Model { }
Admins.init({
    teleid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
    },
    telename: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "Admins",
    timestamps: false,

})

console.log("🚀 ~ file: index.js ~ line 5 ~ const test = sequelize.define('admins', Admins)", Admins === sequelize.models.Admins)

// console.log(await Admins.findAll())
// 
// Admins.sync({alter: true, force: true})
//   .then(()=>{
//     console.log("Synced Admins Table!")
//   });

export default Admins
