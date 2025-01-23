const userModel = require("../models/userModel");

const getDonarListController= async(req,res) => {
    try {
        const donarData=await userModel
        .find({role:"donar"})
        .sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            Totalcount:donarData.length,
            message:"Donar List Fetched Successfully",
            donarData,
            
        });
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error In Donar List API",
            error,
        });
        
    }
    
};


const getHospitalListController= async(req,res) => {
    try {
        const hospitalData=await userModel
        .find({role:"hospital"})
        .sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            Totalcount:hospitalData.length,
            message:"hospital List Fetched Successfully",
            hospitalData,
            
        });
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error In Hospital List API",
            error,
        });
        
    }
    
};


const getOrganisationListController= async(req,res) => {
    try {
        const OrganisationData=await userModel
        .find({role:"organisation"})
        .sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            Totalcount:OrganisationData.length,
            message:"organisation List Fetched Successfully",
            OrganisationData,
            
        });
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error In Hospital List API",
            error,
        });
        
    }
    
};

const deleteDonarController=async(req,res)=>{
    try {
        await userModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success:true,
            message:"Record Deleted Successfully"
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error while deleting donar",
            error
        })
        
    }

};





module.exports={
    getDonarListController,
    getHospitalListController,
    getOrganisationListController,
    deleteDonarController
};