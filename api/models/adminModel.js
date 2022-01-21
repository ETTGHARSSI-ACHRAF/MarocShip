const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    nom_admin:{
        type:String,
        required:true
    },
    prenom_admin:{
        type:String,
        required:true
    },
    email_admin:{
        type:String,
        required:true
    },
    password_admin:{
        type:String,
        required:true
    },
});
module.exports = mongoose.model('admin',adminSchema);