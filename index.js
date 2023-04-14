const express = require("express");
const bodyparser = require("body-parser");
var cors = require("cors");
const user = require("./authentication");
const medicineschedule = require("./medicineschedules");
const checkForSMS=require('./medicineReminder');
const userquery=require('./userqueries');
const cron = require("node-cron");
const fs = require("fs");
const accountSid = "ACef0850b19f866be90c01e5c0844b901d";
const authToken = "a6dac5b078fedd15ac934b84a5b74a7e";
const smsclient = require("twilio")(accountSid, authToken);


const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  console.log("app is running");
  res.json({
    msg: "this is a sample",
  });
});

app.post("/adduser", user.createUser);
app.get("/login", user.loginUser);

app.post("/addmedicine", medicineschedule.addMedicineScheduleDetails);
app.get("/getmedicineschedule", medicineschedule.getMedicineScheduleDetails);
app.delete(
  "/deletemedicineschedule",
  medicineschedule.deleteMedicineScheduleDetails
);

app.post("/addquery", userquery.addquery);




// app.get("/gettask", task.getTasks);
// app.post("/addtask", task.createTask);
// app.delete("/deletetask", task.deleteTask);
// app.post("/edittask", task.editTask);

app.listen(3000, () => {
  console.log("listening to the port 3000...");
});

// cron.schedule("* * * * *", async function () {
  
// // });
// smsclient.messages
//         .create({
//           body: `Dr. Pratham B, INR 4,347.54 spent on ICICI Bank Card XX8003..XX on 12 -Apr-23 For credit card operational penalty.. Avl Lmt: INR 43,487.36. To dispute ,call 180011/SMS BLOCK 8003 to 9723588432`,
//           messagingServiceSid:
//             "MG2c90908bcf4394d1c2f189354ae1569c",
//           to: `+919662300266`,
//         })
//         .then((message) => console.log(message.sid))
setInterval(() => {
  checkForSMS.sendMessage();
}, 10000);

