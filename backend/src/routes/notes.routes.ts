import { Router } from "express";

import {
  createNoteFromLink,
  getNotes,
  updateNote,
  deleteNote,
} from "../controllers/notes.controller";

const router = Router();

/**
 * POST /api/notes/from-link
 * Create a note from a URL
 */
router.post("/from-link", createNoteFromLink);

/**
 * GET /api/notes
 * Fetch all notes
 */
router.get("/", getNotes);

/**
 * PUT /api/notes/:id
 * Update a note
 */
router.put("/:id", updateNote);

/**
 * DELETE /api/notes/:id
 * Delete a note
 */
router.delete("/:id", deleteNote);

export default router;