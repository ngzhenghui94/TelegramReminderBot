import TelegramBot from "node-telegram-bot-api";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Singapore");
import schedule from "node-schedule-tz";
import dotenv from "dotenv";
dotenv.config();

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const adminId = process.env.ADMINID;
const telegramGroupId = process.env.TELEGRAMGROUPID;

/* A cron job that runs first day of the month. */
schedule.scheduleJob("* * 1  * * *", "Asia/Singapore", async () => {
	bot.sendMessage(telegramGroupId, `Reminder to do your ${month} self-check`);
	bot.sendMessage(
		adminId,
		`I have sent reminder to do your ${month} CTL Quiz. Thank you.`
	);
});

/* A cron job that runs on the 20th day of the month. */
schedule.scheduleJob("* * 20  * * *", "Asia/Singapore", async () => {
	const getMonth = moment().format("MMMM");
	bot.sendMessage(
		telegramGroupId,
		`Reminder to do your ${month} CTL Quiz. Thank you.`
	);
	bot.sendMessage(
		adminId,
		`I have sent reminder to do your ${month} CTL Quiz. Thank you.`
	);
});

schedule.scheduleJob("* * 25  * * *", "Asia/Singapore", async () => {
	const getMonth = moment().format("MMMM");
	bot.sendMessage(
		telegramGroupId,
		`Reminder to do your ${month} CTL Quiz. Thank you.`
	);
	bot.sendMessage(
		adminId,
		`I have sent reminder to do your ${month} CTL Quiz. Thank you.`
	);
});

schedule.scheduleJob("*/2 * *  * * *", async () => {
	const month = moment().format("MMMM");
	console.log(month);
	bot.sendMessage(
		telegramGroupId,
		`Reminder to do your ${month} CTL Quiz. Thank you.`
	);
	bot.sendMessage(
		adminId,
		`I have sent reminder to do your ${month} CTL Quiz. Thank you.`
	);
});
