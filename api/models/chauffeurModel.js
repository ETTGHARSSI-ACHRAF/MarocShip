const mongoose = require('mongoose');

const chauffeurSchema = new mongoose.Schema({
    nom_chauffeur:{
        type:String,
        required:true
    },
    prenom_chauffeur:{
        type:String,
        required:true
    },
    email_chauffeur:{
        type:String,
        required:true
    },
    password_chauffeur:{
        type:String,
        required:true
    },
    id_vehicule:{
        type:mongoose.Schema.ObjectId, 
        ref: 'vehicule'
    },
    livraisons: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "livraison",
        },
      ],
});
module.exports = mongoose.model('chauffeur',chauffeurSchema);