import mongoose from "mongoose";
// mongoose.set("debug", true);

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("===DB", "MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "master_of_self",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("===DB", "MongoDB is already connected");
  } catch (error) {
    console.log("===DB", error);
  }
};
