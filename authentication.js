const { response } = require('express')
const { client } = require('./connection')
const axios = require('axios')
const getJSON = require('get-json')
const jwt=require('jsonwebtoken')
const secretkey="omsiddhapura"
const dotenv = require('dotenv');
dotenv.config();

console.log(client);

const createUser = (req, res) => {
    const user= req.body
    console.log(user);

    const { uname, upassword, firstname, email } = req.body
    const insertUser = 'insert into patient (uname,upassword,firstname,email) values ( $1, $2, $3, $4)';
    console.log(insertUser);
    client.query(insertUser, [uname, upassword, firstname, email], (err, response) => {
        if (!err) {
            console.log("data inserted successfully");
            res.setHeader('content-type', 'application/json');
            return res.status(200).json({ msg: "Success" });
        }
        else {
            console.log(err);
            return res.status(400).json({ msg: "failure" })
        }
        client.end;
    })
}




const loginUser = (req, res) => {
    const { uname, upassword } = req.query
    console.log(uname,upassword);
    const checkcrendtials = 'select * from patient where uname = $1 and upassword = $2';
    client.query(checkcrendtials, [uname, upassword], (err, response) => {
        if (!err) {
            // console.log('data is there...');
            // response.status(201).send()
            
            if (response.rowCount == 1) {
                // console.log("user found!!");
                // return response.status(201).send()    
                console.log(response.rows[0].uname);
                const user = {
                    username: response.rows[0].uname,
                    email: response.rows[0].upassword
                  };
                
                  jwt.sign({ user: user }, secretkey, (err, token) => {
                    console.log(token);
                    res.json({
                
                      token:token,
                      userid:response.rows[0].patient_id,
                      message:"success"
                    });
                
                  });
                // const token = jwt.sign(, secretkey);
              
                // res.send(token);
                // res.setHeader('content-type', 'application/json');
                // return res.status(200).json({message:'success'});
            }
            else{
                // res.setHeader('content-type', 'application/json');
                // return res.status(200).json({ message:'invalidecredentials'});
                res.send({message:'invalidecredentials'})
            }
        }
        else {
            console.log(err.message);
            res.send({message:'error'})
            // res.setHeader('content-type', 'application/json');
            // return res.status(200).json({message:'error'});
        }
        client.end;
    })
}




module.exports = {
    createUser,
    loginUser
}