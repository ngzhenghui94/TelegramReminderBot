import { Sequelize } from "sequelize";

const Reminders = {
    uuid: Sequelize.STRING,
    addedon: Sequelize.DATE,
    addedby: Sequelize.STRING,
    reminderdatetime: Sequelize.DATE,
}

export default Reminders