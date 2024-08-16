import { Schema, model, models, Document, Model } from "mongoose";

interface HabitType extends Document {
  creator: Schema.Types.ObjectId;
  name: string;
  icon: string;
  description: string;
  xp: number;
}

const HabitSchema = new Schema<HabitType>({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  icon: {
    type: String,
    required: [true, "Icon is required."],
  },
  description: {
    type: String,
    required: [true, "Description is required."],
  },
  xp: {
    type: Number,
    default: 0,
  },
});

const Habit: Model<HabitType> =
  models.Habit || model<HabitType>("Habit", HabitSchema);

export default Habit;
