import styles from '../styles/Home.module.css';
import NomesList from '../components/NomesList';
import WeatherWidget from '../components/WeatherWidget';

const GITHUB_URL = 'https://github.com/fabricio-f5/satubinha-app';

const SERVICES = [
  {
    icon: '⚛',
    iconBg: 'rgba(88,166,255,0.12)',
    iconColor: '#58a6ff',
    name: 'Frontend',
    tech: 'Next.js · React · CSS Modules',
    port: ':8080',
  },
  {
    icon: '⬡',
    iconBg: 'rgba(63,185,80,0.12)',
    iconColor: '#3fb950',
    name: 'API',
    tech: 'Node.js · Express · PostgreSQL',
    port: ':4000',
  },
  {
    icon: '☁',
    iconBg: 'rgba(188,140,255,0.12)',
    iconColor: '#bc8cff',
    name: 'Weather',
    tech: 'Python · Flask · OpenWeatherMap',
    port: ':5000',
  },
  {
    icon: '▪',
    iconBg: 'rgba(210,153,34,0.12)',
    iconColor: '#d29922',
    name: 'Database',
    tech: 'PostgreSQL · Flyway Migrations',
    port: ':5432',
  },
];

const STACK = [
  { name: 'Next.js',         sub: 'React · SSR',          color: '#58a6ff' },
  { name: 'Node.js',         sub: 'Express · REST API',   color: '#3fb950' },
  { name: 'Python',          sub: 'Flask · Gunicorn',     color: '#bc8cff' },
  { name: 'PostgreSQL',      sub: 'Flyway migrations',    color: '#d29922' },
  { name: 'Docker',          sub: 'Compose · Secrets',    color: '#58a6ff' },
  { name: 'GitHub Actions',  sub: 'CI/CD pipeline',       color: '#3fb950' },
];

const ARCH = `  Browser
    │
    ▼
[ front :8080 ]  (Next.js)
    │                  │
    │  /api/*          │  /weather/*
    ▼                  ▼
[ api :4000 ]    [ weather :5000 ]  (Python/Flask)
    │                          │
    ▼                          ▼
[ db :5432 ]          OpenWeatherMap API
  PostgreSQL
    ▲
    │  migrations
[ migrate ]  (Flyway)

  rede: app-network (bridge)
  volume: pgdata (persistência)
  secrets: /run/secrets/* (Docker Secrets)`;

export default function Home() {
  return (
    <div className={styles.page}>

      <header className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          Em execução
        </div>
        <h1 className={styles.heroTitle}>Satubinha Lab</h1>
        <p className={styles.heroDesc}>
          Laboratório de DevOps &amp; Cloud Native — microsserviços containerizados com Docker Compose.
        </p>
        <div className={styles.heroActions}>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={styles.btnGithub}>
            <GithubIcon />
            fabricio-f5/satubinha-app
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          <WeatherWidget />
          <NomesList />
        </div>
      </main>

      <div className={styles.sections}>

        {/* Services */}
        <div className={styles.sectionWrapper}>
          <div className={styles.sectionLabel}>Infraestrutura</div>
          <div className={styles.sectionTitle}>Serviços</div>
          <p className={styles.sectionDesc}>
            Quatro containers independentes orquestrados com Docker Compose, cada um com health check configurado.
          </p>
          <div className={styles.servicesGrid}>
            {SERVICES.map((s) => (
              <div key={s.name} className={styles.serviceCard}>
                <div className={styles.serviceCardHeader}>
                  <div
                    className={styles.serviceIcon}
                    style={{ background: s.iconBg, color: s.iconColor }}
                  >
                    {s.icon}
                  </div>
                  <div className={styles.statusDot} />
                </div>
                <div className={styles.serviceName}>{s.name}</div>
                <div className={styles.serviceTech}>{s.tech}</div>
                <span className={styles.servicePort}>{s.port}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <div className={styles.sectionWrapper}>
          <div className={styles.sectionLabel}>Diagrama</div>
          <div className={styles.sectionTitle}>Arquitetura</div>
          <p className={styles.sectionDesc}>
            Fluxo de dados entre os serviços na rede interna Docker.
          </p>
          <pre className={styles.archDiagram}>{ARCH}</pre>
        </div>

        {/* Stack */}
        <div className={styles.sectionWrapper}>
          <div className={styles.sectionLabel}>Tecnologias</div>
          <div className={styles.sectionTitle}>Stack completo</div>
          <p className={styles.sectionDesc} />
          <div className={styles.stackRow}>
            {STACK.map((s) => (
              <div key={s.name} className={styles.stackPill}>
                <span className={styles.pillDot} style={{ background: s.color }} />
                <span className={styles.pillName}>{s.name}</span>
                <span className={styles.pillSub}>{s.sub}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <footer className={styles.footer}>
        <strong>Fabricio Peloso</strong> &mdash; DevOps Engineer &nbsp;·&nbsp; Satubinha Lab 2026
      </footer>
    </div>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
