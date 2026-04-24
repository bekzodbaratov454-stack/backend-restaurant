import "dotenv/config";
import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

if(!MONGO_URL) {
    console.error("MONGO url not given");
    process.exit(1);
}


export const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URL);

        console.log("Db connected🏆");
        
    } catch (error) {

        console.error("Db connection failed😞" , error);
        process.exit(1);
    }
};