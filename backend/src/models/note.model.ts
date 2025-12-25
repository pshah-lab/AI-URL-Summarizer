import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  url: string;
  urlHash: string;
  title: string;
  topics: string[];
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    urlHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topics: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model<INote>("Note", NoteSchema);

export default Note;