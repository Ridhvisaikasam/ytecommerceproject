const app= require("./app");
const dotenv=require("dotenv");
const connectDatabase = require("./config/database");

process.on("uncaughtException",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down due to uncaught exception`);
    process.exit(1);
})

dotenv.config({path:"be/config/config.env"});

connectDatabase();

app.listen(process.env.PORT,()=>{
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})

process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down due to unhandled rejection`);

    server.close(()=>{
        process.exit(1);
    })

});