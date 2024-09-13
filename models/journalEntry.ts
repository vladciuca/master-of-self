import { Schema, model, models, Document, Model } from "mongoose";

export interface JournalEntryInterface extends Document {
  creator: Schema.Types.ObjectId;
  createDate: Date;
  dailyWillpower: Number;
  bonusWillpower: Number;
  dayEntry: Object;
  nightEntry: Object;
}

const JournalEntrySchema = new Schema<JournalEntryInterface>({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  dailyWillpower: {
    type: Number,
    default: 0,
  },
  bonusWillpower: {
    type: Number,
    default: 0,
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

const JournalEntry: Model<JournalEntryInterface> =
  models.JournalEntry ||
  model<JournalEntryInterface>("JournalEntry", JournalEntrySchema);

export default JournalEntry;
