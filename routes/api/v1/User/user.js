const express=require('express');
const routes=express.Router();
const User=require("../../../../models/USER/user");
const userController=require("../../../../controllers/api/v1/USER/userController");
const passport=require('passport')

routes.post("/registration",User.uploadImage,userController.registration);
routes.post("/login",userController.login);
routes.get("/profile",passport.authenticate('userData',{failureRedirect:"/faillogin"}),userController.profile);
routes.put("/editprofile/:id",passport.authenticate('userData',{failureRedirect:"/admin/faillogin"}),User.uploadImage,userController.editprofile);
routes.get("/alluserdata",passport.authenticate('userData',{failureRedirect:'/admin/faillogin'}),userController.alluserdata);


module.exports=routes;