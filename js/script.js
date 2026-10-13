const form = document.getElementById("form");
const cliente = document.getElementById("cliente");
const servico = document.getElementById("servico");
const data = document.getElementById("data");
const hora = document.getElementById("hora");
const filtro = document.getElementById("filtro");
const lista = document.getElementById("lista");

let agendamentos = JSON.parse(
  localStorage.getItem("agendamentos") || "[]"
);

const duracoes = {
  "Corte de cabelo": 30,
  "Barba": 30,
  "Manicure": 60,
  "Massagem": 60
};

function dataLocal() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

data.min = dataLocal();
filtro.value = dataLocal();
data.value = dataLocal();

function minutos(horario) {
  const [h, m] = horario.split(":").map(Number);
  return h * 60 + m;
}

function horarioTexto(valor) {
  return `${String(Math.floor(valor / 60)).padStart(2, "0")}:${String(valor % 60).padStart(2, "0")}`;
}

function carregarHorarios() {
  const dia = data.value;
  const duracao = duracoes[servico.value];
  const anterior = hora.value;

  hora.innerHTML = "";

  for (let t = 8 * 60; t + duracao <= 17 * 60; t += 30) {
    const inicio = horarioTexto(t);
    const fim = t + duracao;

    const ocupado = agendamentos.some(a =>
      a.data === dia &&
      t < minutos(a.hora) + duracoes[a.servico] &&
      fim > minutos(a.hora)
    );

    const passado = dia === dataLocal() &&
      t <= new Date().getHours() * 60 + new Date().getMinutes();

    if (!ocupado && !passado) {
      const opcao = document.createElement("option");
      opcao.value = inicio;
      opcao.textContent = inicio;
      hora.appendChild(opcao);
    }
  }

  if (hora.options.length === 0) {
    const opcao = document.createElement("option");
    opcao.value = "";
    opcao.textContent = "Sem horários disponíveis";
    hora.appendChild(opcao);
  } else if ([...hora.options].some(o => o.value === anterior)) {
    hora.value = anterior;
  }
}

function salvar() {
  localStorage.setItem(
    "agendamentos",
    JSON.stringify(agendamentos)
  );
}

function atualizar() {
  const selecionados = agendamentos.filter(
    a => a.data === filtro.value
  );

  document.getElementById("total").textContent =
    agendamentos.length;

  document.getElementById("hoje").textContent =
    agendamentos.filter(a => a.data === dataLocal()).length;

  lista.innerHTML = "";

  if (selecionados.length === 0) {
    lista.innerHTML =
      '<div class="vazio">Nenhum agendamento nesta data.</div>';
    return;
  }

  selecionados.sort((a, b) =>
    a.hora.localeCompare(b.hora)
  );

  selecionados.forEach(a => {
    const item = document.createElement("div");
    item.className = "agendamento";

    const nome = document.createElement("strong");
    nome.textContent = a.cliente;

    const detalhe = document.createElement("p");
    detalhe.textContent =
      `${a.servico} • ${a.hora} • ${duracoes[a.servico]} min`;

    const cancelar = document.createElement("button");
    cancelar.textContent = "Cancelar";
    cancelar.type = "button";

    cancelar.addEventListener("click", () => {
      agendamentos = agendamentos.filter(x => x.id !== a.id);
      salvar();
      atualizar();
      carregarHorarios();
    });

    item.append(nome, detalhe, cancelar);
    lista.appendChild(item);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  if (!hora.value) {
    alert("Não há horários disponíveis para esse serviço.");
    return;
  }

  const inicio = minutos(hora.value);
  const fim = inicio + duracoes[servico.value];

  const conflito = agendamentos.some(a =>
    a.data === data.value &&
    inicio < minutos(a.hora) + duracoes[a.servico] &&
    fim > minutos(a.hora)
  );

  if (conflito) {
    alert("Esse horário já está ocupado.");
    carregarHorarios();
    return;
  }

  agendamentos.push({
    id: Date.now(),
    cliente: cliente.value.trim(),
    servico: servico.value,
    data: data.value,
    hora: hora.value
  });

  salvar();
  filtro.value = data.value;
  atualizar();
  carregarHorarios();
  form.reset();
  data.value = dataLocal();
  filtro.value = data.value;
  atualizar();
  carregarHorarios();

  alert("Agendamento confirmado!");
});

data.addEventListener("change", carregarHorarios);
servico.addEventListener("change", carregarHorarios);

filtro.addEventListener("change", atualizar);

carregarHorarios();
atualizar();