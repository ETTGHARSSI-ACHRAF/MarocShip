const Vehicule = require('../models/vehiculeModel');


    // get All vehicule
   const getAllVehicule = async (req,res)=>{
        try{
            const {page = 1, limit = 4} = req.query;
            const countVehicule = await Vehicule.find().count();
            const vehicules = await Vehicule.find().limit(limit*1).skip((page-1)*limit);
            res.status(200).json({
                success:1,
                totale:countVehicule,
                vehicules
            });
        }catch(error){
            res.status(500).json({
                success : 0,
                message:error.message
            })
        }
    }
     //   get vehicule By id
   const  getVehiculeById  = async (req,res)=>{
        try{
            const vehicule = await Vehicule.find({_id:req.params.id});
            res.status(200).json({
                success:1,
                vehicule
            });
        }catch(error){
            res.status(500).json({
                success : 0,
                message:error.message
            })
        }
    }
    //  add vehicule
  const  addVehicule = async (req,res)=>{
        const vehicule = new Vehicule({
            type_vehicule:req.body.type_vehicule,
            nom_vehicule:req.body.nom_vehicule,
            matricule:req.body.matricule
        });
        try{
            const newvehicule = await vehicule.save();
                  res.status(200).json({
                        success:1,
                        newvehicule
                    });
           
        }catch(error){
            res.status(400).json({
                success : 0,
                message:error.message
            })
        }
    }
    //  update vehicule
    const updateVehicule = async (req,res) =>{
        const newDAtaVehicule= {
            type_vehicule:req.body.type_vehicule,
            nom_vehicule:req.body.nom_vehicule,
            matricule:req.body.matricule
        };
        try{
           const vehicule = await Vehicule.updateOne({_id:req.params.id},newDAtaVehicule);
           res.status(200).json({
            success:1,
            vehicule
        });
        }catch(error){
            res.status(400).json({
                success : 0,
                message:error.message
            })
        }
    }

    // delete vehicule
   const deleteVehicule = async (req,res) =>{
        try{
            const vehicule = await Vehicule.remove({_id:req.params.id})
            res.status(200).json({
             success:1,
             vehicule
         });
         }catch(error){
             res.status(400).json({
                 success : 0,
                 message:error.message
             })
         }
    }

module.exports = {
    getAllVehicule,
    getVehiculeById,
    addVehicule,
    updateVehicule,
    deleteVehicule
}