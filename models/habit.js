import { Schema, model, models } from "mongoose";

const HabitSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  icon: {
    type: String,
  },
  description: {
    type: String,
    required: [true, "Description is required."],
  },
  categories: {
    type: Array,
    required: [true, "Must select a Category"],
  },
  resource: {
    type: Number,
    default: 0,
  },
});

const Habit = models.Habit || model("Habit", HabitSchema);

export default Habit;
