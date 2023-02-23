import Reminders from "../model/reminders.js";
import RemindersV2 from "../model/messageReminder.js"
import Admins from "../model/admin.js";



const findAll = async (type) => {
    try {
        if (type == "V2") {
            const result = await RemindersV2.findAll({
                raw: true
                , order: [
                    ['addedon'],
                ],
            })
            return result
        } else {
            const result = await Reminders.findAll({
                raw: true
                , order: [
                    ['addedon'],
                ],
            })
            return result
        }
    } catch (err) {
        return err
    }
}

const addReminder = async (data) => {
    try {
        if (data.type == "V2") {
            const result = await RemindersV2.create(data)
            return result
        } else {
            const result = await Reminders.create(data)
            return result
        }

    } catch (err) {
        return err
    }
}

const delReminder = async (data) => {
    try {
        if (data.type == "V2") {
            const result = await RemindersV2.destroy({
                where: {
                    msgId: data.msgId
                }
            })
            return result
        } else {
            const result = await Reminders.destroy({
                where: {
                    id: data
                }
            })
            return result
        }

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

const findAllRemindersTwo = async () => {
    try {
        const result = await RemindersV2.findAll({ raw: true })
        return result
    } catch (err) {
        return err
    }
}

const findByMsgId = async (data) => {
    try {
        const result = await RemindersV2.findOne({
            where: {
                msgId: data
            },
            raw: true
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
    cleanReminders,
    findAllAdmin,
    findAllRemindersTwo,
    addAdmin,
    findByMsgId
}