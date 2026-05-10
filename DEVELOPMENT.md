# Satubinha App - React + Weather Widget

Aplicação full-stack com Next.js, Node.js API e micro serviço Python para previsão do tempo.

## 🏗️ Arquitetura

```
├── front/          → Next.js (React) - Interface web
├── api/            → Node.js - API de nomes (PostgreSQL)
├── weather/        → Python (Flask) - Previsão do tempo
├── database/       → PostgreSQL
└── migrate/        → Flyway - Migrations
```

## 🚀 Começando

### 1. Clonar e configurar

```bash
git clone <repo>
cd satubinha-app
cp .env.example .env
```

### 2. Configurar OpenWeatherMap (opcional)

Para usar dados reais de previsão:

1. Acesse: https://openweathermap.org/api
2. Crie uma conta e obtenha uma chave de API gratuita
3. Adicione ao `.env`:

```bash
OPENWEATHER_API_KEY=sua_chave_aqui
```

**Sem configuração**: A aplicação funciona com dados fictícios (demo_key).

### 3. Iniciar com Docker Compose

```bash
docker-compose up --build
```

Acesse:
- **Frontend**: http://localhost:8080
- **API**: http://localhost:4000
- **Weather**: http://localhost:5000

## 📋 Funcionalidades

### Formulário de Nomes
- ➕ Adicionar nome (armazenado em PostgreSQL)
- 📋 Listar nomes
- ❌ Deletar nome

### Widget de Previsão do Tempo
- 🌤️ Previsão para 5 dias em Satubinha
- 📊 Temperatura mín/máx, umidade, velocidade do vento
- 🔄 Atualização automática a cada 30 minutos
- 🎨 Design responsivo com tema Brasil

## 🔧 Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `OPENWEATHER_API_KEY` | `demo_key` | Chave de API do OpenWeatherMap |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | URL da API Node.js |

## 📁 Estrutura do Front (Next.js)

```
front/
├── pages/
│   ├── _app.js           → Configuração global
│   ├── _document.js      → HTML wrapper
│   └── index.js          → Página principal
├── components/
│   ├── NomesList.js      → Componente de lista de nomes
│   └── WeatherWidget.js  → Componente de previsão
├── styles/
│   ├── globals.css       → Estilos globais
│   └── Home.module.css   → Estilos do módulo
└── package.json          → Dependências
```

## 🔗 Endpoints da API

### API Node.js (api:4000)
```
GET    /api/nomes           → Lista todos os nomes
POST   /api/nome            → Cria novo nome
DELETE /api/nome/:id        → Deleta um nome
```

### API Python Weather (weather:5000)
```
GET /api/weather           → Previsão do tempo para Satubinha
GET /health                → Health check
```

## 🛠️ Desenvolvimento Local

Para desenvolver sem Docker:

### Front (Next.js)
```bash
cd front
npm install
npm run dev
# Acessa: http://localhost:3000
```

### Weather (Python)
```bash
cd weather
pip install -r requirements.txt
python app.py
# Acessa: http://localhost:5000
```

### API (Node.js)
```bash
cd api
npm install
npm start
# Acessa: http://localhost:4000
```

## 📝 Migrations

Migrations SQL são executadas automaticamente via Flyway:
```bash
migrate/migrations/
└── V1__Init.sql
```

Para adicionar nova migration:
```bash
touch migrate/migrations/V2__Nova_migration.sql
```

## 🔐 Segurança

- ✅ Credenciais do banco em `/secrets/` (ignoradas no git)
- ✅ `.gitignore` configurado para não expor dados sensíveis
- ✅ Variáveis de ambiente para configuração sensível

## 📦 Deploy

Para fazer build:

```bash
docker-compose build
docker-compose up -d
```

## 🐛 Troubleshooting

### Front não conecta na API
Verifique se `http://api:4000` está acessível dentro da rede Docker.

### Weather retorna erro
Se `OPENWEATHER_API_KEY` não estiver configurada, usa dados mock (OK para demo).

### Banco de dados não inicializa
Verifique `/secrets/` - deve conter `db_user.txt`, `db_password.txt`, `db_name.txt`.

## 🎯 Próximos Passos

- [ ] Testes unitários (Jest + React Testing Library)
- [ ] Validação de entrada mais robusta
- [ ] Cache de previsão do tempo
- [ ] Filtro de nomes por favoritos
- [ ] Dark mode
