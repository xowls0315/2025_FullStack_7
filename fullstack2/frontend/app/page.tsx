"use client";

import { useState } from "react";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: TodoItem = {
        id: Date.now(),
        text: inputValue,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex mb-4">
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="flex-1 border rounded-l px-2 py-1" placeholder="새로운 할 일을 입력하세요" />
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-1 rounded-r hover:bg-blue-600">
          추가
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} className="mr-2" />
              <span className={todo.completed ? "line-through text-gray-500" : ""}>{todo.text}</span>
            </div>
            <button onClick={() => deleteTodo(todo.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
