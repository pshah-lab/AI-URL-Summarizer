import { Request, Response } from "express";

import { isValidURL } from "../utils/urlValidator";
import { generateUrlHash } from "../utils/hashGenerator";

import { fetchHTML } from "../services/fetch.service";
import { extractTextFromHTML } from "../services/extract.service";
import { chunkText } from "../services/chunk.service";
import { generateStructuredSummary } from "../services/ai.service";
import {
  findNoteByUrlHash,
  createNote,
  getAllNotes,
  updateNoteById,
  deleteNoteById,
} from "../services/notes.service";

/**
 * POST /api/notes/from-link
 * Create a note from a URL
 */
export const createNoteFromLink = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ message: "URL is required" });
    }

    if (!isValidURL(url)) {
      return res.status(400).json({ message: "Invalid or unsafe URL" });
    }

    const urlHash = generateUrlHash(url);

    // Check for duplicate note
    const existingNote = await findNoteByUrlHash(urlHash);
    if (existingNote) {
      return res.status(200).json(existingNote);
    }

    // Fetch + extract content
    const html = await fetchHTML(url);
    const extractedText = extractTextFromHTML(html);

    if (!extractedText || extractedText.length < 200) {
      return res
        .status(400)
        .json({ message: "Insufficient readable content at URL" });
    }

    // Chunk content for AI
    const chunks = chunkText(extractedText);

    // AI summarization
    const aiResult = await generateStructuredSummary(chunks);

    // Save note
    const savedNote = await createNote({
      url,
      urlHash,
      title: aiResult.title,
      topics: aiResult.topics,
      summary: aiResult.summary,
    });

    return res.status(201).json(savedNote);
  } catch (error: any) {
    console.error("CreateNote Error:", error.message);
    return res.status(500).json({ message: "Failed to create note" });
  }
};

/**
 * GET /api/notes
 * Fetch all notes
 */
export const getNotes = async (_req: Request, res: Response) => {
  try {
    const notes = await getAllNotes();
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notes" });
  }
};

/**
 * PUT /api/notes/:id
 * Update a note
 */
export const updateNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, topics, summary } = req.body;

    const updated = await updateNoteById(id, { title, topics, summary });

    if (!updated) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json(updated);
  } catch {
    return res.status(500).json({ message: "Failed to update note" });
  }
};

/**
 * DELETE /api/notes/:id
 * Delete a note
 */
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await deleteNoteById(id);

    if (!deleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Failed to delete note" });
  }
};