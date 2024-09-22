// import mongoose from "mongoose";
// mongoose.set("debug", false);

// let isConnected = false;

// export const connectToDB = async () => {
//   mongoose.set("strictQuery", true);

//   if (isConnected) {
//     console.log("===DB", "MongoDB is already connected");
//     return;
//   }

//   const mongoUri = process.env.MONGODB_URI;

//   if (!mongoUri) {
//     throw new Error("MONGODB_URI is not defined in the environment variables.");
//   }

//   try {
//     await mongoose.connect(mongoUri, {
//       dbName: "master_of_self",
//     });

//     isConnected = true;
//     console.log("===DB", "MongoDB is already connected");
//   } catch (error) {
//     console.log("===DB", error);
//     throw error;
//   }
// };
