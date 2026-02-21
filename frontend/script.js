async function enviar() {
  const nome = document.getElementById("nome").value;

  const resp = await fetch("http://localhost:4000/nome", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome })
  });

  const data = await resp.json();

  document.getElementById("resultado").innerText = data.mensagem;
}
