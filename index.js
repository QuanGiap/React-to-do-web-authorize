const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const taskRouter = require("./routers/TasksRouter");
const AccountRouter = require("./routers/AccountRouter");
const errorHelpers = require("./errorHelper/errorHelpers")
const jwt = require("jsonwebtoken")
require("dotenv").config();
const dbURI = process.env.dbURL;
const PORT = process.env.PORT || 5000;
let app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) =>
  app.listen(PORT, function () {
    console.log("Node is running on local host on" + PORT);
  })
)
function authenticationToken(req,res,next){
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]
  if(token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
      if(err) {
        console.log(err)
        return res.sendStatus(403)
      }
      req.user = user;
      next();
  })
}
app.use(authenticationToken);
app.use("/tasks",taskRouter);
app.use(errorHelpers.logError);
app.use(errorHelpers.clientErrorHandler);
app.use(errorHelpers.errorHandler);