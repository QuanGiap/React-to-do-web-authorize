const router = require("express").Router();
const bcrypt = require("bcrypt");
const AccountRepo = require("../repo/AccountRepo");

require("dotenv").config();

// //this router start with "http://localhost:5000/account"
// router.get("/",function (req, res, next){
//     console.log(req.user) 
//     res.json({result: req.user.name})
// })

// router.post("/check",function (req, res, next){
//     console.log(req.user) 
//     res.json({result: req.user.name})
// })
module.exports=router;