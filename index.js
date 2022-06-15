import TelegramBot from "node-telegram-bot-api";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Singapore");
import schedule from "node-schedule-tz";
import dotenv from "dotenv";
dotenv.config();
import { spawn } from "child_process";
import ReminderController from './database/reminderController.js'



// let data = {
//   uuid: "wwfw",
//   reminderdatetime: moment().format(),
//   addedon: moment().format(),
//   addedby: "Daniel"

// }
console.log(ReminderController.findAll())
// console.log(ReminderController.addReminder(data))


const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const adminId = process.env.ADMINID;
const telegramGroupId = process.env.TELEGRAMGROUPID;

bot.onText(/^(\/getSchedule)$/i, (msg) => {
  console.log(msg);
  try {
    let reminders = ReminderController.findAll();
    bot.sendMessage(msg.chat.id, reminders.toString());
    bot.sendMessage(
      151894779,
      "Reminders Alert: Called @  " +
      moment.unix(msg.date).format("MM/DD/YYYY HH:mm") +
      " \n" +
      data.toString()
    );
  } catch (err) {
    bot.sendMessage(151894779, "reminder error");
  }
});

/* A cron job that runs on the first day of the month at 8am. */
schedule.scheduleJob("1 1 8 1 * *", async () => {
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
