import mongoose from "mongoose";

const connectToMongo = async()=>{
    try{
        const mongoURL = process.env.mongo_db_url;
        

        if (!mongoURL) {
            throw new Error("MONGO_DB_URL is not defined in environment variables");
        }

        await mongoose.connect(mongoURL);
        console.log("database connected...")

    }catch(error){
        console.error("error in databse connection : ",error)
    }
}

export default connectToMongo