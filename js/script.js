const form = document.getElementById("formLivro");
const lista = document.getElementById("listaLivros");
const pesquisa = document.getElementById("pesquisa");
const mensagem = document.getElementById("mensagem");

let livros = JSON.parse(localStorage.getItem("livros")) || [];

function salvar() {
  localStorage.setItem("livros", JSON.stringify(livros));
}

function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, caractere => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caractere]);
}

function avisar(texto) {
  mensagem.textContent = texto;
  mensagem.hidden = false;
}

function atualizar() {
  document.getElementById("total").textContent = livros.length;

  document.getElementById("disponiveis").textContent =
    livros.filter(livro => !livro.emprestado).length;

  document.getElementById("emprestados").textContent =
    livros.filter(livro => livro.emprestado).length;

  mostrarLivros();
  salvar();
}

function mostrarLivros() {
  const termo = pesquisa.value.toLowerCase().trim();

  const encontrados = livros.filter(livro =>
    livro.titulo.toLowerCase().includes(termo) ||
    livro.autor.toLowerCase().includes(termo)
  );

  if (encontrados.length === 0) {
    lista.innerHTML =
      '<div class="vazio">Nenhum livro encontrado.</div>';
    return;
  }

  lista.innerHTML = encontrados.map(livro => `
    <article class="livro">
      <h3>${escapar(livro.titulo)}</h3>
      <p>
        <strong>Autor:</strong> ${escapar(livro.autor)}<br>
        <strong>Categoria:</strong> ${escapar(livro.categoria)}
      </p>

      <span class="status ${livro.emprestado ? "emprestado" : ""}">
        ${livro.emprestado ? "Emprestado" : "Disponível"}
      </span>

      <div class="acoes">
        <button
          data-acao="alternar"
          data-id="${livro.id}"
          class="${livro.emprestado ? "btn-devolver" : ""}"
        >
          ${livro.emprestado ? "Devolver" : "Emprestar"}
        </button>

        <button
          class="btn-excluir"
          data-acao="excluir"
          data-id="${livro.id}"
        >
          Excluir
        </button>
      </div>
    </article>
  `).join("");
}

form.addEventListener("submit", function(evento) {
  evento.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const autor = document.getElementById("autor").value.trim();
  const categoria = document.getElementById("categoria").value;

  if (!titulo || !autor) {
    avisar("Preencha o título e o autor.");
    return;
  }

  livros.push({
    id: crypto.randomUUID(),
    titulo,
    autor,
    categoria,
    emprestado: false
  });

  form.reset();
  atualizar();
  avisar("Livro cadastrado com sucesso!");
});

pesquisa.addEventListener("input", mostrarLivros);

lista.addEventListener("click", function(evento) {
  const botao = evento.target.closest("button[data-acao]");

  if (!botao) return;

  const id = botao.dataset.id;
  const acao = botao.dataset.acao;
  const livro = livros.find(item => item.id === id);

  if (!livro) return;

  if (acao === "alternar") {
    livro.emprestado = !livro.emprestado;

    avisar(
      livro.emprestado
        ? "Livro emprestado com sucesso!"
        : "Livro devolvido com sucesso!"
    );
  }

  if (acao === "excluir") {
    livros = livros.filter(item => item.id !== id);
    avisar("Livro excluído com sucesso!");
  }

  atualizar();
});

atualizar();