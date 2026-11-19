import './App.css'

function App() {
  // A list of tasks. For now it's fixed, and in the next step React will manage it.
  const todos = [
    { id: 1, text: 'Finish SaiKet Task 3', done: false },
    { id: 2, text: 'Post on LinkedIn', done: true },
    { id: 3, text: 'Learn React state', done: false },
  ]

  return (
    <div className="app">
      <div className="todo-card">
        <h1>My To-Do List</h1>
        <p className="subtitle">Stay on top of your day</p>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.done ? 'todo-item done' : 'todo-item'}>
              {todo.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App