import { Schema, model, models } from "mongoose";

const JournalEntrySchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  gratefulItems: {
    type: Array,
    required: [true, "Must be grateful for at least one thing"],
  },
});

const JournalEntry =
  models.JournalEntry || model("JournalEntry", JournalEntrySchema);

export default JournalEntry;
