import mongoose from "mongoose";
export async function connectToMongoDb(url: string, option: mongoose.ConnectOptions) {
  return mongoose.connect(url, option);
}