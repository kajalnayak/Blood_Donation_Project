const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');

const registercontroller=async(req,res) =>{
    try {

       const existuser=await userModel.findOne({email:req.body.email});

       if(existuser){
        return res.status(200).send({
            success:false,
            message:'user already exist'
        })
       }
        const salt=await bcrypt.genSalt(10)
      const hashedpassword= await bcrypt.hash(req.body.password,salt);
      req.body.password=hashedpassword;

      const user=new userModel(req.body);
      await user.save();
      return res.status(201).send({
        success:true,
        message:"user resister successfuly",
        user,
      });

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: "Error in create Inventory API",
            error: error.message,
        });
    }
};




const logincontroller = async(req,res)=>{
    try {
        const user=await userModel.findOne({email:req.body.email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"user is not found"
            });
        }
        if(user.role !== req.body.role){
            return res.status(500).send({
                success:false,
                messge:"role does not match"
            });
        }
        
        const comparepassword= await bcrypt.compare(req.body.password,user.password);
        if(!comparepassword){
            return res.status(500).send({
                sucess:false,
                message:"Invalid credentials"
            });
        }

        const token=jwt.sign({userId:user._id},process.env.JWT_SECRTE,{expiresIn:'1d',});
        return res.status(200).send({
            success:true,
            message:"user login sucessfully",
            token,
            user,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error In login API',
            error,
        });
        
    }

};



const currentusercontoller=async(req,res)=>{
try {
    const user=await userModel.findOne({_id:req.body.userId});
    return res.status(200).send({
        sucess:true,
        message:"User Fetched successfully",
        user,
    });
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Error in currentuser_login",
        error,
    });
    
}

};

module.exports={
    registercontroller,
    logincontroller,
    currentusercontoller
};