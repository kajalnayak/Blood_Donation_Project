const mongoose=require("mongoose");
const connectDB=async()=>{
    try {
      await  mongoose.connect(process.env.MONGODB_URI);
      console.log(`connected to mongodb database ${mongoose.connection.host}`)
    } catch (error) {
        console.log(`mongodb database Error ${error}`)
    }
};
module.exports=connectDB;