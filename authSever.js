const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const AccountRouter = require("./routers/AccountRouter");
const AccountRepo = require("./repo/AccountRepo");
const errorHelpers = require("./errorHelper/errorHelpers");
const jwt = require("jsonwebtoken");
let app = express();
let router = express.Router();
const PORT = process.env.PORT || 7789;

const EXPIREDTIME="30m";

require("dotenv").config();
const dbURI = process.env.dbURL;
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let refreshTokens = [];

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
    app.listen(PORT, function () {
      console.log("Node is running on local host on "+PORT);
    })
  );
//create new token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: EXPIREDTIME });
}

//return object contain token and refresh token
function createSignAccount(dataId){
    const user = { dataId: dataId };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    setTimeout(()=>{refreshTokens = refreshTokens.filter((token) => token !== req.body.token)},36000000);
    return{ accessToken: accessToken, refreshToken: refreshToken };
}
router.delete("/logout", async (req, res) => {
  console.log(req.body.token);
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

router.post("/token", async (req, res) => {
  const refreshToken = req.body.token;
  //check if exist
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.json({result:false});
    }
    const accessToken = generateAccessToken({ dataId: user.dataId });
    res.json({ accessToken: accessToken,result:true });
  });
});
router.post("/login", async function (req, res, next) {
  if (!req.body.name || !req.body.pass) return res.sendStatus(404);
  //Authentication
  const username = req.body.name;
  const pass = req.body.pass;
  //checkpass
  AccountRepo.checkAccount(
    username,
    pass,
    (dataId) => {
      if(dataId)res.json(createSignAccount(dataId));
      else res.json({result:"Account's pass not correct or not found"})
    },
    (err) => next(err)
  );
});

router.post("/signUp", async function (req, res, next) {
  if (!req.body.name || !req.body.pass) return res.sendStatus(404);
  AccountRepo.insertNewAccount(
    req.body.name,
    req.body.pass,
    (data) => {
        console.log(data);
        res.json(createSignAccount(data.dataId));
    },
    (err) => next(err)
  );
});

app.use("/account", router);
app.use(errorHelpers.logError);
app.use(errorHelpers.clientErrorHandler);
app.use(errorHelpers.errorHandler);
