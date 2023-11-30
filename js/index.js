//Declarando como variaveis as ids que marquei no html para dinamizar o código
const form = document.querySelector("#todo-form");
const taskTitleInput = document.querySelector("#task-title-input");
const todoListUl = document.querySelector("#todo-list");

const audio = document.querySelector("audio");
audio.volume = 0.1;

const musicControl = document.querySelector(".music-control");

//uma variavel em array que vai guardar as tarefas que formos adicionando
// porém iremos transformar ela em um array de objetos para guardar
// o título da tarefa e o booleano se a tarefa ta concluída (true) ou não (false)
//a alteração vai começar no tasks.push
let tasks = [];

musicControl.addEventListener("click", (event) => {
  event.stopPropagation();
  event.target.src = `${event.target.src}`.includes("on.png")
    ? "css/imagens/off.png"
    : "css/imagens/on.png";

  `${event.target.src}`.includes("on.png") ? audio.play() : audio.pause();
});

function renderTaskOnHtml(taskTitle, done = false) {
  //adicionar agora no html
  //criando uma tag li, pois ela é a filha do ul,no js e pega o conteúdo em texto dela e joga pro task title
  const li = document.createElement("li");

  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");

  //criando a lógica do evento de concluido a tarefa
  input.addEventListener("change", (event) => {
    const liToToggle = event.target.parentElement;

    //saber se a tarefa está sendo marcada como concluida ou não
    const spanToToggle = liToToggle.querySelector("span");

    const done = event.target.checked; //se a tarefa estiver marcada como concluída iremos riscar:
    if (done) {
      spanToToggle.style.textDecoration = "line-through";
    }
    if (done) {
      displayRandomCharacterImage();
    } else {
      spanToToggle.style.textDecoration = "none";
    }

    input.checked = done;

    //alterar no console de false pra true ao ser marcado o checkbox
    tasks = tasks.map((task) => {
      //se o titulo da tarefa que percorri for igual o titulo da tarefa que modifiquei em spanToToggle
      //retorna o mesmo título, porém com o done invertido (true || false)
      if (task.title === spanToToggle.textContent) {
        return {
          title: task.title,
          done: !task.done,
        };
      }

      return task;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  input.checked = done;

  const span = document.createElement("span");
  span.textContent = taskTitle;

  if (done) {
    span.style.textDecoration = "line-through";
  }

  const button = document.createElement("button");
  button.textContent = "";
  //adicionando um evento ao botão remover tarefa :)
  button.addEventListener("click", (event) => {
    const liToRemove = event.target.parentElement;

    const titleToRemove = liToRemove.querySelector("span").textContent;

    //aqui estamos filtrando o que tem no array tasks com o elemento t de tarefa pra percorrer e assim remover
    //o titulo diferente do que removemos para tirar da array
    tasks = tasks.filter((task) => task.title !== titleToRemove);

    //ele mostra qual botão disparou o evento:
    // console.log(event.target.parentElement)
    //como na linha 61 que está adicionando um filho, aqui estamos removendo :)
    todoListUl.removeChild(liToRemove);

    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  //como todos acima está dentro do li...
  li.appendChild(input);
  li.appendChild(span);
  li.appendChild(button);

  todoListUl.appendChild(li);
}

window.onload = () => {
  const tasksOnLocalStorage = localStorage.getItem("tasks");

  if (!tasksOnLocalStorage) return;

  tasks = JSON.parse(tasksOnLocalStorage);

  tasks.forEach((task) => {
    renderTaskOnHtml(task.title, task.done);
  });
};

//adicionar evento agora para o form, então quando ocorrer o submit que é padrão de formulário e de
//carregar a página ao clicar o que se chama de event, por isso vamos alterar ele :)
//a função que ira ocorrer serase =>
form.addEventListener("submit", (event) => {
  event.preventDefault(); //ele evita o comportamento padrão d recarregar a página ao submit do formulário

  //pra pegar o titulo que a pessoa digitou no input do formulario
  const taskTitle = taskTitleInput.value;
  //se o titulo da tarefa for menor que 3 letras

  if (taskTitle.length < 3) {
    showToast("Sua tarefa precisa ter pelo menos 3 caracteres");
    return;
  }
  //adicionar a nova tarefa no array de tasks
  // versão antes de tornar a array em objeto: tasks.push(taskTitle);
  tasks.push({
    title: taskTitle,
    done: false,
  });
  //colocando pra salvar ao recarregar a cada mudança na página
  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderTaskOnHtml(taskTitle);

  //agora vamos fazer o input se limpar a cada tarefa adicionada :)
  taskTitleInput.value = " ";
});

function displayRandomCharacterImage() {
  const characterImages = [
    "css/imagens/jujuba.png",
    "css/imagens/zoro.png",
    "css/imagens/caroco.png",
    "css/imagens/bmo.png",
    "css/imagens/chave.png",
    "css/imagens/finn.png",
    "css/imagens/gunter.png",
    "css/imagens/jakeFinn.png",
    "css/imagens/marceline.png",
  ];

  const randomCharacterImage =
    characterImages[Math.floor(Math.random() * characterImages.length)];

  const character = document.createElement("img");
  character.src = randomCharacterImage;
  character.style.position = "absolute";

  character.style.left = `${Math.random() * (window.innerWidth - 150)}px`;
  character.style.top = `${Math.random() * (window.innerHeight - 200)}px`;
  character.style.width = "150px";
  character.style.height = "200px";

  document.body.appendChild(character);

  setTimeout(() => {
    document.body.removeChild(character);
  }, 2000);
}

//------------------------------------------------------------------
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
}
