const mongoose = require("mongoose");

const productschema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter a product name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please enter a product description"]
    },
    price:{
        type:Number,
        maxLength:[8,"Price cant exceed 8 characters"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[{
         public_id:{
            type:String,required:true
         },
         url:{
            type:String,required:true
         }
    }],
    category:{ 
        type:String,
        reuired:[true,"please enter product category"]
    },
    Stock:{
        type:Number,
        reuired:[true,"please enter stock"],
        maxLength:[4,"cant exceed 4 characters"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"users",
                required:true
            },
            name:{type:String,required:true,},
            rating:{type:Number,required:true},
            comment:{type:String,required:true}
        }
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"users",
        required:true
    },

    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Product",productschema);