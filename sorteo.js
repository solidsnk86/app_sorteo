// Seleccionando elementos usando clases
const inputMember = document.querySelector(".members-form #member");
const formMembers = document.querySelector(".members-form");
const formTasks = document.querySelector(".task-form");
const shuffleBtn = document.querySelector("#shuffle");
const shuffleResult = document.querySelector(".shuffle-result");
const membersList = document.querySelector("#members-list");
const tasksList = document.querySelector("#tasks-list");
const resetBtn = document.querySelector("#reset");

const members = [];
const tasks = [];

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

formMembers.addEventListener("submit", (event) => {
  event.preventDefault();
  if (inputMember.value.trim() !== "") {
    members.push(inputMember.value.trim());
    updateList(membersList, members);
    saveToLocalStorage("members", members);
  } else {
    alert("No se ingresaron nombres!");
  }
  formMembers.reset();
});

formTasks.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputTask = document.querySelector(".task-form #task");
  if (inputTask.value.trim() !== "") {
    tasks.push(inputTask.value.trim());
    updateList(tasksList, tasks);
    saveToLocalStorage("tasks", tasks);
  } else {
    alert("No se han ingresado tareas!");
  }
  formTasks.reset();
});

function updateList(listElement, array) {
  listElement.innerHTML = "";
  array.forEach((item, index) => {
    const p = document.createElement("p");
    p.textContent = `${index + 1}. ${item}`;
    listElement.appendChild(p);
  });
}

resetBtn.addEventListener("click", () => {
  if (members.length > 0 || tasks.length > 0) {
    members.length = 0;
    tasks.length = 0;
    membersList.innerHTML = "";
    tasksList.innerHTML = "";
    shuffleResult.innerHTML = "";
    localStorage.clear();
  } else {
    alert("Nada para resetear.");
  }
});

const shuffle = (members, tasks) => {
  const shuffledMembers = [...members].sort(() => Math.random() - 0.5);
  const shuffledTasks = [...tasks].sort(() => Math.random() - 0.5);

  return shuffledMembers.map((member, index) => {
    return { member, task: shuffledTasks[index % shuffledTasks.length] };
  });
};

shuffleBtn.addEventListener("click", () => {
  if (members.length === 0 || tasks.length === 0) {
    alert("No hay demasiados miembros o tareas para el sorteo.");
    return;
  }

  const results = shuffle(members, tasks);
  shuffleResult.innerHTML = "";
  results.forEach(({ member, task }, index) => {
    shuffleResult.innerHTML += `
      <div>
        <p>${index + 1}. ${member} realizará la tarea: ${task}</p>
      </div>`;
  });
});
