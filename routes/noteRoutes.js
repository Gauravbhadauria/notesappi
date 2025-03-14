const express = require("express");
const Note = require("../models/Note");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Add Note
router.post("/", authenticate, async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = new Note({ userId: req.user.userId, title, content });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: "Error adding note" });
  }
});

// Get Notes
router.get("/", authenticate, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching notes" });
  }
});

// Update Note
router.put("/:id", authenticate, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: "Error updating note" });
  }
});

// Delete Note
router.delete("/:id", authenticate, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Error deleting note" });
  }
});

module.exports = router;
