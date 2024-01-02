import { useQuery, useMutation, useQueryClient } from "react-query";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../../api/todosApi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faUpload } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);

  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    error,
    data: todos,
  } = useQuery("todos", getTodos, {
    select: (data) => data.sort((a, b) => b.timestamp - a.timestamp),
  });

  const addTodoMutation = useMutation(addTodo, {
    onSuccess: (newTodoData) => {
      // Manually prepend the new item to the existing list
      queryClient.setQueryData("todos", (prevData) => [
        newTodoData,
        ...prevData,
      ]);

      // Invalidate cache to refetch the updated data
      queryClient.invalidateQueries("todos");
      setNewTodo("");
      setEditingTodoId(null);
      toast.success("Todo added successfully!");
    },
  });

  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
      setNewTodo("");
      setEditingTodoId(null);
      toast.success("Todo updated successfully!");
    },
  });

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
      toast.success("Todo deleted successfully!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim() !== "") {
      if (editingTodoId !== null) {
        handleSaveEdit(todos.find((todo) => todo._id === editingTodoId));
      } else {
        addTodoMutation.mutate({ title: newTodo.trim(), completed: false });
      }
      setNewTodo("");
      setEditingTodoId(null);
    } else {
      toast.error("Todo cannot be empty!");
    }
  };

  const handleEdit = (todoId, currentTitle) => {
    setEditingTodoId(todoId);
    setNewTodo(currentTitle);
  };

  const handleSaveEdit = (todo) => {
    updateTodoMutation.mutate({ ...todo, title: newTodo });
  };
  const newItemSection = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="new-todo">Enter a new todo item</label>
      <div className="new-todo">
        <input
          type="text"
          id="new-todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
        />
      </div>
      <button className="submit">
        <FontAwesomeIcon icon={faUpload} />
      </button>
    </form>
  );

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  } else {
    content = todos.map((todo) => {
      return (
        <article key={todo._id}>
          <div className="todo">
            <input
              type="checkbox"
              checked={todo.completed}
              id={todo._id}
              onChange={() =>
                updateTodoMutation.mutate({
                  ...todo,
                  completed: !todo.completed,
                })
              }
            />
            <label htmlFor={todo._id}>{todo.title}</label>
          </div>
          <div className="icons">
            <button
              className="edit"
              onClick={() => handleEdit(todo._id, todo.title)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className="trash"
              onClick={() => deleteTodoMutation.mutate({ id: todo._id })}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </article>
      );
    });
  }

  return (
    <main>
      <ToastContainer position="bottom-right" />
      <h1>Todo List</h1>
      {newItemSection}
      {content}
    </main>
  );
};

export default TodoList;
