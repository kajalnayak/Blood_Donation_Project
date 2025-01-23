const inventoryModel = require("../models/inventoryModel");
const mongoose=require('mongoose')

const bloodGroupDetailsController=async(req,res)=>{
    try {
        // const bloodgroup=["O+","O-","AB+","AB-","A+","A-","B+","B-"];
        // const bloodgroupData=[];
        // const organisation=new mongoose.Types.ObjectId(req.body.userId);
        // //const organisation=req.body.userId;
        // console.log("Organisation ID:", organisation);

        // await Promise.all(bloodgroup.map (async(bloodgroup)=>{
        //     console.log("Processing bloodgroup:", bloodgroup);
        //     console.log({
        //         bloodgroup,
        //         inventoryType: 'in',
        //     });
        //     const totalIn=await inventoryModel.aggregate([
        //         {$match:{
        //             bloodgroup:bloodgroup,
        //             inventoryType:'in',
                    
        //         },
        //     },
        //         {
        //             $group:{
        //                 _id:null,
        //                 total:{$sum:"quantity"},
        //             },
        //         },
        //     ]);
        //     console.log(`Total In for ${bloodgroup}:`, totalIn);
        //     const totalOut=await inventoryModel.aggregate([
        //         {$match:{
        //             bloodgroup:bloodgroup,
        //             inventoryType:'out',
                    
        //         },
        //     },
        //         {
        //             $group:{
        //                 _id:null,
        //                 total:{$sum:"quantity"},
        //             },
        //         },
        //     ]);
        //     console.log(`Total Out for ${bloodgroup}:`, totalOut);

        //     const availabelBlood=(totalIn[0]?.total || 0)-(totalOut[0]?.total || 0)
        //     bloodgroupData.push({
        //         bloodgroup,
        //         totalIn:totalIn[0]?.total || 0,
        //         totalOut:totalOut[0]?.total || 0,
        //         availabelBlood
        //     })
        // }));

        // return res.status(200).send({
        //     sucess:true,
        //     message:"Blood Group Data Fetch",
        //     bloodgroupData,
        // })


       // Blood groups list
        const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

        // Map over blood groups to calculate totalIn, totalOut, and availableBlood
        const analytics = await Promise.all(
            bloodGroups.map(async (bloodgroup) => {
                // Calculate total blood "in"
                const totalInData = await inventoryModel.aggregate([
                    { $match: { bloodgroup, inventoryType: 'in' } }, // Match bloodgroup and inventoryType
                    { $group: { _id: null, total: { $sum: '$quantity' } } }, // Sum quantity
                ]);

                // Calculate total blood "out"
                const totalOutData = await inventoryModel.aggregate([
                    { $match: { bloodgroup, inventoryType: 'out' } }, // Match bloodgroup and inventoryType
                    { $group: { _id: null, total: { $sum: '$quantity' } } }, // Sum quantity
                ]);

                // Extract totals or default to 0
                const totalIn = totalInData.length ? totalInData[0].total : 0;
                const totalOut = totalOutData.length ? totalOutData[0].total : 0;

                // Calculate available blood
                const availableBlood = totalIn - totalOut;

                // Return formatted object
                return {
                    bloodgroup,
                    totalIn,
                    totalOut,
                    availableBlood,
                };
            })
        );

        // Send response
        res.status(200).json({
            success: true,
            message: 'Blood Group Data Fetch',
            bloodgroupData: analytics,
        });
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error In Bloodgroup Data Analytics API",
            error,
        });
    }

};
module.exports={bloodGroupDetailsController}