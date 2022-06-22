import TelegramBot from "node-telegram-bot-api";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Singapore");
import schedule from "node-schedule-tz";
import dotenv from "dotenv";
dotenv.config();
import { spawn } from "child_process";
import Controller from './database/controller.js';

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const adminId = process.env.ADMINID;
const telegramGroupId = process.env.TELEGRAMGROUPID

const init = async () => {
  bot.sendMessage(adminId, "Reminders checked and updated.");
  await Controller.cleanReminders()
  return await Controller.findAll().then((result) => {
    // console.log(result)
    for (let i = 0; i < result.length; i++) {
      // console.log("1 " + result[i].remindertime[2]+result[i].remindertime[3]+ " " + result[i].remindertime[0]+result[i].remindertime[1] + " " + result[i].reminderdate + " * *")
      schedule.scheduleJob("1 " + result[i].remindertime[2] + result[i].remindertime[3] + " " + result[i].remindertime[0] + result[i].remindertime[1] + " " + result[i].reminderdate + " * *", async () => {
        bot.sendMessage(
          telegramGroupId,
          `Reminder: ${result[i].description}. Thank you`
        );
      })
    }
  })
}
init();

bot.onText(/^(\/getSchedule|\/get)$/i, async (msg) => {
  // console.log(msg);
  return await Controller.findAll().then((result) => {
    try {
      // console.log(result[0])
      let returnMsg = "|  ID  |   Reminder Date & Time  |   Added By   |    Added On   |   Desc   |\n";
      // console.log(moment(result[3].reminderdatetime).tz("Asia/Singapore").format("DDMMYY HH:mm"))
      for (let i = 0; i < result.length; i++) {
        returnMsg += `|   ${result[i].id}   |      ${result[i].reminderdate} - ${result[i].remindertime}      |   ${result[i].addedby}   |   ${moment(result[i].addedon).format("DDMMYY HH:mm")}   |   ${result[i].description}   |\n`;
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

bot.onText(/^(\/resync)$/i, async (msg) => {
  bot.sendMessage(adminId, "Reminders checked and updated.");
  await Controller.cleanReminders()
  let jobList = schedule.scheduledJobs;
  let jobNameList = [];
  for (const keys in jobList) {
    jobNameList.push(jobList[keys].name);
  }
  for (let i = 0; i < jobNameList.length; i++) {
    jobList[jobNameList[i]].cancel()
  }
  return await Controller.findAll().then((result) => {
    // console.log(result)
    for (let i = 0; i < result.length; i++) {
      // console.log("1 " + result[i].remindertime[2]+result[i].remindertime[3]+ " " + result[i].remindertime[0]+result[i].remindertime[1] + " " + result[i].reminderdate + " * *")
      schedule.scheduleJob("1 " + result[i].remindertime[2] + result[i].remindertime[3] + " " + result[i].remindertime[0] + result[i].remindertime[1] + " " + result[i].reminderdate + " * *", async () => {
        bot.sendMessage(
          telegramGroupId,
          `Reminder: ${result[i].description}. Thank you`
        );
      })
    }
    bot.sendMessage(
      msg.chat.id,
      `Jobs resynced. Total Count : ${result.length}`
    );
  })
});

bot.onText(/^(\/seejobs|\/see)$/i, async (msg) => {
  // console.log(msg);
  try {
    let jobList = schedule.scheduledJobs;
    let jobNameList = [];
    bot.sendMessage(msg.chat.id, "Checking all scheduled jobs. /resync to force.");
    for (const keys in jobList) {
      jobNameList.push(jobList[keys].name);
    }
    for (let i = 0; i < jobNameList.length; i++) {
      console.log(jobList[jobNameList[i]].nextInvocation());
      let stringTime = (jobList[jobNameList[i]].nextInvocation()).toString()
      bot.sendMessage(msg.chat.id, "[" + (i + 1) + "] Reminders Date & Time: " + moment(stringTime).format("DD-HHmm") + "H");
    }
  } catch (err) {
    bot.sendMessage(151894779, "see jobs error" + err);
  }
});

bot.onText(/(\/delReminder|\/del)(.*)/i, async (msg) => {
  let id = msg.text.split(" ")[1];
  if (msg.from.id == adminId) {
    if (parseInt(id)) {
      return await Controller.findReminder(id).then(async (res) => {
        // console.log("res" + res);
        if (res) {
          return await Controller.delReminder(id).then(async (result) => {
            // console.log("result" + result)
            try {
              if (result != 0) {
                console.log("deleted")
                bot.sendMessage(msg.chat.id, `Reminder ID: ${id} deleted.`);
              } else {
                console.log("not deleted")
                bot.sendMessage(msg.chat.id, "Reminder not found.");
              }
            } catch (err) {
              bot.sendMessage(msg.chat.id, "Reminder not found: " + err);
            }
          })
        } else {
          bot.sendMessage(msg.chat.id, "Reminder not found.");
        }
      })
    } else {
      bot.sendMessage(msg.chat.id, "Please enter reminder ID.");
    }
  } else {
    bot.sendMessage(msg.chat.id, "You are not authorized to delete reminders.");
    return;
  }


})

bot.onText(/(\/addReminder|\/add)(.*)/i, async (msg) => {
  const endOfMonth = moment().endOf('month').format('DD');
  let obj = {
    uuid: "",
    reminderdate: "",
    remindertime: "",
    addedon: "",
    addedby: "",
    description: ""
  }
  if (true) {
    // if (msg.from.id == adminId) {
    bot.sendMessage(msg.chat.id, "Please send your date of reminder");
    bot.once("message", async (msg) => {
      if (parseInt(msg.text) && parseInt(msg.text) <= endOfMonth && parseInt(msg.text) > 0) {
        let inputdate = msg.text
        if (inputdate.length == 1){
          inputdate = "0" + inputdate
        }
        obj.reminderdate = inputdate
        bot.sendMessage(msg.chat.id, "Please send your time of reminder");
        bot.once("message", async (msg) => {
          if (parseInt(msg.text) && parseInt(msg.text) <= 2359 && parseInt(msg.text) >= 0) {
            obj.remindertime = msg.text
            bot.sendMessage(msg.chat.id, "Please add your description");
            bot.once("message", async (msg) => {
              obj.description = msg.text
              obj.addedby = msg.from.last_name != undefined ? msg.from.first_name + " " + msg.from.last_name : msg.from.first_name
              obj.addedon = moment().format()
              obj.uuid = msg.from.id
              // console.log("obj" + JSON.stringify(obj))
              return await Controller.addReminder(obj).then(async (result) => {
                // console.log("result" + result)
                bot.sendMessage(msg.chat.id, "Reminder added.");
                schedule.scheduleJob("1 " + obj.remindertime[2] + obj.remindertime[3] + " " + obj.remindertime[0] + obj.remindertime[1] + " " + obj.reminderdate + " * *")
                return await Controller.findAll().then((result) => {
                  // console.log("result" + result)
                  let returnMsg = "|  ID  |   Reminder Date   |   Added By   |    Added On   |   Desc   |\n";
                  for (let i = 0; i < result.length; i++) {
                    returnMsg += `|   ${result[i].id}   |      ${result[i].reminderdate} - ${result[i].remindertime}      |   ${result[i].addedby}   |   ${moment(result[i].addedon).format("DDMMYY HH:mm")}   |   ${result[i].description}   |\n`;
                  }
                  bot.sendMessage(msg.chat.id, returnMsg)
                })
              })
            })
          }
        })
        // } 
        // else if (msg.from.id != adminId) {
        //   bot.sendMessage(msg.chat.id, "You are not authorized to add reminder.");
      } else if (parseInt(msg.text) >= endOfMonth || parseInt(msg.text) < 0) {
        bot.sendMessage(msg.chat.id, "Invalid Date. The end of this month is " + endOfMonth + ".\nPlease enter a valid date between 1 to " + endOfMonth + ".");
      } else {
        bot.sendMessage(msg.chat.id, "Invalid Date. The end of this month is " + endOfMonth + ".\nPlease enter a valid date between 1 to " + endOfMonth + ".");
      }
    })
  } else {
    bot.sendMessage(msg.chat.id, "You are not authorized to add reminder.");
  }
});

// //node schedule job that runs at midnight everyday
// const rule = new schedule.RecurrenceRule();
// rule.hour = new schedule.Range(0, 23, 4);
// rule.minute = 0;
// rule.second = 1;
// rule.dayOfWeek = [new schedule.Range(1, 7)];
// rule.tz = "Asia/Singapore";

// //At midnight, re-check and update all scheduled reminders
// const job = schedule.scheduleJob(rule, async () => {
//   const month = moment().format("MMMM");
//   bot.sendMessage(adminId, "Reminders checked and updated.");
//   return Controller.findAll().then(async (result) => {
//     for (let i = 0; i < result.length; i++) {
//       schedule.scheduleJob("1 " + result[i].remindertime[2]+result[i].remindertime[3]+ " " + result[i].remindertime[0]+result[i].remindertime[1] + " " + result[i].reminderdate + " * *", async () => {
//         bot.sendMessage(
//           telegramGroupId,
//           `Reminder: ${result[i].description}. Thank you`
//         );
//         bot.sendMessage(
//           adminId,
//           `I have sent reminder to do your ${month} CTL Quiz. Thank you.`
//         );
//       })
//     }
//   })
// });


bot.onText(/^(\/getcode)$/i, (msg) => {
  // console.log(msg);
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


