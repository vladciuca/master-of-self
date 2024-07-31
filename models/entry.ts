import { Schema, model, models, Document, Model } from "mongoose";

interface IJournalEntry extends Document {
  creator: Schema.Types.ObjectId;
  createDate: Date;
  dayEntry: Object;
  nightEntry: Object;
}

const JournalEntrySchema = new Schema<IJournalEntry>({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  dayEntry: {
    type: Object,
    default: {},
  },
  nightEntry: {
    type: Object,
    default: {},
  },
});

const JournalEntry: Model<IJournalEntry> =
  models.JournalEntry || model<IJournalEntry>("Habit", JournalEntrySchema);

export default JournalEntry;
