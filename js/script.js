const form = document.getElementById("formTarefa");
const campoDescricao = document.getElementById("descricaoTarefa");
const campoPrioridade = document.getElementById("prioridade");
const lista = document.getElementById("listaTarefas");
const filtro = document.getElementById("filtro");
const mensagemVazia = document.getElementById("mensagemVazia");

let tarefas = JSON.parse(localStorage.getItem("minhasTarefas")) || [];

function salvarTarefas() {
  localStorage.setItem("minhasTarefas", JSON.stringify(tarefas));
}

function atualizarContadores() {
  document.getElementById("total").textContent = tarefas.length;

  const concluidas = tarefas.filter(tarefa => tarefa.concluida).length;

  document.getElementById("concluidas").textContent = concluidas;
  document.getElementById("pendentes").textContent =
    tarefas.length - concluidas;
}

function renderizarTarefas() {
  lista.innerHTML = "";

  const tarefasFiltradas = tarefas.filter(tarefa => {
    if (filtro.value === "pendentes") {
      return !tarefa.concluida;
    }

    if (filtro.value === "concluidas") {
      return tarefa.concluida;
    }

    return true;
  });

  mensagemVazia.style.display =
    tarefasFiltradas.length === 0 ? "block" : "none";

  tarefasFiltradas.forEach(tarefa => {
    const item = document.createElement("li");
    item.className = "tarefa";

    if (tarefa.concluida) {
      item.classList.add("feita");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefa.concluida;
    checkbox.setAttribute("aria-label", "Concluir tarefa");

    checkbox.addEventListener("change", () => {
      tarefa.concluida = checkbox.checked;
      salvarTarefas();
      renderizarTarefas();
    });

    const informacoes = document.createElement("div");
    informacoes.className = "tarefa-info";

    const titulo = document.createElement("strong");
    titulo.textContent = tarefa.descricao;

    const detalhe = document.createElement("small");
    detalhe.textContent = "Prioridade: ";

    const prioridade = document.createElement("span");
    prioridade.textContent = tarefa.prioridade;
    prioridade.className = "prioridade";

    if (tarefa.prioridade === "Alta") {
      prioridade.classList.add("alta");
    } else if (tarefa.prioridade === "Média") {
      prioridade.classList.add("media");
    } else {
      prioridade.classList.add("baixa");
    }

    detalhe.appendChild(prioridade);
    informacoes.append(titulo, detalhe);

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.className = "excluir";
    botaoExcluir.setAttribute("aria-label", "Excluir tarefa");

    botaoExcluir.addEventListener("click", () => {
      tarefas = tarefas.filter(item => item.id !== tarefa.id);
      salvarTarefas();
      renderizarTarefas();
    });

    item.append(checkbox, informacoes, botaoExcluir);
    lista.appendChild(item);
  });

  atualizarContadores();
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const descricao = campoDescricao.value.trim();

  if (!descricao) {
    campoDescricao.focus();
    return;
  }

  const novaTarefa = {
    id: Date.now() + Math.random(),
    descricao: descricao,
    prioridade: campoPrioridade.value,
    concluida: false
  };

  tarefas.push(novaTarefa);

  salvarTarefas();
  renderizarTarefas();

  form.reset();
  campoPrioridade.value = "Média";
  campoDescricao.focus();
});

filtro.addEventListener("change", renderizarTarefas);

renderizarTarefas();