document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const taskTitle = document.getElementById('task-title');
    const taskPriority = document.getElementById('task-priority');
    const themeToggle = document.getElementById('theme-toggle');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
  
    const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));
  
    // Add Task
    document.getElementById('add-task').addEventListener('click', () => {
      const title = taskTitle.value.trim();
      const priority = taskPriority.value;
      if (title) {
        tasks.push({ title, priority, completed: false });
        saveTasks();
        renderTasks();
        taskTitle.value = '';
      }
    });
  
    // Render Tasks
    const renderTasks = () => {
      taskList.innerHTML = '';
      tasks
        .filter(task => currentFilter === 'all' || 
                (currentFilter === 'active' && !task.completed) ||
                (currentFilter === 'completed' && task.completed))
        .sort((a, b) => ['low', 'medium', 'high'].indexOf(a.priority) - ['low', 'medium', 'high'].indexOf(b.priority))
        .forEach((task, index) => {
          const li = document.createElement('li');
          li.classList.add(task.priority);
  
          const taskTitle = document.createElement('span');
          taskTitle.textContent = task.title;
          taskTitle.className = task.completed ? 'completed' : '';
  
          const completeButton = document.createElement('button');
          completeButton.textContent = task.completed ? 'Undo' : 'Done';
          completeButton.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
          });
  
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
          });
  
          li.append(taskTitle, completeButton, deleteButton);
          taskList.appendChild(li);
        });
    };
  
    // Filter Tasks
    document.querySelectorAll('.filter').forEach(button => {
      button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;
        renderTasks();
      });
    });
  
    // Sort Tasks by Priority
    document.getElementById('sort-tasks').addEventListener('click', () => {
      tasks.sort((a, b) => 
        ['low', 'medium', 'high'].indexOf(a.priority) - ['low', 'medium', 'high'].indexOf(b.priority)
      );
      saveTasks();
      renderTasks();
    });
  
    // Toggle Dark Mode
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
  
    // Load Theme
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
    }
  
    renderTasks();
  });
  