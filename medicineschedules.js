const { response } = require("express");
const { client } = require("./connection");
const axios = require("axios");
const getJSON = require("get-json");
const jwt = require("jsonwebtoken");
const secretkey = "omsiddhapura";
const dotenv = require("dotenv");

const addMedicineScheduleDetails = (req, res) => {
  const { medicinename, remindertime, timephase, quantity, days, userid } =
    req.body;
    // console.log("hello");
    console.log("hello");
  let medicineid = 0;
  const addmedicinequery =
    "insert into medicine (medicinename) select($1) where not exists ( select 1 from medicine where medicinename =  $2 ) returning medicine_id";
  client.query(addmedicinequery, [medicinename,medicinename], (err, response) => {
    if (!err) {
        console.log(response);
        console.log("hello");
    }
  });
};

module.exports = {
  addMedicineScheduleDetails,
};
