import { Schema, model, models, Document, Model } from "mongoose";

interface UserType extends Document {
  email: string;
  username: string;
  image?: string; // Optional field
}
const UserSchema = new Schema<UserType>({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    // match: [
    //   /^[a-zA-Z0-9]{8,12}$/,
    //   "Username invalid, it should contain 8-12 alphanumeric letters and be unique!",
    // ],
  },
  image: {
    type: String,
  },
});

const User: Model<UserType> =
  models.User || model<UserType>("User", UserSchema);

export default User;
