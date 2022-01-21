const mongoose = require("mongoose");

const vehiculeSchema = new mongoose.Schema({
  type_vehicule: {
    type: String,
    required: true,
  },
  nom_vehicule: {
    type: String,
    required: true,
  },
  matricule: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("vehicule", vehiculeSchema);
