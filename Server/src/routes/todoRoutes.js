const express = require("express");
const router = express.Router();
const Todos = require("../models/todoModel");
const mongoose = require("mongoose");

// Read Todos data with sorting based on timestamp
router.get("/todos", async (req, res) => {
  const TodosData = await Todos.find().sort({ timestamp: -1 });
  res.json(TodosData);
});

// Read a specific product data
router.get("/todos/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const todoData = await Todos.findById(todoId);

    if (!todoData) {
      return res.status(404).json({ message: "Product not found!" });
    }
    res.status(200).json({ todoData: todoData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Create product

router.post("/todos", async (req, res) => {
  try {
    const todoData = new Todos({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      completed: req.body.completed,
    });

    const result = await todoData.save();
    res.json(result);
  } catch (error) {
    console.log("error : ", error);
    res.json({ error: "Something went wrong!" });
  }
});

// delete product
router.delete("/todos/:id", async (req, res) => {
  try {
    // req.params == {
    //   id: "3456780987345678909460876567";
    // }
    const todoId = req.params.id;
    const deletedTodo = await Todos.findByIdAndRemove(todoId);

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found!" });
    }

    return res.json({ message: "Todo data deleted successfuly!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// UpdateData

router.patch("/todos/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const dataToBeUpdate = new Todos({
      title: req.body.title,
      completed: req.body.completed,
    });

    const updatedData = await Todos.findByIdAndUpdate(todoId, dataToBeUpdate, {
      new: true,
    });

    if (!updatedData) {
      return res.status(404).json({ message: "Todo not found!" });
    }

    return res.json({ message: "Todo updated successfuly!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
