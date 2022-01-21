const mongoose = require('mongoose');

const responsableLivraisonSchema = new mongoose.Schema({
    nom_responsable_livraison:{
        type:String,
        required:true
    },
    prenom_responsable_livraison:{
        type:String,
        required:true
    },
    email_responsable_livraison:{
        type:String,
        required:true
    },
    password_responsable_livraison:{
        type:String,
        required:true
    },
});
module.exports = mongoose.model('responsable_livraison',responsableLivraisonSchema);