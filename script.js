// === DOM SELECTORS ===
const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const filters = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clear-completed");

const todos = [];

// === INIT ===
window.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  renderTodos(getActiveFilter());
});

// === EVENT LISTENERS ===
themeToggle.addEventListener("click", toggleTheme);
todoForm.addEventListener("submit", handleNewTodo);
clearCompletedBtn.addEventListener("click", clearCompletedTodos);
filters.forEach(btn => {
  btn.addEventListener("click", handleFilterClick);
});

// === FUNCTIONS ===

// Handle theme toggle (light/dark)
function toggleTheme() {
  const isDark = body.classList.contains("dark-theme");
  body.classList.toggle("dark-theme", !isDark);
  body.classList.toggle("light-theme", isDark);
  themeIcon.src = isDark ? "images/icon-moon.svg" : "images/icon-sun.svg";
}

// Handle form submission
function handleNewTodo(e) {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  todos.push({ text, completed: false });
  todoInput.value = "";
  saveTodos();
  renderTodos(getActiveFilter());
}

// Render todos based on filter
function renderTodos(filter = "all") {
  todoList.innerHTML = "";

  const filtered = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  filtered.forEach((todo, index) => {
    const li = document.createElement("li");

    // Custom checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      todos[index].completed = !todos[index].completed;
      saveTodos();
      renderTodos(getActiveFilter());
    });

    // Text
    const span = document.createElement("span");
    span.textContent = todo.text;
    if (todo.completed) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.5";
    }

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<img src="images/icon-cross.svg" alt="Delete">';
    deleteBtn.addEventListener("click", () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos(getActiveFilter());
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });

  updateItemsLeft();
}

// Update items left count
function updateItemsLeft() {
  const activeCount = todos.filter(todo => !todo.completed).length;
  itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? "s" : ""} left`;
}

// Clear completed todos
function clearCompletedTodos() {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  renderTodos(getActiveFilter());
}

// Handle filter clicks
function handleFilterClick(e) {
  filters.forEach(b => b.classList.remove("active"));
  e.target.classList.add("active");
  renderTodos(getActiveFilter());
}

// Get current filter state
function getActiveFilter() {
  const activeBtn = document.querySelector(".filter.active");
  return activeBtn?.dataset.filter || "all";
}

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Load todos from localStorage
function loadTodos() {
  const stored = localStorage.getItem("todos");
  if (stored) {
    todos = JSON.parse(stored);
  }
}
