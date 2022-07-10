const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    account:{
        type: String,
        required: true
    },
    pass:{
        type:String,
        required: true
    },
    dataId:{
        type:String,
        required: true
    }
},
    {timestamps: true}
)

const Account = mongoose.model('Accounts',AccountSchema);
module.exports = Account;