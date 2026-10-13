var turmas = [];
var alunos = [];

document.getElementById("form-turma").onsubmit = function(e) {
    e.preventDefault();

    turmas.push(document.getElementById("nome-turma").value);

    document.getElementById("lista-turmas").innerHTML +=
        "<p>" + turmas[turmas.length - 1] + "</p>";

    document.getElementById("q-turmas").innerText = turmas.length;

    this.reset();
};

document.getElementById("form-estudante").onsubmit = function(e) {
    e.preventDefault();

    var nome = document.getElementById("nome-estudante").value;

    alunos.push(nome);

    document.getElementById("lista-estudantes").innerHTML +=
        "<p>" + nome + "</p>";

    document.getElementById("q-estudantes").innerText = alunos.length;

    this.reset();
};

document.getElementById("form-avaliacao").onsubmit = function(e) {
    e.preventDefault();

    var n1 = Number(document.getElementById("n1").value);
    var n2 = Number(document.getElementById("n2").value);
    var media = (n1 + n2) / 2;

    document.getElementById("lista-avaliacoes").innerHTML +=
        "<p>Média: " + media.toFixed(1) + "</p>";

    if (media >= 6) {
        document.getElementById("q-aprovados").innerText =
            Number(document.getElementById("q-aprovados").innerText) + 1;
    }

    this.reset();
};

document.getElementById("exportar").onclick = function() {
    alert("Relatório acadêmico");
};

var botoes = document.querySelectorAll(".tab");

for (var i = 0; i < botoes.length; i++) {
    botoes[i].onclick = function() {
        var abas = document.querySelectorAll(".aba");

        for (var j = 0; j < abas.length; j++) {
            abas[j].hidden = true;
        }

        for (var j = 0; j < botoes.length; j++) {
            botoes[j].classList.remove("active");
        }

        document.getElementById("aba-" + this.dataset.aba).hidden = false;
        this.classList.add("active");
    };
}