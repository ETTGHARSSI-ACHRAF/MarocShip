const jwt = require("jsonwebtoken");
   const checkTokenAdmin = (req, res, next) => {

      try{
         const token = req.cookies.token;
         const role = req.cookies.role;
 
        if (token && role == 'admin') {  
             const verified = jwt.verify(token,process.env.SECRET_KEY_ADMIN)
            //  req.user = verified.user
             next();
         } else {
             return res.status(401).json({
                 success:0,
                 errorMessage:'Non autorisé'
             })
         } 
      }catch (error) {
        res.status(500).json({
            success: 0,
            message: error.message,
        });
    }
    }
    const checkTokenManager = (req, res, next) => {

        try{
           const token = req.cookies.token;
           const role = req.cookies.role;
   
          if (token && role == 'manager') {  
               const verified = jwt.verify(token,process.env.SECRET_KEY_MANAGER)
              //  req.user = verified.user
               next();
           } else {
               return res.status(401).json({
                   success:0,
                   errorMessage:'Non autorisé'
               })
           } 
        }catch (error) {
          res.status(500).json({
              success: 0,
              message: error.message,
          });
      }
      }
      const checkTokenResponsableLivraison = (req, res, next) => {

        try{
           const token = req.cookies.token;
           const role = req.cookies.role;
   
          if (token && role == 'ResponsableLivraison') {  
               const verified = jwt.verify(token,process.env.SECRET_KEY_RESPONSABLE_LIVRAISON)
              //  req.user = verified.user
               next();
           } else {
               return res.status(401).json({
                   success:0,
                   errorMessage:'Non autorisé'
               })
           } 
        }catch (error) {
          res.status(500).json({
              success: 0,
              message: error.message,
          });
      }
      }
      const checkTokenChauffeur = (req, res, next) => {

        try{
           const token = req.cookies.token;
           const role = req.cookies.role;
   
          if (token && role == 'chauffeur') {  
               const verified = jwt.verify(token,process.env.SECRET_KEY_RESPONSABLE_LIVRAISON)
              //  req.user = verified.user
               next();
           } else {
               return res.status(401).json({
                   success:0,
                   errorMessage:'Non autorisé'
               })
           } 
        }catch (error) {
          res.status(500).json({
              success: 0,
              message: error.message,
          });
      }
      }

module.exports = {
    checkTokenAdmin,
    checkTokenManager,
    checkTokenResponsableLivraison,
    checkTokenChauffeur
}
