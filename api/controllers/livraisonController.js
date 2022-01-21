const Livraison = require("../models/livraisonModel");
const Chauffeur = require("../models/chauffeurModel");
const nodemailer = require("nodemailer");
const jsonwebtoken =require('jsonwebtoken');
const { default: axios } = require("axios");


  //ajouter livraison
 const addLivraison = async (req, result) => {
    try {
      const token = jsonwebtoken.decode(req.cookies.token);
      axios
        .get(
          `https://www.distance24.org/route.json?stops=${req.body.ville_d}|${req.body.ville_a}`
        )
        .then(async (res) => {
          var km = res.data.distance;
          var prix;
          var prixPayer;
          if (req.body.zone === "Maroc") {
            prix = 40;
            if (req.body.poid > 3) {
              prixPayer = 3 * prix + (req.body.poid - 3) * 5;
            } else {
              prixPayer = req.body.poid * prix;
            }
          } else if (req.body.zone === "Europe") {
            prix = 160;
            prixPayer = req.body.poid * prix;
          } else if (req.body.zone === "Amerique") {
            prix = 220;
            prixPayer = req.body.poid * prix;
          } else if (req.body.zone === "Asie") {
            prix = 240;
            prixPayer = req.body.poid * prix;
          } else if (req.body.zone === "Australie") {
            prix = 260;
            prixPayer = req.body.poid * prix;
          }
          //   console.log(prixPayer);
          const livraison = new Livraison({
            ville_d: req.body.ville_d,
            ville_a: req.body.ville_a,
            poid: req.body.poid,
            km: km,
            prix: prixPayer,
            zone: req.body.zone,
            id_admin_livraison: token.result._id,
          });
          const newLivraison = await livraison.save();

          // partie de emailing pour les chauffeur selon le poid de vehicule
          var type;
          if (req.body.zone === "Maroc") {
            if (req.body.poid > 800) {
              type = "grand camion";
            } else if (req.body.poid > 200) {
              type = "camion";
            } else {
              type = "voiture";
            }
          } else {
            type = "avion";
          }
          const chauffeur = await Chauffeur.find().populate("id_vehicule");
          // console.log(chauffeur);
          chauffeur.forEach((element) => {
            if (element.id_vehicule.type_vehicule === type) {
              // Step 1
              let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: process.env.EMAIL, // TODO: your gmail account
                  pass: process.env.PASSWORD, // TODO: your gmail password
                },
              });
              // Step 2
              let mailOptions = {
                from: process.env.EMAIL, // TODO: email sender
                to: element.email_chauffeur, // TODO: email receiver
                subject: "Nouvelle commande",
                text: `Bonjor ${element.prenom_chauffeur} ${element.nom_chauffeur} il'a une nouvelle commande entre ${req.body.ville_d} et ${req.body.ville_a}`,
              };

              // Step 3
              transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                  return log("Error occurs");
                }
              });
            }
          });
          // console.log(type);

          result.status(200).json({
            success: 1,
            newLivraison,
          });
        })

        .catch((err) => console.log(err));
    } catch (error) {
      res.status(500).json({
        success: 0,
        message: error.message,
      });
    }
  }
  // get all livraison selan le statu
 const getAllLivraisonByStatu = async(req,res)=>{
  try{
    const livraison = await Livraison.find({ statu: req.body.statu}).populate('id_admin_livraison');
      res.status(200).json({
        success: 1,
        livraison
      });
  }catch (error) {
    res.status(500).json({
      success: 0,
      message: error.message,
    });
  }
 }
  module.exports = {
    addLivraison,
    getAllLivraisonByStatu
  }

