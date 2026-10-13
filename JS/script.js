let historico = [];

document.getElementById("form-notas").addEventListener("submit", function(evento) {
    evento.preventDefault();

    let nome = document.getElementById("nome").value;
    let disciplina = document.getElementById("disciplina").value;

    let nota1 = Number(document.getElementById("nota1").value);
    let nota2 = Number(document.getElementById("nota2").value);
    let nota3 = Number(document.getElementById("nota3").value);
    let nota4 = Number(document.getElementById("nota4").value);

    if (nota1 < 0 || nota1 > 10 || nota2 < 0 || nota2 > 10 ||
        nota3 < 0 || nota3 > 10 || nota4 < 0 || nota4 > 10) {
        document.getElementById("aviso").innerHTML = "Digite notas de 0 a 10!";
        document.getElementById("aviso").hidden = false;
        return;
    }

    let media = (nota1 + nota2 + nota3 + nota4) / 4;
    let situacao = "Reprovado";

    if (media >= 6) {
        situacao = "Aprovado";
    }

    document.getElementById("m-contagem").innerHTML = "4";
    document.getElementById("m-media").innerHTML = media.toFixed(1).replace(".", ",");
    document.getElementById("m-situacao").innerHTML = situacao;

    document.getElementById("resultado").innerHTML =
        "<h3>" + nome + "</h3>" +
        "<p>Disciplina: " + disciplina + "</p>" +
        "<p>Notas: " + nota1 + ", " + nota2 + ", " + nota3 + ", " + nota4 + "</p>" +
        "<p>Média: " + media.toFixed(1).replace(".", ",") + "</p>" +
        "<p>Situação: " + situacao + "</p>";

    historico.unshift(nome + " - " + disciplina + " - Média: " + media.toFixed(1));

    if (historico.length > 5) {
        historico.pop();
    }

    let lista = "";

    for (let i = 0; i < historico.length; i++) {
        lista += "<p>" + historico[i] + "</p>";
    }

    document.getElementById("historico").innerHTML = lista;

    document.getElementById("aviso").innerHTML = "Média calculada!";
    document.getElementById("aviso").hidden = false;
});

document.getElementById("form-notas").addEventListener("reset", function() {
    document.getElementById("aviso").innerHTML = "Campos limpos!";
    document.getElementById("aviso").hidden = false;
});