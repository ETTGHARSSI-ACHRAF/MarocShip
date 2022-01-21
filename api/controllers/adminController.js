const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

// autantification admin
const loginAdmin = async (req, res) => {
    try {
        const admin = await Admin.find({ email_admin: req.body.email_admin });
        if (admin.length !== 0) {
            const comparePassword = bcrypt.compareSync(
                req.body.password_admin,
                admin[0].password_admin
            );
            if (comparePassword) {
                admin[0].password_admin = undefined;
                const token = jsonwebtoken.sign(
                    { result: admin[0] },
                    process.env.SECRET_KEY_ADMIN,
                    {
                        expiresIn: "1h",
                    }
                );
                res.cookie('token', token, { httpOnly: true });
                res.cookie('role', 'admin', { httpOnly: true });
                res.status(200).json({
                    success: 1,
                    token: token,
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
const logoutAdmin = (req,res)=>{
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
    loginAdmin,
    logoutAdmin
};
