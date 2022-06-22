import Reminders from "../model/reminders.js";
import Admins from "../model/admin.js";

const findAll = async () => {
    try {
        const result = await Reminders.findAll({
            raw: true
            , order: [
                ['reminderdate'],
            ],
        })
        return result
    } catch (err) {
        return err
    }
}

const addReminder = async (data) => {
    try {
        const result = await Reminders.create(data)
        return result
    } catch (err) {
        return err
    }
}

const delReminder = async (data) => {
    try {
        const result = await Reminders.destroy({
            where: {
                id: data
            }
        })
        return result
    } catch (err) {
        return err
    }

}

const findReminder = async (data) => {
    try {
        const result = await Reminders.findOne({
            where: {
                id: data
            }
        })
        return result
    } catch (err) {
        return err
    }

}

const cleanReminders = async () => {
    try {
        const result = await Reminders.destroy({
            where: {
                description: ""
            }
        })
        return result
    } catch (err) {
        return err
    }

}



export default {
    findAll,
    addReminder,
    delReminder,
    findReminder,
    cleanReminders
}