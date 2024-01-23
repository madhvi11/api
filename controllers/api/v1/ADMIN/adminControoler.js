const Register=require("../../../../models/Admin/admin");
const bcrypt=require('bcrypt');
const jwtData=require("jsonwebtoken");
const path = require('path');
const fs=require('fs');
const Manager=require("../../../../models/Manager/manager");
const { Admin } = require("mongodb");

module.exports.registration=async(req,res)=>{
    // console.log(req.file);
    // console.log(req.body);
    try
    {
        req.body.password =await bcrypt.hash(req.body.password,10);
        //    console.log(hash);
            
        var imgpath=''
        if(req.file)
            {
                imgpath=Register.imagepath+"/"+req.file.filename;
            }
            req.body.image=imgpath;
            let regidata = await Register.create(req.body);
            if(regidata)
            { 
            return res.status(200).json({msg:"record insert succesfully",staus:1,'data':regidata});
            }
            else
            {
                return res.status(400).json({msg:"wrong",status:0});
            } 
    }
    catch(err)
    {
        console.log(err);
        return res.status(400).json({msg:"wrong",status:0});
    }
}

module.exports.login=async(req,res)=>{
    try
    {
        // console.log(req.body);
        let checkmail = await Register.findOne({email:req.body.email});
        if(checkmail)
        {
            if(await bcrypt.compare(req.body.password,checkmail.password))
            {
                let token =  jwtData.sign({
                    data : checkmail},'madhvi',{expiresIn:'1h'}
                );
                if(token)
                {
                    return res.status(200).json({msg :"succesfully",status:1,token :token})
                }
                console.log(token);
            }
           
        }
        
    }
    catch(err)
    {
        console.log(err);
        return res.status(400).json({msg:"wrong",status:0});
    }
}

module.exports.profile=async(req,res)=>{
    // console.log(req.user);
    let manData=await Register.findById(req.user.id).populate('managerIds').exec();
    return res.status(200).json({msg:"adminRecord",status:1,profile:manData});
}

module.exports.editprofile=async(req,res)=>{
    try
    { 
        let oldadmindt = await Register.findById(req.params.id);
        if(req.file)
        {

            // console.log(oldadmindt);
            // console.log(req.file);
            var fullpath = path.join(__dirname,'../../../..',oldadmindt.image);
            // console.log(fullpath);
            try{
                await fs.unlinkSync(fullpath);
            }
            catch(err){
                console.log(err);
            }
            req.body.image = Register.imagepath+'/'+req.file.filename;
            var editdt =await Register.findByIdAndUpdate(req.params.id,req.body);
            if(editdt)
            {
                return res.status(200).json({msg:"edit record",staus:1});
            }
            else
            {
                return res.status(200).json({msg:"not edit record",staus:0});
            }
        }
        else
        {
            var imgpath='';
            if(oldadmindt)
            {
                imgpath=oldadmindt.image;
            }
            req.body.image=imgpath;
            var editdt =await Register.findByIdAndUpdate(req.params.id,req.body);
            if(editdt)
            {
                return res.status(200).json({msg:"edit record",staus:1});
            }
            else
            {
                return res.status(200).json({msg:"not edit record",staus:0});
            }
        }
        // console.log(req.params.id);
        // console.log(req.body);
       
    }
    catch(err){
        return res.status(400).json({msg:"wrong",status:0});
    }
}

module.exports.viewallManager=async(req,res)=>{
    try
    {
        let allManagerData = await Manager.find({});
        return res.status(200).json({msg:"all manager record",status:1,data:allManagerData});
    }
    catch(err)
    {
        return res.status(400).json({msg:"wrong",status:0});
    }
}