const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User=require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail");
const crypto = require("crypto");
const { send } = require("process");

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const{name,email,password}=req.body;

    const user=await User.create({
       name,
       email,
       password,
       avatar:{public_id:"this is sample id",url:"profilepicurl"},
    });

    sendToken(user,201,res);
});

exports.loginUser = catchAsyncErrors(
    async(req,res,next)=>{
        const{email,password}=req.body;

        if ( !email || !password) {
            return next(new ErrorHandler("Please Enter Email & Password", 400));
            }
        
        const user= await User.findOne({email}).select("+password");
        
        if ( !user) {
            return next(new ErrorHandler("Please Enter correct Email & Password"));
            }
        
         const isPasswordMatched = user.comparePassword(password);
         
         if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid email or password", 401));
          }
          
          sendToken(user,200,res);
    }
);

  exports.logoutUser=catchAsyncErrors(
    async(req,res,next)=>{

        res.cookie("token",null,{
            expires:new Date(Date.now()),
            httpOnly:true
        });

        res.status(200).json({
            success:true,
            message:"logged out"
        });

    }
  );

  exports.forgotPassword=catchAsyncErrors(
    async(req,res,next)=>{
        const user=await User.findOne({email:req.body.email});
        
        if(!user)
        {return next(new ErrorHandler("user not found",404));}
        
        const resetToken=user.getResetPasswordToken();
        
        await user.save({validateBeforeSave:false});

        const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

        const message=`your password reset url is ${resetPasswordUrl}`;

        try {
            
            await sendEmail({
                email:user.email,
                subject:`Ecommerce password recovery`,
                message, 
            });


            res.status(200).json({
                success:true,
                message:`Email sent to ${user.email} successfully`
            });

        } catch (error) {
            user.resetPasswordToken=undefined;
            user.resetPasswordExpire=undefined;

            await user.save({validateBeforeSave:false});

            return next(new ErrorHandler(error.message,500));
        }
    }
  );

  exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not match", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });

  exports.getUserDetails=catchAsyncErrors(
    async(req,res,next)=>{

      const user=await User.findById(req.user.id);

      res.status(200).json({
        success:true,
        user
      });

    }
  );

  exports.updatePassword=catchAsyncErrors(
    async(req,res,next)=>{

      const user=await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(req.body.oldpassword);
         
         if (!isPasswordMatched) {
            return next(new ErrorHandler("Old password Incorrect", 400));
          }

      if(req.body.newpassword!==req.body.confirmpassword)
      {
        return next(new ErrorHandler("passwords not matching", 400));
      }
      
      user.password= req.body.newpassword

      await user.save()

      sendToken(user,200,res);

    }
  );

  // update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData ={
  name: req.body.name,
  email: req.body.email};

  // We will add cloudinary later
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
  new: true,
  runValidators: true,
  useFindAndModify: false,
  });

  res.status (200).json({
  success: true,
  });
  
});

// Get all users (admin)
exports.getAllUser = catchAsyncErrors (async (req, res, next) => {
  const users = await User.find();

  res.status (200).json({
  success: true,
  users,
  });

  });

  // Get single user (admin)
  exports.getSingleUser = catchAsyncErrors (async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
  return next(
  new ErrorHandler (`User does not exist with Id: ${req.params.id}`)
  );}
  

  res.status (200).json({
  success: true,
  user,
  });

  });

 // update User Role
 exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData ={
  name: req.body.name,
  email: req.body.email,
  role: req.body.role
};

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
  new: true,
  runValidators: true,
  useFindAndModify: false,
  });

  res.status (200).json({
  success: true,
  user
  });
  
});

// DeleteUser 
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  
  const user = await User.findById(req.params.id);

  if(!user)
  {
    new ErrorHandler (`User does not exist with Id: ${req.params.id}`)
  }

  // We will delete cloudinary later

  await user.remove();

  res.status (200).json({
  success: true,
  message: "user deleted successfully"
  });
  
});