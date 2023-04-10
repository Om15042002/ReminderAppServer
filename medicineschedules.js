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
  //   console.log("hello");
  let medicineid = 0;
  const addmedicinequery =
    "insert into medicine (medicinename) select($1) where not exists ( select 1 from medicine where medicinename =  $2 ) returning medicine_id";
  client.query(
    addmedicinequery,
    [medicinename, medicinename],
    (err, response) => {
      if (!err) {
        // console.log(response);
        // console.log("hello");
        const getmedicinceid =
          "select medicine_id from medicine where medicinename=$1";
        client.query(getmedicinceid, [medicinename], (err, response) => {
          if (!err) {
            // console.log(response);
            medicineid = response.rows[0].medicine_id;
            // console.log(medicineid);
            const patientmedicine =
              "select * from patientmedicine where patient_id =  $1 and medicine_id=$2 ";
            client.query(
              patientmedicine,
              [userid, medicineid],
              (err, response) => {
                if (!err) {
                  if (response.rows.length == 1) {
                    console.log("record already exists");
                    res.send({
                      message: "Medicine schedule is already exists",
                      success: false,
                    });
                  } else {
                    // console.log(response);
                    const patientmedicine =
                      "insert into patientmedicine (patient_id , medicine_id) values($1,$2) returning patientmedicine_id";
                    client.query(
                      patientmedicine,
                      [userid, medicineid],
                      (err, response) => {
                        if (!err) {
                          // console.log(response);
                          let patientmedicine_id =
                            response.rows[0].patientmedicine_id;
                          for (let i = 0; i < quantity.length; ++i) {
                            let timephase_id = 0;
                            if (timephase[i] == "morning") timephase_id = 1;
                            else if (timephase[i] == "afternoon")
                              timephase_id = 2;
                            else if (timephase[i] == "night") timephase_id = 3;
                            // console.log(timephase_id);
                            const patientmedicine_timephase =
                              "insert into patientmedicine_timephase (quantity,remindertime,patientmedicine_id , timephase_id) values($1,$2,$3,$4)";
                            client.query(
                              patientmedicine_timephase,
                              [
                                quantity[i],
                                remindertime[i],
                                response.rows[0].patientmedicine_id,
                                timephase_id,
                              ],
                              (err, response) => {
                                if (!err) {
                                  console.log("hello");
                                  console.log(patientmedicine_id);
                                } else {
                                  // res.send({
                                  //   message: "Could not add schedule",
                                  //   success: false,
                                  // });
                                }
                              }
                            );
                          }
                          const patientmedicine_days =
                            "insert into patientmedicine_days (patientmedicine_id,day_id) values($1,$2)";
                          for (let j = 0; j < days.length; ++j) {
                            let days_id = 0;
                            if (days[j] == "Mon") days_id = 1;
                            else if (days[j] == "Tue") days_id = 2;
                            else if (days[j] == "Wed") days_id = 3;
                            else if (days[j] == "Thus") days_id = 4;
                            else if (days[j] == "Fri") days_id = 5;
                            else if (days[j] == "Sat") days_id = 6;
                            else if (days[j] == "Sun") days_id = 7;
                            client.query(
                              patientmedicine_days,
                              [patientmedicine_id, days_id],
                              (err, response) => {
                                if (!err) {
                                  console.log(response);
                                  if (j == days.length - 1) {
                                    res.send({
                                      message:
                                        "Medicine Scheduled Successfully",
                                      success: true,
                                    });
                                  }
                                } else {
                                  res.send({
                                    message: "Could not add schedule",
                                    success: false,
                                  });
                                }
                              }
                            );
                          }
                        } else {
                          res.send({
                            message: "Could not add schedule",
                            success: false,
                          });
                        }
                      }
                    );
                  }
                } else {
                  res.send({
                    message: "Could not add schedule",
                    success: false,
                  });
                }
              }
            );
          } else {
            res.send({ message: "Could not add schedule", success: false });
          }
        });
      } else {
        res.send({ message: "Could not add schedule", success: false });
      }
    }
  );
};

