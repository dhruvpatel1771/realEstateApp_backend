import mongoose from "mongoose";

const connection = mongoose.connect("process.env.DATABASE_URL")
console.log(connection);

export default connection;