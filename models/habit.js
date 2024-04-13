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
  description: {
    type: String,
    required: [true, "Description is required."],
  },
  categories: {
    type: Array,
    required: [true, "Must select a Category"],
  },
});

const Habit = models.Habit || model("Habit", HabitSchema);

export default Habit;
