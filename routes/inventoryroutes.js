const express=require('express');
const { inventorycontroller, getinventorycontroller,getDonarcontroller, getHospitalcontoller,getOrganisationcontoller, getOrganisationForHospitalcontoller,getinventoryHospitalcontroller,getRecentInventoryController} = require('../controllers/inventorycontroller');
const authMiddelware = require('../middlewares/authMiddelware');
const router=express.Router();

router.post(
    '/creat_inventory',
    authMiddelware,
    inventorycontroller
);

router.get(
    '/get_inventory',
    authMiddelware,
    getinventorycontroller
);

//router.get('/get_recent-inventory',authMiddelware,getRecentInventoryController);
router.get(
    '/get_donar',
    authMiddelware,
    getDonarcontroller
);
router.get(
    '/get_hospital',
    authMiddelware,
    getHospitalcontoller
);
router.get(
    '/get_organisation',
    authMiddelware,
    getOrganisationcontoller
);
router.get(
    '/get_organisation-for-hospital',
    authMiddelware,
    getOrganisationForHospitalcontoller
);
router.post(
    '/get_inventory-hospital',
    authMiddelware,
    getinventoryHospitalcontroller
);




module.exports=router;