import Reminders from "../model/index.js";

const findAll = async (data) => {
    const result = await Reminders.findAll({ raw: true })
    return result
}

const addReminder = async (data) => {
    const result = await Reminders.create(data)
    return result
}

const delReminder = async (data) => {
    const result = await Reminders.destroy({
        where: {
            id: data
        }
    })
    return result
}

const findReminder = async (data) => {
    const result = await Reminders.findOne({
        where: {
            id: data
        }
    })
    return result
}

const cleanReminders = async () => {
    const result = await Reminders.destroy({
        where: {
            description: ""
        }
    })
    return result
}



export default {
    findAll,
    addReminder,
    delReminder,
    findReminder,
    cleanReminders
}