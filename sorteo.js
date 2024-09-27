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

// Función para guardar en el localstorage
function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Evento del formulario para agregar los nombres de los integrantes
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

// Envento para agregar las tareas de los integrantes
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

// Función reutilizable para actualizar la lista
function updateList(listElement, array) {
  listElement.innerHTML = "";
  array.forEach((item, index) => {
    const p = document.createElement("p");
    p.textContent = `${index + 1}. ${item}`;
    listElement.appendChild(p);
  });
}

// Botón de reseteo de los campos y del localstorage con condicionales
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

// Función para sorteo de los miembros y las tareas
const shuffle = (members, tasks) => {
  const shuffledMembers = [...members].sort(() => Math.random() - 0.5); // Uso del operador de propagación, con la función sort y math random
  const shuffledTasks = [...tasks].sort(() => Math.random() - 0.5);

  // Devuelve el miembro y la tarea mapeando cada uno de ellos con un índice
  // que se divide por la longitud de las tares mezcladas
  return shuffledMembers.map((member, index) => {
    return { member, task: shuffledTasks[index % shuffledTasks.length] };
  });
};

// Botón para realizar el sorteo con condicional
shuffleBtn.addEventListener("click", () => {
  if (members.length === 0 || tasks.length === 0) {
    alert("No hay demasiados miembros o tareas para el sorteo.");
    return;
  }

  // Se ingresa al DOM los elementos ya sorteados
  const results = shuffle(members, tasks);
  shuffleResult.innerHTML = "";
  results.forEach(({ member, task }, index) => {
    shuffleResult.innerHTML += `
      <div>
        <p>${index + 1}. ${member} realizará la tarea: ${task}</p>
      </div>`;
  });
});
