import TelegramBot from "node-telegram-bot-api";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Singapore");
import schedule from "node-schedule-tz";
import dotenv from "dotenv";
dotenv.config();
import { spawn } from "child_process";
import ReminderController from './database/reminderController.js'
import reminderController from "./database/reminderController.js";



// let data = {
//   uuid: "03456789",
//   reminderdatetime: "03",
//   addedon: moment().format(),
//   addedby: "Daniel"
// }
// const test = async () => {
//    return await reminderController.findAll().then((result) => {
//     console.log(result)
//   })
// }
// test()
// console.log(ReminderController.findAll())
// console.log(ReminderController.addReminder(data))

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const adminId = process.env.ADMINID;
const telegramGroupId = process.env.TELEGRAMGROUPID

const init = async () => {
  bot.sendMessage(adminId, "Reminders checked and updated.");
  return await ReminderController.findAll().then((result) => {
    // console.log(result)
    for (let i = 0; i < result.length; i++) {
      schedule.scheduleJob("1 1 8 " + result[i].reminderdatetime + " * *", async () => {
        bot.sendMessage(
          telegramGroupId,
          `Reminder to do your ${month} self-check and ${month} CTL Quiz. Thank you`
        );
        bot.sendMessage(
          adminId,
          `I have sent reminder to do your ${month} CTL Quiz. Thank you.`
        );
      })
    }
  })
}
init();

bot.onText(/^(\/getSchedule)$/i, async (msg) => {
  // console.log(msg);
  return await ReminderController.findAll().then((result) => {
    try {
      // console.log(result[0])
      let returnMsg = "|  ID  |   Reminder Date   |   Added By   |    Added On   |   Desc   |\n";
      // console.log(moment(result[3].reminderdatetime).tz("Asia/Singapore").format("DDMMYY HH:mm"))
      for (let i = 0; i < result.length; i++) {
        returnMsg += `|   ${result[i].id}   |      ${result[i].reminderdatetime}       |   ${result[i].addedby}   |   ${moment(result[i].addedon).format("DDMMYY HH:mm")}   |   ${result[i].description}   |\n`;
      }
      // console.log(returnMsg)
      bot.sendMessage(msg.chat.id, returnMsg);
      bot.sendMessage(
        151894779,
        "Reminders Alert: Called @ " +
        moment.unix(msg.date).format("MM/DD/YYYY HH:mm")
      );
    } catch (err) {
      bot.sendMessage(151894779, "reminder error" + err);
    }
  })
});



//node schedule job that runs at midnight everyday
const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.second = 30;
rule.dayOfWeek = [new schedule.Range(1, 7)];

//At midnight, re-check and update all scheduled reminders
const job = schedule.scheduleJob(rule, async () => {
  const month = moment().format("MMMM");
  bot.sendMessage(adminId, "Reminders checked and updated.");
  return ReminderController.findAll().then(async (result) => {
    for (let i = 0; i < result.length; i++) {
      schedule.scheduleJob("1 1 8 " + result[i].reminderdatetime + " * *", async () => {
        bot.sendMessage(
          telegramGroupId,
          `Reminder to do your ${month} self-check and ${month} CTL Quiz. Thank you`
        );
        bot.sendMessage(
          adminId,
          `I have sent reminder to do your ${month} CTL Quiz. Thank you.`
        );
      })
    }
  })
});





/* A cron job that runs on the first day of the month at 8am. */
schedule.scheduleJob("1 1 8 1 * *", async () => {
  const month = moment().format("MMMM");
  bot.sendMessage(
    telegramGroupId,
    `Reminder to do your ${month} self-check and ${month} CTL Quiz. Thank you`
  );
  bot.sendMessage(
    adminId,
    `I have sent reminder to do your ${month} CTL Quiz. Thank you.`
  );
});

/* A cron job that runs on the 20th day of the month at 8am.  */
schedule.scheduleJob("30 45 7  20 * *", async () => {
  const month = moment().format("MMMM");
  bot.sendMessage(
    telegramGroupId,
    `Reminder to do your ${month} CTL Quiz. Thank you.`
  );
  bot.sendMessage(
    adminId,
    `I have sent reminder to do your ${month} CTL Quiz. Thank you.`
  );
});

/* A cron job that runs on the 25th day of the month at 8am. */
schedule.scheduleJob("30 0 8 25 * *", async () => {
  const month = moment().format("MMMM");
  bot.sendMessage(
    telegramGroupId,
    `Reminder to do your ${month} CTL Quiz. Thank you.`
  );
  bot.sendMessage(
    adminId,
    `I have sent reminder to do your ${month} CTL Quiz. Thank you.`
  );
});

bot.onText(/^(\/getcode)$/i, (msg) => {
  console.log(msg);
  try {
    const pyProg = spawn("python3", ["main.py"]);
    pyProg.stdout.on("data", (data) => {
      bot.sendMessage(msg.chat.id, data.toString());

      bot.sendMessage(
        151894779,
        "Security Alert: Called @  " +
        moment.unix(msg.date).format("MM/DD/YYYY HH:mm") +
        " \n" +
        data.toString()
      );
    });
  } catch (err) {
    bot.sendMessage(151894779, "error");
  }
});
