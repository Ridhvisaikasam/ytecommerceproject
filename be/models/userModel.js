const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:[true,"please enter your name"],
        maxLength:[30,"name cant exceed 30 characters"],
        minLength:[4,"name should have min 4 characters"]
    },
    email:{
        type:String,
        require:[true,"please enter your email"],
        unique:true,
        validate:[validator.isEmail,"please enter valid email"]
    },
    password:{
        type:String,
        require:[true,"please enter password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    avatar:{
            public_id:{
               type:String,required:true
            },
            url:{
               type:String,required:true
            }
    },
    role:{
        type:String,
        default:"user",
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,

});

userSchema.pre("save",async function(next)
{
     if(!this.isModified("password"))
     {
        next();
     }

     this.password=await bcrypt.hash(this.password,10);

});

userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
};

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

userSchema.methods.getResetPasswordToken =function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now()+15*60*1000;

    return resetToken;
};

 

module.exports = mongoose.model("User", userSchema);