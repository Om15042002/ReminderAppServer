const express = require("express");

const bodyparser = require("body-parser");
var cors = require("cors");
const user = require("./authentication");
const medicineschedule= require("./medicineschedules");
// const task = require("./taskqueries");
const cron = require("node-cron");
const fs = require("fs");

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
app.delete("/deletemedicineschedule", medicineschedule.deleteMedicineScheduleDetails);
// app.get("/gettask", task.getTasks);
// app.post("/addtask", task.createTask);
// app.delete("/deletetask", task.deleteTask);
// app.post("/edittask", task.editTask);

app.listen(3000, () => {
  console.log("listening to the port 3000...");
});

// cron.schedule("* * * * *", function () {
//   console.log("---------------------");
//   console.log("Running Cron Job");
// });

