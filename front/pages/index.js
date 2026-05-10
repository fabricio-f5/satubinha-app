import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import NomesList from '../components/NomesList';
import WeatherWidget from '../components/WeatherWidget';

export default function Home() {
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    // Detectar URL da API dinamicamente
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
  }, []);

  return (
    <div className={styles.container}>
      <h1>Satubinha App</h1>
      
      <div className={styles.mainContent}>
        <WeatherWidget />
        <NomesList />
      </div>
    </div>
  );
}
