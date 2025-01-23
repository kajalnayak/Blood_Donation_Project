const JWT=require("jsonwebtoken");

const authMiddelware=async(req,res,next)=>{
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).send({
                success: false,
                message: "Auth Failed: No token provided or incorrect format",
            });
        }
        const token=authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Auth Failed: Token missing",
            });
        }
        
        JWT.verify (token,process.env.JWT_SECRTE,(err,decode)=>{
            if(err){
                return res.status(401).send({
                    success:false,
                    message:"Auth Failed: Invalid token",
                });
            }else{
                req.body.userId=decode.userId ;
                next();
            }
        });

         } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: "Auth Failedd",
            error: error.message,
        });
    }
};
module.exports=authMiddelware;