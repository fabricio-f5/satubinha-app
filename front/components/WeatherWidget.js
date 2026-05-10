import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function WeatherWidget() {
  const [previsao, setPrevisao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarPrevisao();
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

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.dot} style={{ background: '#f85149' }} />
        <span className={styles.dot} style={{ background: '#d29922' }} />
        <span className={styles.dot} style={{ background: '#3fb950' }} />
        <span className={styles.panelTitle}>Previsão do Tempo</span>
      </div>
      <div className={styles.panelBody}>
        {carregando && <div className={styles.loading}>Carregando previsão...</div>}
        {erro && <div className={styles.error}>{erro}</div>}
        {!carregando && !erro && previsao?.forecast && (
          <>
            <div className={styles.weatherCity}>
              &#x1F4CD; {previsao.city}
            </div>
            <div className={styles.weatherGrid}>
              {previsao.forecast.map((dia, idx) => (
                <div key={idx} className={styles.weatherDay}>
                  <div className={styles.dayLabel}>{abrevDia(dia.day_name)}</div>
                  <span className={styles.dayIcon}>{weatherIcon(dia.description)}</span>
                  <div className={styles.dayTemp}>{dia.temp_max}°</div>
                  <div className={styles.dayMin}>{dia.temp_min}°</div>
                  <div className={styles.dayStats}>
                    <span>💧{dia.humidity}%</span>
                    <span>💨{dia.wind_speed}m/s</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function abrevDia(dayName) {
  if (!dayName) return '';
  return dayName.slice(0, 3).toUpperCase();
}

function weatherIcon(description) {
  if (!description) return '🌤️';
  const d = description.toLowerCase();
  if (d.includes('thunder') || d.includes('trovão')) return '⛈️';
  if (d.includes('snow') || d.includes('neve')) return '❄️';
  if (d.includes('rain') || d.includes('chuva') || d.includes('drizzle')) return '🌧️';
  if (d.includes('mist') || d.includes('fog') || d.includes('neblina')) return '🌫️';
  if (d.includes('cloud') || d.includes('nublado')) return '☁️';
  if (d.includes('parcial') || d.includes('partly')) return '⛅';
  if (d.includes('clear') || d.includes('limpo') || d.includes('ensolarado')) return '☀️';
  return '🌤️';
}
