var produtos = [
    ["Computador", 1500],
    ["Notebook", 1400],
    ["Teclado", 120],
    ["Mouse", 60],
    ["Monitor", 700]
];

var carrinho = [];
var total = 0;

for (var i = 0; i < produtos.length; i++) {
    document.getElementById("produtos").innerHTML +=
        "<div class='product'><h3>" + produtos[i][0] +
        "</h3><p>R$ " + produtos[i][1] +
        "</p><button onclick='adicionar(" + i +
        ")'>Adicionar</button></div>";
}

function adicionar(i) {
    carrinho.push(produtos[i]);
    total += produtos[i][1];

    document.getElementById("carrinho").innerHTML +=
        "<p>" + produtos[i][0] + "</p>";

    document.getElementById("q-itens").innerText = carrinho.length;
    document.getElementById("resumo").innerText = "Total: R$ " + total;
}

document.getElementById("entrega").onchange = function() {
    document.getElementById("resumo").innerText =
        "Total: R$ " + (total + Number(this.value));
};