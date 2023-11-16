import TelegramBot from "node-telegram-bot-api";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Singapore");
import schedule from "node-schedule-tz";
import dotenv from "dotenv";
dotenv.config();
import { spawn } from "child_process";
import Controller from './database/controller.js';
import sleep from 'sleep-promise';

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const adminId = process.env.ADMINID;
const telegramGroupId = process.env.TELEGRAMGROUPID

const init = async () => {
  bot.sendMessage(adminId, "Reminders checked and updated.");
  await Controller.cleanReminders()
  return await Controller.findAll().then((result) => {
    // console.log(result)
    for (let i = 0; i < result.length; i++) {
      let month = moment().format("MMMM")
      // console.log("1 " + result[i].remindertime[2]+result[i].remindertime[3]+ " " + result[i].remindertime[0]+result[i].remindertime[1] + " " + result[i].reminderdate + " * *")
      schedule.scheduleJob("1 " + result[i].remindertime[2] + result[i].remindertime[3] + " " + result[i].remindertime[0] + result[i].remindertime[1] + " " + result[i].reminderdate + " * *", async () => {

        bot.sendMessage(
          result[i].sendTo,
          // result[i].description,
          // `Reminder: ${result[i].description}. Thank you`,
          result[i].description,
          // `Please do your ${month} CTL\n <b><i>Update the Sharepoint with your result</i></b>. Thank you`,
          {
            parse_mode: "HTML",
          }
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
        let month = moment().format("MMMM")
        bot.sendMessage(
          result[i].sendTo,
          // result[i].description,
          // `Reminder: ${result[i].description}. Thank you`,
          // `<u>Please do your ${month} CTL.</u>\n<b><i>Update the Sharepoint with your result</i></b>.\nThank you.`,
          result[i].description,
          {
            parse_mode: "HTML",
          }
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

bot.onText(/(\/registeradmin)/i, async (msg) => {
  let obj = {
    teleid: 0,
    telename: ""
  }
  let adminList = []
  const res = await Controller.findAllAdmin()
  res.forEach(admin => {
    adminList.push(admin.teleid)
  })
  if (adminList.includes(msg.from.id)) {
    if (msg.reply_to_message === undefined) {
      bot.sendMessage(msg.chat.id, "Please reply to a msg of the person you want to register as an admin.")
    } else {
      obj.teleid = msg.reply_to_message.from.id
      obj.telename = msg.reply_to_message.from.first_name
      const addAdminRes = await Controller.addAdmin(obj)
      if (addAdminRes) {
        bot.sendMessage(msg.chat.id, "Admin added. Server msg: " + JSON.stringify(addAdminRes))
      } else {
        bot.sendMessage(msg.chat.id, "Admin already exists. Server err msg: " + JSON.stringify(addAdminRes))
      }
    }
  } else {
    bot.sendMessage(msg.chat.id, "You are not authorized to add admin.");
  }
})

bot.onText(/(\/listadmin)/i, async (msg) => {
  await Controller.findAllAdmin().then((res) => {
    try {
      console.log(res)
      bot.sendMessage(msg.chat.id, JSON.stringify(res))
    } catch (err) {
      bot.sendMessage(msg.chat.id, "err")
    }
  })
})


bot.onText(/(\@remind)/i, async (msg) => {
  try {
    console.log(msg)
    let obj = {
      uuid: msg.from.id,
      msgId: msg.message_id,
      remindMsgId: msg.reply_to_message.message_id,
      chatId: msg.chat.id,
      addedon: msg.date,
      type: "V2"
    }

    return await Controller.addReminder(obj).then(async (result) => {
      let savedMsg = null;
      bot.sendMessage(obj.chatId, "Noted. Reminders will be sent every weekday at 0730H and 1700H. Deleting in ...", {
        reply_to_message_id: obj.remindMsgId
      }).then(async (prevMsg) => {
        savedMsg = prevMsg
        console.log(prevMsg)
        for (let i = 15; i != 0; i--) {
          // console.log(`Noted. Reminders will be sent everyday at 0730H and 1700H. Deleting in ${i}`)
          await sleep(1000);

          const opts = {
            chat_id: obj.chatId,
            message_id: prevMsg.message_id
          }
          await bot.editMessageText(`Noted. Reminders will be sent every weekday at 0730H and 1700H. Deleting in ${i}`, opts)
          if (i == 1) {
            await bot.deleteMessage(obj.chatId, prevMsg.message_id)
          }
        }
      })

      console.log(result)
    })
  } catch (err) {
    console.log(err)
  }

})

// bot.onText(/(\@showremind)/i, async (msg) => {
//   try {
//     return await Controller.findAllRemindersTwo().then(async (result)=>{
//       let returnMsg = ""
//       for(let i = 0; i < result.length; i++){
//         returnMsg += 
//       }
//     })
//   } catch (err) {
//     console.log(err)
//   }
// })

bot.onText(/(\@delete)/i, async (msg) => {
  try {
    console.log(msg.text.split(" ")[1])
    let obj = {
      type: "V2",
      msgId: msg.text.split(" ")[1]
    }
    return await Controller.findByMsgId(obj.msgId).then(async (result) => {
      console.log(msg.from.id)
      if (result.uuid == msg.from.id || msg.from.id == "151894779") {
        return await Controller.delReminder(obj).then(async (result) => {

          console.log(result)
          if (result == 1) {
            bot.sendMessage(msg.chat.id, "@Delete success.")
          } else {
            bot.sendMessage(msg.chat.id, "@Delete failed. Please check syntax. It must be @delete [givenId]")
          }
        })
      } else {
        bot.sendMessage(msg.chat.id, "@Delete failed. You are not the owner of this reminder. Only the owner of this @remind can delete this.")
      }
    })

  } catch (err) {
    console.log(err)
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
    description: "",
    sendTo: ""
  }
  console.log(msg)

  try {
    // Split the input text by spaces
    const text = msg.text
    // Define a regular expression to match the required pattern
    const regex = /^\/add (\d{1,2}) (\d{4}) (.+)$/;
    // Use the `exec` method to extract the parts
    const match = regex.exec(text);
    const date = match[1];
    const time = match[2];
    const description = match[3];
    // Log the variables to the console

    console.log(`First Parameter: ${date}`);
    console.log(`Second Parameter: ${time}`);
    console.log(`Third Parameter: ${description}`);
    if (date == undefined || time == undefined || description == undefined) {
      bot.sendMessage(msg.chat.id, "Please check your syntax. It must be /add [date (1-28)] [time (0000-2359)] [description].\nExample: /add 1 0730H Do your CTL Quiz.")
    } else if (date > 28 || date < 1) {
      bot.sendMessage(msg.chat.id, "Please check your date. It must be between 1 to 28.")
    } else if (time > 2359 || time < 0) {
      bot.sendMessage(msg.chat.id, "Please check your time. It must be between 0000 to 2359.")
    } else {
      obj.sendTo = msg.chat.id
      obj.uuid = msg.from.id
      obj.reminderdate = date
      obj.remindertime = time
      obj.description = description
      obj.addedby = msg.from.last_name != undefined ? msg.from.first_name + " " + msg.from.last_name : msg.from.first_name
      obj.addedon = moment().format()
      return await Controller.addReminder(obj).then(async (result) => {
        // console.log("result" + result)
        bot.sendMessage(msg.chat.id, "Reminder added.");
        schedule.scheduleJob("1 " + obj.remindertime[2] + obj.remindertime[3] + " " + obj.remindertime[0] + obj.remindertime[1] + " " + obj.reminderdate + " * *")
        return await Controller.findAll().then((result) => {
          // console.log("result" + result)
          let returnMsg = "|  ID  |   Reminder Date   |   Added By   |    Added On   |   Desc   | sendTo |\n";
          for (let i = 0; i < result.length; i++) {
            returnMsg += `|   ${result[i].id}   |      ${result[i].reminderdate} - ${result[i].remindertime}      |   ${result[i].addedby}   |   ${moment(result[i].addedon).format("DDMMYY HH:mm")}   |   ${result[i].description}   |   ${result[i].sendTo}   |\n`;
          }
          bot.sendMessage(msg.chat.id, returnMsg)
        })
      })
    }
  } catch (e) {

    bot.sendMessage(msg.chat.id, "Please check your syntax. It must be /add [date (1-28)] [time (0000-2359)] [description].\nExample: /add 1 0730H Do your CTL Quiz. Error: " + e)
  }


  // if (true) {
  //   // if (msg.from.id == adminId) {
  //   bot.sendMessage(msg.chat.id, "Please send your date of reminder");
  //   bot.once("message", async (msg) => {
  //     if (parseInt(msg.text) && parseInt(msg.text) <= endOfMonth && parseInt(msg.text) > 0) {
  //       let inputdate = msg.text
  //       if (inputdate.length == 1) {
  //         inputdate = "0" + inputdate
  //       }
  //       obj.reminderdate = inputdate
  //       bot.sendMessage(msg.chat.id, "Please send your time of reminder");
  //       bot.once("message", async (msg) => {
  //         if (parseInt(msg.text) && parseInt(msg.text) <= 2359 && parseInt(msg.text) >= 0) {
  //           obj.remindertime = msg.text
  //           bot.sendMessage(msg.chat.id, "Please add your description");
  //           bot.once("message", async (msg) => {
  //             obj.description = msg.text
  //             obj.addedby = msg.from.last_name != undefined ? msg.from.first_name + " " + msg.from.last_name : msg.from.first_name
  //             obj.addedon = moment().format()
  //             obj.uuid = msg.from.id
  //             // console.log("obj" + JSON.stringify(obj))
  //             return await Controller.addReminder(obj).then(async (result) => {
  //               // console.log("result" + result)
  //               bot.sendMessage(msg.chat.id, "Reminder added.");
  //               schedule.scheduleJob("1 " + obj.remindertime[2] + obj.remindertime[3] + " " + obj.remindertime[0] + obj.remindertime[1] + " " + obj.reminderdate + " * *")
  //               return await Controller.findAll().then((result) => {
  //                 // console.log("result" + result)
  //                 let returnMsg = "|  ID  |   Reminder Date   |   Added By   |    Added On   |   Desc   |\n";
  //                 for (let i = 0; i < result.length; i++) {
  //                   returnMsg += `|   ${result[i].id}   |      ${result[i].reminderdate} - ${result[i].remindertime}      |   ${result[i].addedby}   |   ${moment(result[i].addedon).format("DDMMYY HH:mm")}   |   ${result[i].description}   |\n`;
  //                 }
  //                 bot.sendMessage(msg.chat.id, returnMsg)
  //               })
  //             })
  //           })
  //         }
  //       })
  //       // } 
  //       // else if (msg.from.id != adminId) {
  //       //   bot.sendMessage(msg.chat.id, "You are not authorized to add reminder.");
  //     } else if (parseInt(msg.text) >= endOfMonth || parseInt(msg.text) < 0) {
  //       bot.sendMessage(msg.chat.id, "Invalid Date. The end of this month is " + endOfMonth + ".\nPlease enter a valid date between 1 to " + endOfMonth + ".");
  //     } else {
  //       bot.sendMessage(msg.chat.id, "Invalid Date. The end of this month is " + endOfMonth + ".\nPlease enter a valid date between 1 to " + endOfMonth + ".");
  //     }
  //   })
  // }
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

bot.onText(/^(\/help)$/i, (msg) => {
  const commands = [
    "/getSchedule or /get - Show all reminders",
    "/resync - Refresh all reminders",
    "/seejobs or /see - Check all scheduled jobs",
    "/delReminder or /del <ID> - Delete a reminder by ID",
    "/registeradmin - Add admin user",
    "@remind - Reply to a message to request the bot to send reminders every day @ 0730H and 1700H"
  ];

  const helpMessage = commands.join("\n");

  bot.sendMessage(msg.chat.id, helpMessage);
});


const job = () => schedule.scheduleJob('30 07 * * 1-5', async () => {
  return await Controller.findAll("V2").then((result) => {
    // console.log(result)
    for (let i = 0; i < result.length; i++) {
      console.log(result[i])
      bot.sendMessage(result[i].chatId, "<b>This Reminder is sent every weekday @ 0730H and 1700H. To stop, type @delete " + result[i].msgId + "</b>", { reply_to_message_id: result[i].remindMsgId, parse_mode: 'HTML' })
    }
  })

})

const jobNight = () => schedule.scheduleJob('0 17 * * 1-5', async () => {
  return await Controller.findAll("V2").then((result) => {
    // console.log(result)
    for (let i = 0; i < result.length; i++) {
      console.log(result[i])
      bot.sendMessage(result[i].chatId, "<b>This Reminder is sent every weekday @ 0730H and 1700H. To stop, type @delete " + result[i].msgId + "</b>", { reply_to_message_id: result[i].remindMsgId, parse_mode: 'HTML' })
    }
  })
})

const ctlPoll = () => schedule.scheduleJob('30 7 1 * *', async () => {
  let month = moment().format("MMMM")
  let lastDay = moment().endOf('month').format("ddd, MMM DD")
  // let lastUnixTime = moment().endOf('month').unix()
  bot.sendPoll(151894779, `Please do your ${month} CTL.\nTo be completed by ${lastDay}`, ['Done', 'Not Done'], { 'is_anonymous': false, 'explanation_entities': "test" })
})

// const testJob = () => schedule.scheduleJob('*/1 * * * * *', async () => {
//   return await Controller.findAll("V2").then((result) => {
//     // console.log(result)
//     for (let i = 0; i < result.length; i++) {
//       console.log(result[i])
//       bot.sendMessage(result[i].chatId, "<pre>This Reminder is sent everyday @ 0730H and 1730H. To stop, type @delete " + result[i].msgId + "</pre>", { reply_to_message_id: result[i].remindMsgId, parse_mode: 'HTML' })
//     }
//   })

// })

// testJob()
job()
jobNight()
ctlPoll()