const getMedicineScheduleDetails = (req, res) => {
  const { userid } = req.query;
  console.log(userid);
  let data = {};
  let medicinenames = [];
  let medicinequantities = [];
  let medicinedays = [];
  let medicineData = [];
  let medicine_id = [];
  // res.send({data:"hello world",success:true});
  const findmedicine =
    "select patientmedicine_id,medicine_id from patientmedicine where patient_id = $1 ";
  // console.log(insertUser);
  client.query(findmedicine, [userid], (err, response) => {
    if (!err) {
      // console.log(response);
      // res.setHeader('content-type', 'application/json');
      let patientmedicine_id = response.rows;
      let lastrecord = patientmedicine_id.length - 1;
      for (let i = 0; i < response.rows.length; ++i) {
        const findmedicinename =
          "select medicinename from medicine where medicine_id = $1";
        medicine_id.push(response.rows[i].medicine_id);
        // console.log(insertUser);
        client.query(
          findmedicinename,
          [response.rows[i].medicine_id],
          (err, response) => {
            if (!err) {
              console.log(response);
              // console.log(medicinenames)
              // return res.status(200).json({ msg: "Success" });
              medicinenames.push(response.rows[0].medicinename);

              const findmedicinescheduledetails =
                "select patientmedicine_timephase.quantity,patientmedicine_timephase.remindertime,timephase.timephase from patientmedicine as patientmedicine inner join patientmedicine_timephase as patientmedicine_timephase on patientmedicine.patientmedicine_id =  patientmedicine_timephase.patientmedicine_id inner join timephase as timephase  on timephase.timephase_id  = patientmedicine_timephase.timephase_id where patientmedicine.patientmedicine_id = $1;";
              // console.log(insertUser);
              client.query(
                findmedicinescheduledetails,
                [patientmedicine_id[i].patientmedicine_id],
                (err, response) => {
                  if (!err) {
                    console.log(response);
                    let temp = {
                      quantity: [],
                      remindertime: [],
                      timephase: [],
                    };
                    for (let i = 0; i < response.rows.length; ++i) {
                      temp["quantity"].push(response.rows[i].quantity);
                      temp["remindertime"].push(response.rows[i].remindertime);
                      temp["timephase"].push(response.rows[i].timephase);
                    }
                    medicineData.push(temp);
                    console.log(medicineData);
                    const finddays =
                      "select days.day_name from patientmedicine as patientmedicine inner join patientmedicine_days as patientmedicine_days on patientmedicine.patientmedicine_id =  patientmedicine_days.patientmedicine_id inner join days as days  on days.day_id  = patientmedicine_days.day_id where patientmedicine.patientmedicine_id=$1";
                    //             // console.log(insertUser);
                    client.query(
                      finddays,
                      [patientmedicine_id[i].patientmedicine_id],
                      (err, response) => {
                        if (!err) {
                          // console.log(response.rows);
                          let tempmedicinedays = {
                            day_name: [],
                          };
                          for (let i = 0; i < response.rows.length; ++i) {
                            tempmedicinedays["day_name"].push(
                              response.rows[i].day_name
                            );
                          }

                          medicinedays.push(tempmedicinedays);
                          // console.log(medicinedays);
                          data["days"] = medicinedays;
                          data["medicine_id"] = medicine_id;
                          (data["medicinenames"] = medicinenames),
                            (data["otherdetails"] = medicineData);
                          if (i == lastrecord)
                            res.send({ data: data, success: true });
                          // tempmedicinedays={
                          //   "day_name":[]
                          // }
                        } else {
                          // console.log(err);
                          // return res.status(400).json({ msg: "failure" })
                          res.send({
                            message: "Could not fetch data",
                            success: true,
                          });
                        }
                        client.end;
                      }
                    );
                    //         }
                    //         console.log(medicinedays);
                    //         // return res.status(200).json({ msg: "Success" });
                    //     }
                    //     else {
                    //         // console.log(err);
                    //         // return res.status(400).json({ msg: "failure" })
                    //     }
                    //     client.end;
                    // })
                  } else {
                    // console.log(err);
                    // return res.status(400).json({ msg: "failure" })
                    res.send({
                      message: "Could not fetch data",
                      success: true,
                    });
                  }
                  client.end;
                }
              );
            } else {
              // reject(-1);
              // console.log(err);
              // return res.status(400).json({ msg: "failure" })
              res.send({ message: "Could not fetch data", success: true });
            }
            client.end;
          }
        );
      }
    } else {
      // console.log(err);
      // return res.status(400).json({ msg: "failure" })
      res.send({ message: "Could not fetch data", success: true });
    }
    client.end;
  });
};

const deleteMedicineScheduleDetails = (req, res) => {
  const { userid, medicine_id } = req.query;
  // console.log(req.query);
  const findpatientmedicine =
    "select patientmedicine_id from patientmedicine where patient_id=$1 and medicine_id=$2 ";
  client.query(findpatientmedicine, [userid, medicine_id], (err, response) => {
    if (!err) {
      console.log(response.rows);
      let patientmedicine_id=response.rows[0].patientmedicine_id;
      const deletefrompatientmedicine_days =
        "delete from patientmedicine_days where patientmedicine_id=$1";
      client.query(
        deletefrompatientmedicine_days,
        [patientmedicine_id],
        (err, response) => {
          if (!err) {
            console.log(response.rows);
            const deletefrompatientmedicine_timephase =
              "delete from patientmedicine_timephase where patientmedicine_id=$1";
            client.query(
              deletefrompatientmedicine_timephase,
              [patientmedicine_id],
              (err, response) => {
                if (!err) {
                  console.log(response.rows);
                  const deletefrompatientmedicine =
                    "delete from patientmedicine where patientmedicine_id=$1";
                  client.query(
                    deletefrompatientmedicine,
                    [patientmedicine_id],
                    (err, response) => {
                      if (!err) {
                        console.log(response.rows);
                        res.send({
                          message: "Data Deleted Successfully",
                          success: true,
                        });
                      } else {
                        res.send({
                          message: "Could Not Delete Data",
                          success: false,
                        });
                      }
                      client.end;
                    }
                  );
                } else {
                  res.send({
                    message: "Could Not Delete Data",
                    success: false,
                  });
                }
                client.end;
              }
            );
          } else {
            res.send({ message: "Could Not Delete Data", success: false });
          }
          client.end;
        }
      );
    } else {
      res.send({ message: "Could Not Delete Data", success: false });
    }
    client.end;
  });
};

module.exports = {
  addMedicineScheduleDetails,
  getMedicineScheduleDetails,
  deleteMedicineScheduleDetails,
};
