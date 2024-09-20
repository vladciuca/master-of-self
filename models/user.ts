import { Schema, model, models, Document, Model } from "mongoose";

export interface UserInterface extends Document {
  email: string;
  username: string;
  image?: string; // Optional field
  settings: {
    steps: {
      gratefulStep: boolean;
      reflectionStep: boolean;
    };
    journalStartTime: {
      morning: string;
      evening: string;
    };
  };
}

const UserSchema = new Schema<UserInterface>({
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
  settings: {
    steps: {
      gratefulStep: Boolean,
      reflectionStep: Boolean,
    },
    journalStartTime: {
      morning: String,
      evening: String,
    },
  },
});

const User: Model<UserInterface> =
  models.User || model<UserInterface>("User", UserSchema);

export default User;
