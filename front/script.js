const lista = document.getElementById("lista");
const resultado = document.getElementById("resultado");

async function carregarLista() {
  const resp = await fetch("/api/nomes");
  const data = await resp.json();

  lista.innerHTML = "";

  data.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `${item.nome} ama Satubinha 
      <button onclick="deletar(${item.id})">Deletar</button>`;
    lista.appendChild(li);
  });
}

async function enviar() {
  const nome = document.getElementById("nome").value;
  if (!nome) return;

  const resp = await fetch("/api/nome", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome })
  });

  const data = await resp.json();
  resultado.innerText = data.mensagem;

  document.getElementById("nome").value = "";
  carregarLista();
}

async function deletar(id) {
  await fetch(`/api/nome/${id}`, { method: "DELETE" });
  carregarLista();
}

// Carregar lista ao abrir página
carregarLista();
