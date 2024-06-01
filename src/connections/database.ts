import mongoose from "mongoose";

function DatabaseConnection() {
  mongoose.connect(process.env.MONGODB_URI as string).then(() => {
    console.log("Connected to database");
  });
}

export default DatabaseConnection;
