import axios from "axios";

const todosApi = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: "https://mern-todo-list-using-react-query-server.vercel.app/",
});

export const getTodos = async () => {
  const response = await todosApi.get("/todos");
  return response.data;
};

export const addTodo = async (todo) => {
  return await todosApi.post("/todos", todo);
};

export const updateTodo = async (todo) => {
  return await todosApi.patch(`/todos/${todo._id}`, todo);
};

export const deleteTodo = async ({ id }) => {
  return await todosApi.delete(`/todos/${id}`, id);
};

export default todosApi;
