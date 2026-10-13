"use strict";
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const escapar = (valor) => String(valor ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const dinheiro = (valor) => Number(valor).toLocaleString("pt-BR", {style:"currency",currency:"BRL"});
const carregar = (chave, padrao = []) => { try { const valor = JSON.parse(localStorage.getItem(chave)); return valor ?? padrao; } catch { return padrao; } };
const salvar = (chave, dados) => localStorage.setItem(chave, JSON.stringify(dados));
const idNovo = () => "id_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2,8);
const hoje = () => { const d=new Date(); return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10); };
function avisar(mensagem, tipo="success") { const el=$("#aviso"); if (!el) return; el.hidden=false; el.textContent=mensagem; el.className="feedback " + tipo; }

let historico=[];
$("#form-notas").addEventListener("submit", (evento)=>{
 evento.preventDefault();const notas=[1,2,3,4].map(n=>Number($("#nota"+n).value));
 if(notas.some(n=>!Number.isFinite(n)||n<0||n>10)){avisar("Informe notas válidas de 0 a 10.","error");return;}
 const media=notas.reduce((s,n)=>s+n,0)/notas.length;const aprovado=media>=6;
 const registro={nome:$("#nome").value.trim(),disciplina:$("#disciplina").value.trim(),notas,media,aprovado};
 if(!registro.nome||!registro.disciplina){avisar("Informe o nome e a disciplina.","error");return;}
 historico.unshift(registro);historico=historico.slice(0,5);renderizar(registro);avisar("Média calculada com sucesso!");
});
$("#form-notas").addEventListener("reset",()=>avisar("Campos limpos. O último resultado continua visível.","success"));
function renderizar(r){
 $("#m-contagem").textContent=r.notas.length;$("#m-media").textContent=r.media.toFixed(1).replace(".",",");$("#m-situacao").textContent=r.aprovado?"Aprovado":"Reprovado";
 $("#resultado").className="item";$("#resultado").innerHTML=`<div class="row between"><strong>${escapar(r.nome)}</strong><span class="pill ${r.aprovado?"success":"danger"}">${r.aprovado?"Aprovado":"Reprovado"}</span></div><p class="muted">${escapar(r.disciplina)}</p><p>Notas: ${r.notas.map(n=>n.toFixed(1).replace(".",",")).join(" • ")}</p><div class="total"><span>Média final</span><strong>${r.media.toFixed(1).replace(".",",")}</strong></div>`;
 $("#historico").innerHTML=historico.map(h=>`<div class="item"><strong>${escapar(h.nome)}</strong> — ${escapar(h.disciplina)} <span class="pill ${h.aprovado?"success":"danger"}">${h.media.toFixed(1).replace(".",",")}</span></div>`).join("");
}
