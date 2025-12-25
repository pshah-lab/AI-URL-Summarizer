import Note from "../models/note.model";

export interface CreateNoteInput {
  url: string;
  urlHash: string;
  title: string;
  topics: string[];
  summary: string;
}

/**
 * Finds an existing note by URL hash (duplicate detection)
 */
export const findNoteByUrlHash = async (urlHash: string) => {
  return Note.findOne({ urlHash }).lean().exec();
};

/**
 * Creates and saves a new note
 */
export const createNote = async (data: CreateNoteInput) => {
  const note = new Note({
    url: data.url,
    urlHash: data.urlHash,
    title: data.title,
    topics: data.topics,
    summary: data.summary,
  });

  return note.save();
};

/**
 * Fetch all notes (latest first)
 */
export const getAllNotes = async () => {
  return Note.find().sort({ createdAt: -1 }).lean().exec();
};

/**
 * Update an existing note
 */
export const updateNoteById = async (
  noteId: string,
  update: Partial<Pick<CreateNoteInput, "title" | "topics" | "summary">>
) => {
  return Note.findByIdAndUpdate(noteId, update, {
    new: true,
  })
    .lean()
    .exec();
};

/**
 * Delete a note
 */
export const deleteNoteById = async (noteId: string) => {
  return Note.findByIdAndDelete(noteId).lean().exec();
};