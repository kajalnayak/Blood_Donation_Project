const express=require('express');
const authMiddelware = require('../middlewares/authMiddelware');
const { bloodGroupDetailsController } = require('../controllers/analyticsController');
const router=express.Router();


router.get(
    '/bloodgroup-analytics',
    authMiddelware,
    bloodGroupDetailsController
);



module.exports=router;