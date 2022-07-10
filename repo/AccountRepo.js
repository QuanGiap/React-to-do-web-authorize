const Accounts = require("../Schema/Account");
const bcrypt = require("bcrypt");
const TaskRepo = require("./TasksRepo");
require("dotenv").config();
const AccountRepo = {
  //return the object contain IdData in mongodb, if null mean account not valid
  checkAccount: function (name,checkPass, resolve, reject) {
    Accounts.findOne({ account: name }, { pass: 1, dataId: 1 })
      .then((data) => {
        if (data){
          bcrypt.compare(checkPass,data.pass,(err,result)=>{
            if(err) return reject(err);
            if(result) resolve(data.dataId);
            else resolve(null);
          })
          return;
        }
        resolve(null);
      })
      .catch((err) => reject(err));
  },
  //return the document just inserted
  insertNewAccount: async function (name, pass, resolve, rejectNext) {
    TaskRepo.insertNewTasks((id) => {
      bcrypt.hash(pass, parseInt(process.env.hassNum)).then(newPass=>{
         const account = new Accounts({
        account: name,
        pass: newPass,
        dataId: id,
      });
      account
        .save()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
      });
    },(err)=>rejectNext(err));
  },
};

module.exports = AccountRepo;
