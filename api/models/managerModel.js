const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
    nom_manager:{
        type:String,
        required:true
    },
    prenom_manager:{
        type:String,
        required:true
    },
    email_manager:{
        type:String,
        required:true
    },
    password_manager:{
        type:String,
        required:true
    },
});
module.exports = mongoose.model('manager',managerSchema);