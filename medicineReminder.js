
const accountSid = "ACef0850b19f866be90c01e5c0844b901d";
const authToken = "a6dac5b078fedd15ac934b84a5b74a7e";
const smsclient = require("twilio")(accountSid, authToken);

const { response } = require("express");
const { client } = require("./connection");
const axios = require("axios");
const getJSON = require("get-json");

var days = ["Sun", "Mon", "Tue", "Wed", "Thus", "Fri", "Sat"];
const sendMessage = () => {
  console.log("Hello");
  var dt = new Date();
  var dayName = days[dt.getDay()];
  console.log(dayName, dt.getHours(), dt.getMinutes());
  const findmedicine =
    "select patientmedicine_id,medicine_id from patientmedicine";
  let medicinenames = [];
  // console.log(insertUser);
  client.query(findmedicine, [], (err, response) => {
    if (!err) {
      if (response.rowCount == 0) {
        console.log("no data for schedule in db");
      } else {
        console.log(response.rows);
        let patientmedicine_id = response.rows;
        let lastrecord = patientmedicine_id.length - 1;
        for (let i = 0; i < response.rows.length; ++i) {
            const findmedicinescheduledetails = `select patient.uname ,patient.mobilenumber,medicine.medicinename, patientmedicine_timephase.quantity,patientmedicine_timephase.remindertime,timephase.timephase,days.day_name 
            from patientmedicine as patientmedicine 
            inner join patientmedicine_timephase as patientmedicine_timephase on patientmedicine.patientmedicine_id =  patientmedicine_timephase.patientmedicine_id 
            inner join timephase as timephase  on timephase.timephase_id  = patientmedicine_timephase.timephase_id 
            inner join patientmedicine_days  as patientmedicine_days on patientmedicine_days.patientmedicine_id  = patientmedicine.patientmedicine_id  
            inner join days as days on days.day_id  = patientmedicine_days.day_id 
            inner join patient as patient on patient.patient_id = patientmedicine.patient_id 
            inner join medicine as medicine on medicine.medicine_id=patientmedicine.medicine_id 
            where patientmedicine_timephase.remindertime = $1 and days.day_name = $2 ;`;
            
            client.query(
              findmedicinescheduledetails,
              [dt.getHours(),days[dt.getDay()] ],
              (err, response) => {
                if (!err) {
                  console.log(response);
                  console.log(dt.getHours(),days[dt.getDay()]);
                  for (let item of response.rows) {
                    if (dt.getMinutes()) {
                      smsclient.messages
                        .create({
                          body: `Your medicine ${item["medicinename"]} is schedules at ${item["remindertime"]} kindly take it!`,
                          messagingServiceSid:
                            "MG2c90908bcf4394d1c2f189354ae1569c",
                          to: `+91${item['mobilenumber']}`,
                        })
                        .then((message) => console.log(message.sid))
                    }
                  }
                } else {
                  console.log("cound not fetch data");
                }
                client.end;
              }
            );
        }
      }
    } else {
    
      console.log("cound not fetch data");
    }
    client.end;
  });
};
module.exports = {
  sendMessage,
};
