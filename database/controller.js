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


const addAdmin = async (data) => {
    console.log(data.teleid)
    try {
        const result = await Admins.findOne({
            where: {
                teleid: data.teleid
            }
        })
        if (result != null) {
            console.log("Admin already exists" + result)
            return "Admin already exists"
        } else if (result == null) {
            const res = await Admins.create(data)
            console.log("Created Admin" + res)
            return res
        }
    } catch (err) {
        return err
    }
}
addAdmin({ teleid: 151894779, telename: "daniel" })

const findAllAdmin = async () => {
    try {
        const result = await Admins.findAll({ raw: true })
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
    cleanReminders,
    findAllAdmin,
    addAdmin
}