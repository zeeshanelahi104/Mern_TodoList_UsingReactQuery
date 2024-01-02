// import { useQuery, useMutation, useQueryClient } from "react-query";
// import { getTodos, addTodo, updateTodo, deleteTodo } from "../../api/todosApi";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
// import { useState } from "react";

// const TodoList = () => {
//   const [newTodo, setNewTodo] = useState("");
//   const queryClient = useQueryClient();

//   const {
//     isLoading,
//     isError,
//     error,
//     data: todos,
//   } = useQuery("todos", getTodos, {
//     select: (data) => data.sort((a, b) => b._id - a._id),
//   });

//   const addTodoMutation = useMutation(addTodo, {
//     onSuccess: () => {
//       // Invalidates cache and refetch
//       queryClient.invalidateQueries("todos");
//     },
//   });

//   const updateTodoMutation = useMutation(updateTodo, {
//     onSuccess: () => {
//       // Invalidates cache and refetch
//       queryClient.invalidateQueries("todos");
//     },
//   });

//   const deleteTodoMutation = useMutation(deleteTodo, {
//     onSuccess: () => {
//       // Invalidates cache and refetch
//       queryClient.invalidateQueries("todos");
//     },
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     addTodoMutation.mutate({ title: newTodo, completed: false });
//     setNewTodo("");
//   };

//   const newItemSection = (
//     <form onSubmit={handleSubmit}>
//       <label htmlFor="new-todo">Enter a new todo item</label>
//       <div className="new-todo">
//         <input
//           type="text"
//           id="new-todo"
//           value={newTodo}
//           onChange={(e) => setNewTodo(e.target.value)}
//           placeholder="Enter new todo"
//         />
//       </div>
//       <button className="submit">
//         <FontAwesomeIcon icon={faUpload} />
//       </button>
//     </form>
//   );

//   let content;
//   if (isLoading) {
//     content = <p>Loading...</p>;
//   } else if (isError) {
//     content = <p>{error.message}</p>;
//   } else {
//     content = todos.map((todo) => {
//       return (
//         <article key={todo._id}>
//           <div className="todo">
//             <input
//               type="checkbox"
//               checked={todo.completed}
//               id={todo._id}
//               onChange={() =>
//                 updateTodoMutation.mutate({
//                   ...todo,
//                   completed: !todo.completed,
//                 })
//               }
//             />
//             <label htmlFor={todo._id}>{todo.title}</label>
//           </div>
//           <button
//             className="trash"
//             onClick={() => deleteTodoMutation.mutate({ id: todo._id })}
//           >
//             <FontAwesomeIcon icon={faTrash} />
//           </button>
//         </article>
//       );
//     });
//   }

//   return (
//     <main>
//       <h1>Todo List</h1>
//       {newItemSection}
//       {content}
//     </main>
//   );
// };
// export default TodoList;
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../../api/todosApi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");
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
    },
  });

  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodoMutation.mutate({ title: newTodo, completed: false });
    setNewTodo("");
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
          <button
            className="trash"
            onClick={() => deleteTodoMutation.mutate({ id: todo._id })}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </article>
      );
    });
  }

  return (
    <main>
      <h1>Todo List</h1>
      {newItemSection}
      {content}
    </main>
  );
};

export default TodoList;