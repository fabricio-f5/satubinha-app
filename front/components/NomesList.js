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
      setMensagem('Digite um nome primeiro');
      return;
    }

    setCarregando(true);
    try {
      const response = await fetch('/api/nome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novoNome }),
      });
      const data = await response.json();
      setMensagem(data.mensagem || 'Adicionado!');
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
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.dot} style={{ background: '#f85149' }} />
        <span className={styles.dot} style={{ background: '#d29922' }} />
        <span className={styles.dot} style={{ background: '#3fb950' }} />
        <span className={styles.panelTitle}>Quem ama Satubinha?</span>
      </div>
      <div className={styles.panelBody}>
        <form onSubmit={enviar} className={styles.inputRow}>
          <input
            className={styles.nameInput}
            type="text"
            placeholder="Digite seu nome..."
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            disabled={carregando}
          />
          <button className={styles.addBtn} type="submit" disabled={carregando}>
            {carregando ? '...' : 'Adicionar'}
          </button>
        </form>

        {mensagem && <div className={styles.message}>{mensagem}</div>}

        <ul className={styles.namesList}>
          {nomes.length === 0 ? (
            <li className={styles.emptyState}>Nenhum nome ainda — seja o primeiro!</li>
          ) : (
            nomes.map((item) => (
              <li key={item.id} className={styles.nameItem}>
                <span className={styles.nameText}>{item.nome} ama Satubinha</span>
                <button
                  className={styles.removeBtn}
                  onClick={() => deletar(item.id)}
                  type="button"
                >
                  remover
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
