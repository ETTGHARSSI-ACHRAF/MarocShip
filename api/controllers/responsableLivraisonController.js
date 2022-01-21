const ResponsableLivraison = require('../models/responsableLivraisonModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const generator = require('generate-password');
const jsonwebtoken = require('jsonwebtoken');


//  add responsableLivraison
const addResponsableLivraison = async (req, res) => {
  const password = generator.generate({
    length: 10,
    numbers: true
  });
  const responsableLivraison = new ResponsableLivraison({
    nom_responsable_livraison: req.body.nom_responsable_livraison,
    prenom_responsable_livraison: req.body.prenom_responsable_livraison,
    email_responsable_livraison: req.body.email_responsable_livraison,
    password_responsable_livraison: bcrypt.hashSync(password, 10)
  });
  try {
    const newesponsableLivraison = await responsableLivraison.save();
    // Step 1
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL, // TODO: your gmail account
        pass: process.env.PASSWORD // TODO: your gmail password
      }
    });
    // Step 2
    let mailOptions = {
      from: process.env.EMAIL, // TODO: email sender
      to: req.body.email_responsable_livraison, // TODO: email receiver
      subject: 'votre compte sur la platforme MarocShip',
      text: `Bonjour ${req.body.prenom_responsable_livraison} ${req.body.nom_responsable_livraison} votre mot de passe pour connecter sur la platforme MarocShip : ${password}`,
    };

    // Step 3
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        return log('Error occurs');
      }
      res.status(200).json({
        success: 1,
        newesponsableLivraison
      });
    });

  } catch (error) {
    res.status(400).json({
      success: 0,
      message: error.message
    })
  }
}
//  update responsableLivraison
const updateResponsableLivraison = async (req, res) => {
  const newDAtaResponsableLivraison = {
    nom_responsable_livraison: req.body.nom_responsable_livraison,
    prenom_responsable_livraison: req.body.prenom_responsable_livraison,
    email_responsable_livraison: req.body.email_responsable_livraison,
  };
  try {
    const responsableLivraison = await ResponsableLivraison.updateOne({ _id: req.params.id }, newDAtaResponsableLivraison);
    res.status(200).json({
      success: 1,
      responsableLivraison
    });
  } catch (error) {
    res.status(400).json({
      success: 0,
      message: error.message
    })
  }
}
// get All responsableLivraison
const getAllresponsableLivraison = async (req, res) => {
  try {
    const { page = 1, limit = 4 } = req.query;
    const countResponsablesLivraison = await ResponsableLivraison.find().count();
    const responsablesLivraison = await ResponsableLivraison.find().limit(limit * 1).skip((page - 1) * limit);
    res.status(200).json({
      success: 1,
      totale: countResponsablesLivraison,
      responsablesLivraison
    });
  } catch (error) {
    res.status(500).json({
      success: 0,
      message: error.message
    })
  }
}
// get responsableLivraison By id
const getResponsableLivraisonById = async (req, res) => {
  try {
    const responsableLivraison = await ResponsableLivraison.find({ _id: req.params.id });
    res.status(200).json({
      success: 1,
      responsableLivraison
    });
  } catch (error) {
    res.status(500).json({
      success: 0,
      message: error.message
    })
  }
}
// delete responsableLivraison
const deleteResponsableLivraison = async (req, res) => {
  try {
    const responsableLivraison = await ResponsableLivraison.remove({ _id: req.params.id })
    res.status(200).json({
      success: 1,
      responsableLivraison
    });
  } catch (error) {
    res.status(400).json({
      success: 0,
      message: error.message
    })
  }
}

// autantification responsableLivraison
const loginResponsableLivraison = async (req, res) => {
  try {
    const responsableLivraison = await ResponsableLivraison.find({
      email_responsable_livraison: req.body.email_responsable_livraison,
    });
    if (responsableLivraison.length !== 0) {
      const comparePassword = bcrypt.compareSync(
        req.body.password_responsable_livraison,
        responsableLivraison[0].password_responsable_livraison
      );
      if (comparePassword) {
        responsableLivraison[0].password_manager = undefined;
        const jsontoken = jsonwebtoken.sign(
          { result: responsableLivraison[0] },
          process.env.SECRET_KEY_RESPONSABLE_LIVRAISON,
          {
            expiresIn: "1h",
          }
        );
        res.cookie('token', jsontoken, { httpOnly: true });
                res.cookie('role', 'ResponsableLivraison', { httpOnly: true });
        res.status(200).json({
          success: 1,
          token: jsontoken,
        });
      } else {
        res.status(401).json({
          success: 0,
          message: "passwor or email incorrect",
        });
      }
    } else {
      res.status(401).json({
        success: 0,
        message: "passwor or email incorrect",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: 0,
      message: error.message,
    });
  }
}
const logoutResponsableLivraison = (req,res)=>{
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
  addResponsableLivraison,
  updateResponsableLivraison,
  getAllresponsableLivraison,
  getResponsableLivraisonById,
  deleteResponsableLivraison,
  loginResponsableLivraison,
  logoutResponsableLivraison
}