const express = require("express");
const User = require("../models/Users");
const router = express.Router();

router.get("/", async (req, res) => {
  console.log("QUERY:", req.query);

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

router.get("/:id", async (req, res) => {
  try {
    const usId = await User.findById(req.params.id);
    res.json(usId);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({
        messange: "Name and Password are required",
      });
    }
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
    const NewUser = new User({
      name,
      password,
    });
    const savedUser = await NewUser.save();
    res.status(201).json({
      message: "User created successfully ✅",
      user: savedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update req

router.put("/", async (req, res) => {
  try {
    const { id, name, password } = req.query;
    const updateData = req.body;
    let updatedUser;

    if (id) {
      updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    } else if ({ name }) {
      updatedUser = await User.findByIdAndUpdate({ name }, updateData, {
        new: true,
      });
    } else if ({ password }) {
      updatedUser = await User.findByIdAndUpdate({ password }, updateData, {
        new: true,
      });
    } else {
      return res.status(404).json({
        message: "Please provide id or name or password",
      });
    }
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User updated successfully ✅",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete user
router.delete("/", async (req, res) => {
  try {
    const { id, name, password } = req.query;
    let deleteUser;
    if (id) {
      deleteUser = await User.findByIdAndDelete(id);
    } else if (name) {
      deleteUser = await User.findOneAndDelete({ name });
    } else if (password) {
      deleteUser = await User.findOneAndDelete({ password });
    } else {
      return res.status(404).json({
        message: "Please provide id or name or password",
      });
    }
    if (!deleteUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully ✅",
      users: deleteUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

console.log("✅ UsersRoutes file loaded");
module.exports = router;
