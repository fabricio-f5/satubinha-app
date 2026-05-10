import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function NomesList() {
  const [nomes, setNomes] = useState([]);
  const [novoNome, setNovoNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarLista();
  }, []);

  const carregarLista = async () => {
    try {
      const response = await fetch('/api/nomes');
      const data = await response.json();
      setNomes(data);
    } catch (error) {
      console.error('Erro ao carregar lista:', error);
    }
  };

  const enviar = async (e) => {
    e.preventDefault();
    
    if (!novoNome.trim()) {
      setMensagem('Por favor, digite um nome');
      return;
    }

    setCarregando(true);
    try {
      const response = await fetch('/api/nome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novoNome })
      });
      
      const data = await response.json();
      setMensagem(data.mensagem || 'Adicionado com sucesso!');
      setNovoNome('');
      
      setTimeout(() => setMensagem(''), 3000);
      
      carregarLista();
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setMensagem('Erro ao adicionar nome');
    } finally {
      setCarregando(false);
    }
  };

  const deletar = async (id) => {
    try {
      await fetch(`/api/nome/${id}`, { method: 'DELETE' });
      carregarLista();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  return (
    <div className={styles.section}>
      <h2>Quem ama Satubinha?</h2>
      
      <form onSubmit={enviar} className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Seu nome"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          disabled={carregando}
        />
        <button type="submit" disabled={carregando}>
          {carregando ? 'Adicionando...' : 'Adicionar'}
        </button>
      </form>

      {mensagem && <div className={styles.resultado}>{mensagem}</div>}

      <ul className={styles.lista}>
        {nomes.length === 0 ? (
          <li className={styles.emptyList}>Nenhum nome adicionado ainda</li>
        ) : (
          nomes.map((item) => (
            <li key={item.id} className={styles.listaItem}>
              <span>{item.nome} ama Satubinha</span>
              <button
                className={styles.deleteBtn}
                onClick={() => deletar(item.id)}
                type="button"
              >
                Deletar
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
