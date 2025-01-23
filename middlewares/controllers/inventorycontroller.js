const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

const inventorycontroller =async(req,res)=>{
    try {
        
        //const { email, inventoryType, bloodgroup, quantity } = req.body;
        const { email,bloodgroup,quantity} = req.body;
         if (!email || !bloodgroup || !quantity) {
            return res.status(400).send({
                success: false,
                message: "All fields are required: email, inventoryType, bloodgroup, and quantity.",
            });
        }

        // if(inventoryType==='in' && !donarEmail){
        //     return res.status(400).send({
        //         success:false,
        //         message:"Doner email is required for 'in' inventory type"
        //     });
       // }

        const user=await userModel.findOne({email});
         if(!user){
             throw new Error("user not found")
        }
        // if(inventoryType==='in' && user.role!=='donar'){
        //      throw new Error('Not a donar account')
        // }

        // if(inventoryType==='out' && user.role!=="hospital"){
        //      throw new Error('Not a hospital account')
        // }

        // const inventory = new inventoryModel({
        //     inventoryType,
        //     bloodgroup,
        //     quantity,
        //     organisation: user._id,
        //     ...(inventoryType === 'in' && { donar: user._id }),
        //     ...(inventoryType === 'out' && { hospital: user._id }),
        // });

        if(req.body.inventoryType=='out'){
            const  requestedBloodgroup=req.body.bloodgroup
            console.log(requestedBloodgroup);
            const requestedQuantityofBlood=req.body.quantity 
            const organisation = new mongoose.Types.ObjectId(req.body.userId);
            
            const totalInOfRequestedBlood=await inventoryModel.aggregate([
                {$match:{
                    organisation,
                    inventoryType:'in',
                    bloodgroup:requestedBloodgroup
                }},{
                    $group:{
                        _id:'$bloodgroup',
                        total:{$sum:'$quantity'}
                    }
                }
            ]);
            //console.log("Total In",TotalInOfRequestedBlood);
            const totalIn=totalInOfRequestedBlood[0]?.total || 0


            const totalOutOfRequestedBlood=await inventoryModel.aggregate([
                {$match:{
                        organisation,
                        inventoryType:'out',
                        bloodgroup:requestedBloodgroup
                    
                }},
                {
                    $group:{
                        _id:'$bloodgroup',
                        total:{$sum:'$quantity'},
                    },
                },
            ]);
            const totalOut=totalOutOfRequestedBlood[0]?.total || 0 ;

            const TotalAvailableBlood=totalIn-totalOut;

            if(TotalAvailableBlood <requestedQuantityofBlood){
                return res.status(500).send({
                    success:false,
                    message:`Only ${TotalAvailableBlood}ML ${requestedBloodgroup.toUpperCase()}is available`
                })
            }
            req.body.hospital=user?._id;

        }else{
            req.body.donar=user?._id;
        }

        const inventory = new inventoryModel(req.body)
        await inventory.save();
        return res.status(201).send({
            success:true,
            message:"New blood record added",
        });
        
    } catch (error) {
        console.log(error)
         res.status(500).send({
            success:false,
             message:"error in create Inventory API",
             error,
         });

    }

};

const getinventorycontroller=async(req,res)=>{
    try {
            const userId = req.body.userId;
            if (!userId) {
                return res.status(400).send({
                    success: false,
                    message: "User ID is required.",
                });
            }
        const inventory=await inventoryModel.find({organisation:req.body.userId})
         .populate("donar")
        .populate("hospital")
        .sort({createdAt:-1});

    return res.status(200).send({
            success:true,
            message:"get all inventory records",
            inventory,  
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in getApiInventory",
        });
    }

};


const getinventoryHospitalcontroller=async(req,res)=>{
    try {
            const userId = req.body.userId;
            if (!userId) {
                return res.status(400).send({
                    success: false,
                    message: "User ID is required.",
                });
            }
        const inventory=await inventoryModel.find(req.body.filters)
         .populate("donar")
        .populate("hospital")
        .populate("organisation")
        .sort({createdAt:-1});

    return res.status(200).send({
            success:true,
            message:"get hospital consumer Inventory Successfully",
            inventory,  
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in Get consumer Inventory",
        });
    }

};

const getDonarcontroller=async(req,res)=>{
    try {
        const organisation=req.body.userId;
        
        const donarId=await inventoryModel.distinct("donar",{

            organisation,
        });
        //console.log(donarId);
        const donars=await userModel.find({_id:{$in:donarId}});
        return res.status(200).send({
            success:true,
            message:"Donar Record Fetched Successfully",
            donars,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in Donar Records',
            error,
        });
        
    }

};

const getHospitalcontoller=async(req,res)=>{

        try {
            const organisation=req.body.userId;
            const hospitalId= await inventoryModel.distinct('hospital',{
                organisation,
            });

            const hospitals=await userModel.find({
                _id:{$in:hospitalId},
            })
            return res.status(200).send({
                success:true,
                message:"Hospitals Data Fetched Successfully",
                hospitals,
            });
            
        } catch (error) {
            console.log(error)
            return res.status(500).send({
                success:false,
                message:"Error in get Hospital API",
                error
            })
        }

};

const getOrganisationcontoller= async(req,res)=>{
    try {
        const donar=req.body.userId
        const organisationId=await inventoryModel.distinct("organisation",{donar});

        const Organisations=await userModel.find({
            _id:{$in:organisationId}
        });

        return res.status(200).send({
            success:true,
            message:"Organisation Data Fetched Successfully",
            Organisations,
        });
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error In ORG API',
            error
        })
    }

};


const getOrganisationForHospitalcontoller= async(req,res)=>{
    try {
        const HospitalId=req.body.userId
        const organisationId=await inventoryModel.distinct("organisation",{HospitalId});

        const Organisations=await userModel.find({
            _id:{$in:organisationId}
        });

        return res.status(200).send({
            success:true,
            message:"Hospital Data Fetched Successfully",
            Organisations,
        });
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error In Hospital API',
            error
        })
    }

};

//const getRecentInventoryController= async(req,res)=>{
    // try {
    //     const Recentinventory=await inventoryModel.find({organisation:req.body.userId}).limit(3).sort({createdAt:-1});
    //    // console.log("Request User ID:", req.body.userId);
    //    console.log("Request User ID:", req.body.userId); // Log the user ID before sending the response
    //    console.log("Recent Inventory:", Recentinventory); 
    //     return res.status(200).send({
    //         success:true,
    //         message:"recent Inventory Data",
    //         Recentinventory,

    //     })
    //    // console.log("Request User ID:", req.body.userId);
       
        
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).send({
    //         success:false,
    //         message:"Error In Recent Inventory API"
    //     })
        
    // }

        
//         try {
//             const inventory = await inventoryModel
//               .find({
//                 organisation: req.body.userId,
//               })
//               .limit(3)
//               .sort({ createdAt: -1 });
//             return res.status(200).send({
//               success: true,
//               message: "recent Invenotry Data",
//               inventory,
//             });
//           } catch (error) {
//             console.log(error);
//             return res.status(500).send({
//               success: false,
//               message: "Error In Recent Inventory API",
//               error,
//             });
//           }
    
// };
module.exports={inventorycontroller,getinventorycontroller,getDonarcontroller,getHospitalcontoller,getOrganisationcontoller,getOrganisationForHospitalcontoller,getinventoryHospitalcontroller,};