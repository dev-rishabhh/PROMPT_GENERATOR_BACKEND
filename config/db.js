import mongoose from "mongoose";

try{
    await mongoose.connect(process.env.DB_URL)
}catch(err){
    // console.log(err);
    console.log("error connecting to db");
}

process.on("SIGINT",async()=>{
    await client.close()
    process.exit(0)
})
