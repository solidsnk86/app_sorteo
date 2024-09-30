// Seleccionando elementos usando clases e ids
const inputMember = document.querySelector(".members-form #member");
const formMembers = document.querySelector(".members-form");
const formTasks = document.querySelector(".task-form");
const shuffleBtn = document.querySelector("#shuffle");
const shuffleResult = document.querySelector(".shuffle-result");
const membersList = document.querySelector("#members-list");
const tasksList = document.querySelector("#tasks-list");
const resetBtn = document.querySelector("#reset");
const shareBtn = document.querySelector(".share-btn");
const addButton = document.querySelector("#submit-member, #submit-task");
const isDesktop = navigator.userAgent.includes("Windows NT 10.0");
const copyBtn = document.querySelector(".copy-btn");
const copiedBtn = document.querySelector(".copied");

/**
 * Función para formatear la fecha y la hora
 * @param { Date | number | string } d
 * @returns
 */
function formatDate(d) {
  const date = new Date(d).toLocaleDateString("ES-es", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return date;
}

const formatedDateString = formatDate(Date.now()).replace(/,/, " a las");

// Arrays vacíos y cadena de texto inicializada que más adelante se llevarán el resultado
const members = [];
const tasks = [];
let shuffledResult = `Sorteo del día ${formatedDateString}\n`;

// Títulos del botón
addButton.setAttribute("title", "Agregar Item");
shuffleBtn.setAttribute("title", "Sortear");
resetBtn.setAttribute("title", "Resetear");
shareBtn.setAttribute("title", "Compartir");
copyBtn.setAttribute("title", "Copiar");

/**
 * Función para guardar en el localstorage
 * @param { string } key
 * @param { Array<[]> | string } value
 */
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

/**
 * Función reutilizable para actualizar la lista de ambos ítems
 * @param { Array<[]> } listElement
 * @param { Array<[]> } array
 */
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
    shuffledResult = "";
    localStorage.clear();
  } else {
    alert("Nada para resetear.");
  }
});

// Función para sorteo de los miembros y las tareas
const shuffle = (members, tasks) => {
  // Uso del operador de propagación, con la función sort y math random para mezclar
  const shuffledMembers = [...members].sort(() => Math.random() - 0.5);
  const shuffledTasks = [...tasks].sort(() => Math.random() - 0.5);

  // Devuelve el miembro y la tarea mapeando cada uno de ellos con un índice
  // que se divide el índice de la tarea por la longitud de las tares mezcladas
  /**
   * El operador % (módulo) asegura que el índice de la tarea vuelva al
   * principio del arreglo shuffledTasks cuando
   * se alcanzan todas las tareas, permitiendo que las tareas se asignen
   * cíclicamente a los miembros si hay más miembros que tareas.
   */
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

  // Se ingresa al DOM los elementos ya sorteados con su índice
  const results = shuffle(members, tasks);
  shuffleResult.innerHTML = "";
  results.forEach(({ member, task }, index) => {
    shuffleResult.innerHTML += `
      <div class="shuffled-result" style="${
        index % 2 === 0
          ? "background-color: #222222"
          : "background-color: #292929"
      }">
        <p>${index + 1}. ${member} realizará la tarea: ${task}</p>
      </div>`;
    shuffledResult += `${index + 1}. ${member} le corresponde: ${task}\n`;
  });
});
// Función para compartir los resultados
shareBtn.onclick = async () => {
  if (navigator.share) {
    await navigator.share({
      title: document.title,
      text:
        shuffledResult === `Sorteo del día ${formatedDateString}\n`
          ? "Puedes usar ésta aplicación para realizar sorteos entre integrantes de equipo o grupo."
          : shuffledResult.trim(),
      url: window.location.href,
    });
  }
};
// Función asíncrona para copiar contenido al portapapeles
/**
 *
 * @param { string } content
 */
const copyToClipboard = async (content) => {
  try {
    await navigator.clipboard.writeText(content);
    copyBtn.style.display = "none";
    copiedBtn.style.display = "flex";

    const setButton = setInterval(() => {
      copiedBtn.style.display = "none";
      copyBtn.style.display = "flex";

      return () => clearInterval(setButton);
    }, 2300);
  } catch (e) {
    alert("Error al copiar en el portapapeles.");
  }
};

copyBtn.onclick = async () => {
  if (shuffledResult !== `Sorteo del día ${formatedDateString}\n`) {
    await copyToClipboard(shuffledResult);
  } else {
    alert("No hay contenido para copiar al portapapeles!");
  }
};
