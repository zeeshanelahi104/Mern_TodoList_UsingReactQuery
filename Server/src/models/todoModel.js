const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.ObjectId,
    title: String,
    completed: Boolean,
    timestamp: { type: Date, default: Date.now },
  },
  // Mongoose is trying to be smart by making your collection name plural.
  // You can however force it to be whatever you want by adding below code
  // to the schema
  { collection: "todos", versionKey: false }
);

const Todos = mongoose.model("todos", todoSchema);

module.exports = Todos;
