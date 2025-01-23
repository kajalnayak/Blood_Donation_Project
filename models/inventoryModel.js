const mongoose=require('mongoose')
const inventoryschema=new mongoose.Schema({
    inventoryType:{
        type:String,
        required:[true,"inventory type required"],
        enum:['in','out']
    },

    bloodgroup:{
        type:String,
        required:[true,'blood group is required'],
        enum:['O+','O-','A+','A-','B+','B-','AB+','AB-']
    },
    quantity:{
        type:Number,
        required:[true,"blood quanty is required"]
    },
    email:{
        type:String,
        required:[true,"Donar Email Is Required"],
    },
    organisation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:[true,'organisation is required']
    },
    hospital:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:function (){
            return this.inventoryType=='out'
        }
    },
    donar:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:function(){
            return this.inventoryType=='in'
        }
    },

},{timestamps:true})


module.exports=mongoose.model('inventory',inventoryschema)