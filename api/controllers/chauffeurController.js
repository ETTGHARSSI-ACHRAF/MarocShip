const Chauffeur = require("../models/chauffeurModel");
const Livraison = require("../models/livraisonModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const jsonwebtoken =require('jsonwebtoken');
const logger = require('../logger/logger');




  // get All chauffeur
 const getAllChauffeur = async (req, res) => {
    try {
      const { page = 1, limit = 4 } = req.query;
      const countChauffeur = await Chauffeur.find().count();
      const chauffeur = await Chauffeur.find().populate('id_vehicule')
        .limit(limit * 1)
        .skip((page - 1) * limit);
      res.status(200).json({
        success: 1,
        totale: countChauffeur,
        chauffeur,
      });
    } catch (error) {
      res.status(500).json({
        success: 0,
        message: error.message,
      });
    }
  }
  // get chauffeur By id
 const getChauffeurById = async (req, res) => {
    try {
      const chauffeur = await Chauffeur.find({ _id: req.params.id }).populate('id_vehicule');
      res.status(200).json({
        success: 1,
        chauffeur,
      });
    } catch (error) {
      res.status(500).json({
        success: 0,
        message: error.message,
      });
    }
  }
  // add chauffeur
 const addChauffeur = async (req, res) => {
    const password = generator.generate({
      length: 10,
      numbers: true,
    });
    const chauffeur = new Chauffeur({
      nom_chauffeur: req.body.nom_chauffeur,
      prenom_chauffeur: req.body.prenom_chauffeur,
      email_chauffeur: req.body.email_chauffeur,
      password_chauffeur: bcrypt.hashSync(password, 10),
      id_vehicule:req.body.id_vehicule
    });
    try {
      const newChauffeur = await chauffeur.save();
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
        to: req.body.email_chauffeur, // TODO: email receiver
        subject: "votre compte sur la platforme MarocShip",
        text: `Bonjor ${req.body.prenom_chauffeur} ${req.body.nom_chauffeur} votre mot de passe pour connecter sur la platforme MarocShip : ${password}`,
      };

      // Step 3
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          return log("Error occurs");
        }
        res.status(200).json({
          success: 1,
          newChauffeur,
        });
      });
    } catch (error) {
      res.status(400).json({
        success: 0,
        message: error.message,
      });
    }
  }
  // update chauffeur
 const updateChauffeur = async (req, res) => {
    console.log(req.params.id);
    const newDAtaChauffeur = {
        nom_chauffeur: req.body.nom_chauffeur,
        prenom_chauffeur: req.body.prenom_chauffeur,
        email_chauffeur: req.body.email_chauffeur,
        id_vehicule:req.body.id_vehicule
    };
    try {
      const chauffeur = await Chauffeur.updateOne(
        { _id: req.params.id },
        newDAtaChauffeur
      );
      res.status(200).json({
        success: 1,
        chauffeur,
      });
    } catch (error) {
      res.status(400).json({
        success: 0,
        message: error.message,
      });
    }
  }

  // delete chauffeur
 const deleteChauffeur = async (req, res) => {
    try {
      // const chauffeur = await Chauffeur.deleteOne({ _id: req.params.id });
       const chauffeur = await Chauffeur.remove({ _id: req.params.id });
      res.status(200).json({
        success: 1,
        chauffeur,
      });
    } catch (error) {
      res.status(400).json({
        success: 0,
        message: error.message,
      });
    }
  }
  // autantification chauffeur
 const loginChauffeur = async (req,res)=>{
    try{
        const chauffeur = await Chauffeur.find({email_chauffeur:req.body.email_chauffeur});
        if(chauffeur.length !==0){
            const comparePassword = bcrypt.compareSync(req.body.password_chauffeur,chauffeur[0].password_chauffeur) 
            if(comparePassword){
              chauffeur[0].password_chauffeur=undefined;
                const jsontoken = jsonwebtoken.sign({result:chauffeur[0]},process.env.SECRET_KEY_CHAUFFEUR,{
                    expiresIn:"1h"
                });
                res.cookie('token',jsontoken, { httpOnly: true });
                res.cookie('role','chauffeur', { httpOnly: true });
                res.status(200).json({
                    success : 1,
                    token:jsontoken,   
                })
            }else{
                res.status(401).json({
                    success : 0,
                    message:'passwor or email incorrect'
                })
            }
        }else{
            res.status(401).json({
                success : 0,
                message:'passwor or email incorrect'
            })
        }

    }catch(error){
        res.status(500).json({
            success : 0,
            message:error.message
        })
    }
}
const prandreCommande = async(req,res)=>{
  try{
    const token = jsonwebtoken.decode(req.cookies.token);
    const chauffeur = await Chauffeur.updateOne(
      { _id:token.result._id },
      {$push:{livraisons:req.body.id_livaraison}}
    );
    const livraison = await Livraison.updateOne({_id:req.body.id_livaraison},{statu:'non livrer'})
    const getLivraison = await Livraison.find({_id:req.body.id_livaraison})
    console.log(getLivraison);
    logger.info(`une livraison de ${getLivraison[0].poid}kg va être faite le ${new Date().toISOString().slice(0, 10)} de la ville de ${getLivraison[0].ville_d} vers la ville ${getLivraison[0].ville_a}: Chauffeur ${token.result.nom_chauffeur} ${token.result.prenom_chauffeur}`)
    res.status(200).json({
      success: 1,
      chauffeur,
    });

  }catch(error){
    res.status(500).json({
        success : 0,
        message:error.message
    })
}
}
const logoutChauffeur = (req,res)=>{
  try{
      res.cookie("token","",{
          httpOnly:true,
          expires : new Date(0)
          }).send();
          
  }catch (error) {
      res.status(500).json({
          success: 0,
          message: error.message,
      });
  }
  
}

module.exports = {
  getAllChauffeur,
  getChauffeurById,
  addChauffeur,
  updateChauffeur,
  deleteChauffeur,
  loginChauffeur,
  prandreCommande,
  logoutChauffeur
}