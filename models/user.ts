import { Schema, model, models, Document, Model } from "mongoose";

interface UserType extends Document {
  email: string;
  username: string;
  image?: string; // Optional field
  // TODO: completely remove categories
  stats: {
    mind: number;
    body: number;
    spirit: number;
  };
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
  stats: {
    mind: {
      type: Number,
      default: 0,
    },
    body: {
      type: Number,
      default: 0,
    },
    spirit: {
      type: Number,
      default: 0,
    },
  },
});

const User: Model<UserType> =
  models.User || model<UserType>("User", UserSchema);

export default User;
