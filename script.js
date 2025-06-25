const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const filters = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clear-completed");

let todos = [];

// === THEME TOGGLE ===
themeToggle.addEventListener("click", () => {
  const isDark = body.classList.contains("dark-theme");
  body.classList.toggle("dark-theme", !isDark);
  body.classList.toggle("light-theme", isDark);
  themeIcon.src = isDark ? "images/icon-moon.svg" : "images/icon-sun.svg";
});

// === ADD NEW TODO ===
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  todos.push({ text, completed: false });
  todoInput.value = "";
  renderTodos(getActiveFilter());
});

// === RENDER TODOS ===
function renderTodos(filter = "all") {
  todoList.innerHTML = "";

  const filtered = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  filtered.forEach((todo, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox"); // ✅ Apply custom circle style
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      todos[index].completed = !todos[index].completed;
      renderTodos(getActiveFilter());
    });

    const span = document.createElement("span");
    span.textContent = todo.text;
    if (todo.completed) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.5";
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<img src="images/icon-cross.svg" alt="Delete">';
    deleteBtn.addEventListener("click", () => {
      todos.splice(index, 1);
      renderTodos(getActiveFilter());
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });

  updateItemsLeft();
}

// === UPDATE COUNTER ===
function updateItemsLeft() {
  const activeCount = todos.filter(todo => !todo.completed).length;
  itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? "s" : ""} left`;
}

// === FILTER BUTTONS ===
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTodos(btn.dataset.filter);
  });
});

function getActiveFilter() {
  const activeBtn = document.querySelector(".filter.active");
  return activeBtn?.dataset.filter || "all";
}

// === CLEAR COMPLETED ===
clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter(todo => !todo.completed);
  renderTodos(getActiveFilter());
});
