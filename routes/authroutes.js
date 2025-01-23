const express=require("express");
const { registercontroller, logincontroller, currentusercontoller } = require("../controllers/authcontroller");
const authMiddelware = require("../middlewares/authMiddelware");
const router=express.Router()

router.post('/register',registercontroller);
router.post('/login',logincontroller);
router.get('/current_user',authMiddelware,currentusercontoller);


module.exports=router;