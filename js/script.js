(() => {
  const taskInput = document.getElementById("task-input");
  const dateInput = document.getElementById("date-input");
  const form = document.getElementById("todo-form");
  const listEl = document.getElementById("todo-list");
  const filterSelect = document.getElementById("filter-select");
  const searchInput = document.getElementById("search-input");

  // Ambil data dari localStorage (kalau ada)
  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  /* ---------- Helpers ---------- */
  const save = () => localStorage.setItem("tasks", JSON.stringify(tasks));

  const createTaskElement = (task) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (task.completed ? " completed" : "");
    li.dataset.id = task.id;

    const left = document.createElement("div");
    const title = document.createElement("span");
    title.className = "title";
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `Due: ${task.due}`;

    left.append(title, meta);

    const right = document.createElement("div");

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = task.completed ? "Undo" : "Done";
    toggleBtn.onclick = () => toggleTaskCompletion(task.id);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTask(task.id);

    right.append(toggleBtn, delBtn);
    li.append(left, right);
    return li;
  };

  const render = () => {
    listEl.innerHTML = "";
    const filter = filterSelect.value;
    const keyword = searchInput.value.toLowerCase();

    tasks
      .filter(
        (t) =>
          filter === "all" ||
          (filter === "active" && !t.completed) ||
          (filter === "completed" && t.completed)
      )
      .filter((t) => t.title.toLowerCase().includes(keyword))
      .forEach((t) => listEl.appendChild(createTaskElement(t)));
  };

  /* ---------- CRUD ---------- */
  const addTask = (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    const due = dateInput.value;

    // Validasi
    if (!title) {
      alert("Please enter a task!");
      taskInput.focus();
      return;
    }
    if (!due) {
      alert("Please select a due date!");
      dateInput.focus();
      return;
    }
    const dueDate = new Date(due);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dueDate < today) {
      alert("Due date cannot be in the past!");
      return;
    }

    tasks.push({
      id: Date.now(),
      title,
      due,
      completed: false,
    });
    save();
    form.reset();
    render();
  };

  const toggleTaskCompletion = (id) => {
    tasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    save();
    render();
  };

  const deleteTask = (id) => {
    if (!confirm("Delete this task?")) return;
    tasks = tasks.filter((t) => t.id !== id);
    save();
    render();
  };

  /* ---------- Event listeners ---------- */
  form.addEventListener("submit", addTask);
  filterSelect.addEventListener("change", render);
  searchInput.addEventListener("input", render);

  // Mulai!
  render();
})();
