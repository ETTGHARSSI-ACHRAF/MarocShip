const mongoose = require('mongoose');

const livraisonSchema = new mongoose.Schema({
    ville_d:{
        type:String,
        required:true
    },
    ville_a:{
        type:String,
        required:true
    },
    poid:{
        type:Number,
        required:true
    },
    km:{
        type:Number,
        required:true,
    },
    statu:{
        type:String,
        required:true,
        default:'en cour'
    },
    prix:{
        type:Number,
        required:true
    },
    zone:{
        type:String,
        required:true
    },
    id_admin_livraison:{
        type:mongoose.Schema.ObjectId, 
        ref: 'responsable_livraison'
    },
    date:{
        type: Date,
        default: Date.now,
      }    
});
module.exports = mongoose.model('livraison',livraisonSchema);