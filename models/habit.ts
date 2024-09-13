import { Schema, model, models, Document, Model } from "mongoose";

interface HabitInterface extends Document {
  creator: Schema.Types.ObjectId;
  name: string;
  icon: string;
  description: string;
  xp: number;
}

const HabitSchema = new Schema<HabitInterface>({
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

const Habit: Model<HabitInterface> =
  models.Habit || model<HabitInterface>("Habit", HabitSchema);

export default Habit;
