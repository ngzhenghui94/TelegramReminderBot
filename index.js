import TelegramBot from "node-telegram-bot-api";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Singapore");
import schedule from "node-schedule-tz";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import { spawn } from "child_process";

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const adminId = process.env.ADMINID;
const telegramGroupId = process.env.TELEGRAMGROUPID;

/* A cron job that runs on the first day of the month at 8am. */
schedule.scheduleJob("* * 8 1 * *", async () => {
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
schedule.scheduleJob("* 45 7  20 * *", async () => {
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
schedule.scheduleJob("* * 8 25 * *", async () => {
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
	console.log(msg)
	try{
		const pyProg = spawn("python3", ["main.py"]);
		pyProg.stdout.on("data", (data) => {
		bot.sendMessage(msg.chat.id, data.toString()); 
		});	
	} catch (err) {
		bot.sendMessage(151894779, 'error');
	}
})