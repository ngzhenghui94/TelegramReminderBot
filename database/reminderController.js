import Reminders from "../model/index.js";

const findAll = async (data) => {
    const result = await Reminders.findAll({raw: true})
    return result
}

const addReminder = async (data) => {
    const result = await Reminders.create(data)
    return result
}


export default {
    findAll,
    addReminder
}