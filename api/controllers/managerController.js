const Manager = require("../models/managerModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const jsonwebtoken = require("jsonwebtoken");


  // get All MAnager
 const getAllManagers = async (req, res) => {
    try {
      const { page = 1, limit = 4 } = req.query;
      const countManager = await Manager.find().count();
      const managers = await Manager.find()
        .limit(limit * 1)
        .skip((page - 1) * limit);
      res.status(200).json({
        success: 1,
        totale: countManager,
        managers,
      });
    } catch (error) {
      res.status(500).json({
        success: 0,
        message: error.message,
      });
    }
  }
  // get MAnager By id
 const getManagerById = async (req, res) => {
    try {
      const manager = await Manager.find({ _id: req.params.id });
      res.status(200).json({
        success: 1,
        manager,
      });
    } catch (error) {
      res.status(500).json({
        success: 0,
        message: error.message,
      });
    }
  }
  // add Manager
 const addManager = async (req, res) => {
    const password = generator.generate({
      length: 10,
      numbers: true,
    });
    const manager = new Manager({
      nom_manager: req.body.nom_manager,
      prenom_manager: req.body.prenom_manager,
      email_manager: req.body.email_manager,
      password_manager: bcrypt.hashSync(password, 10),
    });
    try {
      const newManager = await manager.save();
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
        to: req.body.email_manager, // TODO: email receiver
        subject: "votre compte sur la platforme MarocShip",
        text: `Bonjor ${req.body.prenom_manager} ${req.body.nom_manager} votre mot de passe pour connecter sur la platforme MarocShip : ${password}`,
      };

      // Step 3
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          return log("Error occurs");
        }
        res.status(200).json({
          success: 1,
          newManager,
        });
      });
    } catch (error) {
      res.status(400).json({
        success: 0,
        message: error.message,
      });
    }
  }
  // update Manager
 const updateManager = async (req, res) => {
    const newDAtaManager = {
      nom_manager: req.body.nom_manager,
      prenom_manager: req.body.prenom_manager,
      email_manager: req.body.email_manager,
    };
    try {
      const manager = await Manager.updateOne(
        { _id: req.params.id },
        newDAtaManager
      );
      res.status(200).json({
        success: 1,
        manager,
      });
    } catch (error) {
      res.status(400).json({
        success: 0,
        message: error.message,
      });
    }
  }

  // delete Manager
 const deleteManager = async (req, res) => {
    try {
      const manager = await Manager.remove({ _id: req.params.id });
      res.status(200).json({
        success: 1,
        manager,
      });
    } catch (error) {
      res.status(400).json({
        success: 0,
        message: error.message,
      });
    }
  }
  // autantification Manager
 const loginManager = async (req, res) => {
    try {
      const manager = await Manager.find({
        email_manager: req.body.email_manager,
      });
      if (manager.length !== 0) {
        const comparePassword = bcrypt.compareSync(
          req.body.password_manager,
          manager[0].password_manager
        );
        if (comparePassword) {
          manager[0].password_manager = undefined;
          const jsontoken = jsonwebtoken.sign(
            { result: manager[0] },
            process.env.SECRET_KEY_MANAGER,
            {
              expiresIn: "1h",
            }
          );
          res.cookie('token', jsontoken, { httpOnly: true });
                res.cookie('role', 'manager', { httpOnly: true });
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
  const logoutManager = (req,res)=>{
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
    getAllManagers,
    getManagerById,
    addManager,
    updateManager,
    deleteManager,
    loginManager,
    logoutManager
  }

