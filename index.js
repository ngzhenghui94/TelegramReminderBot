import TelegramBot from "node-telegram-bot-api";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Singapore");
import schedule from "node-schedule";
import dotenv from "dotenv";
dotenv.config();

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const sendTo = process.env.TELEGRAMID;
const myTelegramId = process.env.MYTELEGRAMID;


/* A cron job that runs every 2 seconds. */
const job = schedule.scheduleJob("2 * *  * * *", async () => {
	bot.sendMessage("-598126299", "Hello World!");
	console.log("Hello World!");
});
