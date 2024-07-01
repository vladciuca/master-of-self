import { Schema, model, models, Document, Model } from "mongoose";

interface IUser extends Document {
  email: string;
  username: string;
  image?: string; // Optional field
  // TODO: remove after flow redesign
  stats: {
    mind: number;
    body: number;
    spirit: number;
  };
}
const UserSchema = new Schema<IUser>({
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

const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);

export default User;
