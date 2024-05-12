import { Schema, model, models } from "mongoose";

const JournalEntrySchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  gratefulItems: {
    type: Array,
    required: [true, "Must be grateful for at least one thing"],
  },
  habitWillpower: {
    type: Object,
    default: {},
  },
});

const JournalEntry =
  models.JournalEntry || model("JournalEntry", JournalEntrySchema);

export default JournalEntry;
