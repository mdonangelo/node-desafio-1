const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  if(!user) {
    return response.status(404).json({ error: "User not found"})
  }

  request.user = user;

  return next(); 
}

function checksExistsUserTodos(request, response, next) {
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);
  if(!todo) {
    return response.status(404).json({error: "Todo does not exist"})
  }

  request.todo = todo;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const usernameAlreadyExists = users.find(
    (user) => user.username === username
  );

  if(usernameAlreadyExists) {
    response.status(400).json({ error: "Username already exists"})
  }
  
  users.push({
    id: uuidv4,
    name,
    username,
    todos: []
  });

  return response.status(201).send();

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;
  
  const insertTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(insertTodo);

  return response.status(201).json(insertTodo);
  
});

app.put('/todos/:id', checksExistsUserAccount, checksExistsUserTodos, (request, response) => {
  // Complete aqui
  const { todo } = request;
  const { title, deadline } = request.body;

  todo.title = title;
  todo.deadline = deadline;

  return response.json(todo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, checksExistsUserTodos, (request, response) => {
  // Complete aqui
  const { todo } = request;

  todo.done = true;

  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user, todo } = request;
  user.todos.splice(todo, 1);

  return response.status(204).json(todo);
});

module.exports = app;