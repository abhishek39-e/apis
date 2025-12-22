const express = require("express");
const User = require("../models/Users");
const router = express.Router();

// GET users (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { name, password } = req.query;
    let filter = {};

    if (name) filter.name = name;
    if (password) filter.password = password;

    const users = await User.find(filter);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE user
router.post("/", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        message: "Name and Password are required",
      });
    }

    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const newUser = new User({ name, password });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully ✅",
      user: savedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user
router.put("/", async (req, res) => {
  try {
    const { id, name, password } = req.query;
    const updateData = req.body;

    let updatedUser;

    if (id) {
      updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    } else if (name) {
      updatedUser = await User.findOneAndUpdate(
        { name },
        updateData,
        { new: true }
      );
    } else if (password) {
      updatedUser = await User.findOneAndUpdate(
        { password },
        updateData,
        { new: true }
      );
    } else {
      return res.status(400).json({
        message: "Provide id or name or password",
      });
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully ✅",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
router.delete("/", async (req, res) => {
  try {
    const { id, name, password } = req.query;
    let deletedUser;

    if (id) {
      deletedUser = await User.findByIdAndDelete(id);
    } else if (name) {
      deletedUser = await User.findOneAndDelete({ name });
    } else if (password) {
      deletedUser = await User.findOneAndDelete({ password });
    } else {
      return res.status(400).json({
        message: "Provide id or name or password",
      });
    }

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully ✅",
      user: deletedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

console.log("✅ UsersRoutes loaded");
module.exports = router;
