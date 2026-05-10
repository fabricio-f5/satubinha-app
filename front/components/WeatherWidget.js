import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function WeatherWidget() {
  const [previsao, setPrevisao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarPrevisao();
    // Recarregar a cada 30 minutos
    const intervalo = setInterval(carregarPrevisao, 30 * 60 * 1000);
    return () => clearInterval(intervalo);
  }, []);

  const carregarPrevisao = async () => {
    try {
      setCarregando(true);
      setErro(null);
      
      const response = await fetch('/api/weather');
      if (!response.ok) throw new Error('Erro ao carregar previsão');
      
      const data = await response.json();
      setPrevisao(data);
    } catch (error) {
      console.error('Erro:', error);
      setErro('Não foi possível carregar a previsão do tempo');
    } finally {
      setCarregando(false);
    }
  };

  if (erro) {
    return (
      <div className={styles.weatherContainer}>
        <div className={styles.error}>{erro}</div>
      </div>
    );
  }

  if (carregando) {
    return (
      <div className={styles.weatherContainer}>
        <div className={styles.loading}>Carregando previsão...</div>
      </div>
    );
  }

  if (!previsao || !previsao.forecast) {
    return null;
  }

  return (
    <div className={styles.weatherContainer}>
      <h2 className={styles.weatherTitle}>
        🌤️ Previsão do Tempo - {previsao.city}
      </h2>
      
      <div className={styles.weatherGrid}>
        {previsao.forecast.map((dia, idx) => (
          <div key={idx} className={styles.weatherCard}>
            <h3>{formatarData(dia.date)}</h3>
            <p>{dia.day_name}</p>
            <div className={styles.temp}>
              {dia.temp_max}°C / {dia.temp_min}°C
            </div>
            <p>{dia.description}</p>
            <p>💧 {dia.humidity}%</p>
            <p>💨 {dia.wind_speed} m/s</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatarData(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
}
