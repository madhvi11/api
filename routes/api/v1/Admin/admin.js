const express=require('express');
const routes=express.Router();
const adminController=require("../../../../controllers/api/v1/ADMIN/adminControoler");
const Register=require("../../../../models/Admin/admin");
const passport = require('passport');

routes.post("/registration",Register.uploadImage,adminController.registration);
routes.post("/login",adminController.login);

routes.get("/profile",passport.authenticate('jwt',{failureRedirect : "/admin/faillogin"}),adminController.profile);

routes.get("/faillogin",async (req,res)=>{
    return res.status(200).json({msg :"Invalid login ",status : 0})
});

routes.put("/editprofile/:id",passport.authenticate('jwt',{failureRedirect : "/admin/faillogin"}),Register.uploadImage,adminController.editprofile);

routes.get("/viewallManager",passport.authenticate('jwt',{failureRedirect :"/admin/faillogin"}),adminController.viewallManager)

routes.use("/manager",require('../../../../routes/api/v1/Manager/manager'));

module.exports=routes;