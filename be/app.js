const express=require ("express"); 
const app=express();
const errorMiddleWare = require("./middleware/error");
const cookieParser= require("cookie-parser");

app.use(cookieParser());
app.use(express.json());

//Route Imports
const product= require("./routes/productRoute");
const user=require("./routes/userRoute");

app.use("/api/v1",product);
app.use("/api/v1",user);

app.use(errorMiddleWare);

module.exports =app