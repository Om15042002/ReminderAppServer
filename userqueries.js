const { response } = require("express");
const { client } = require("./connection");
const axios = require("axios");

const addquery = (req, res) => {
  //   console.log(req.body);
  const { uname, email, description, dateadded } = req.body;
  const addquery =
    "insert into userqueries (uname,email,description,dateadded) values ($1,$2,$3,$4)";
  client.query(
    addquery,
    [uname, email, description, dateadded],
    (err, response) => {
      if (!err) {
        res.send({ message: "Query sent successfully", success: true });
      } else {
        res.send({ message: "Could Not send query", success: false });
      }
      client.end;
    }
  );
};

module.exports = {
  addquery,
};
