# Satubinha Lab

Laboratório de **DevOps & Cloud Native** com uma aplicação full-stack containerizada. O projeto demonstra microsserviços, orquestração com Docker Compose, migrations de banco de dados, segurança de credenciais com Docker Secrets e pipeline de CI/CD.

## Arquitetura

```
  Browser
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
  secrets: /run/secrets/* (Docker Secrets)
```

## Serviços

| Serviço  | Tecnologia              | Porta  |
|----------|-------------------------|--------|
| Frontend | Next.js · React         | `8080` |
| API      | Node.js · Express       | `4000` |
| Weather  | Python · Flask          | `5000` |
| Database | PostgreSQL              | `5432` |
| Migrate  | Flyway                  | —      |

## Stack

- **Frontend:** Next.js, React, CSS Modules
- **API:** Node.js, Express, pg
- **Weather:** Python, Flask, Gunicorn
- **Database:** PostgreSQL, Flyway (migrations)
- **Infra:** Docker, Docker Compose, Docker Secrets
- **CI/CD:** GitHub Actions

## Pré-requisitos

- Docker >= 24
- Docker Compose >= 2.20

## Início rápido

### 1. Configure os secrets

```bash
chmod +x scripts/init-secrets.sh
./scripts/init-secrets.sh
```

O script cria `secrets/db_user.txt`, `secrets/db_password.txt` e `secrets/db_name.txt` com uma senha gerada aleatoriamente. Os arquivos ficam fora do controle de versão.

Ou manualmente:

```bash
mkdir -p secrets
echo "postgres"          > secrets/db_user.txt
echo "sua_senha_segura"  > secrets/db_password.txt
echo "satubinha"         > secrets/db_name.txt
chmod 600 secrets/*.txt
```

### 2. Configure variáveis de ambiente

```bash
cp .env.example .env
# Edite .env e adicione sua chave da OpenWeatherMap (opcional)
```

### 3. Suba a aplicação

```bash
docker compose up -d
```

Acesse em **http://localhost:8080**.

### Parar

```bash
docker compose down
```

Para remover o volume do banco:

```bash
docker compose down -v
```

## API

Base URL: `http://localhost:4000`

| Método   | Rota             | Descrição              |
|----------|------------------|------------------------|
| `GET`    | `/api/nomes`     | Lista todos os nomes   |
| `POST`   | `/api/nome`      | Adiciona um nome       |
| `DELETE` | `/api/nome/:id`  | Remove um nome por ID  |
| `GET`    | `/health`        | Health check da API    |

### Exemplo

```bash
# Adicionar nome
curl -X POST http://localhost:4000/api/nome \
  -H "Content-Type: application/json" \
  -d '{"nome": "Fabricio"}'

# Listar nomes
curl http://localhost:4000/api/nomes
```

## Secrets

As credenciais do banco são gerenciadas como **Docker Secrets**, montadas em `/run/secrets/` dentro dos containers. Nunca são passadas como variáveis de ambiente em texto puro.

```
secrets/
├── db_user.txt
├── db_password.txt
└── db_name.txt
```

> A pasta `secrets/` está no `.gitignore` e nunca deve ser commitada.

Para configurar a chave da API de clima, adicione ao `.env`:

```
OPENWEATHER_API_KEY=sua_chave_aqui
```

Obtenha uma chave gratuita em [openweathermap.org](https://openweathermap.org/api).

## CI/CD

O pipeline do GitHub Actions é acionado em push para `main` (ou manualmente via `workflow_dispatch`) e realiza:

1. Testes da API e scan de vulnerabilidades no código-fonte (Trivy FS — `HIGH,CRITICAL`)
2. Detecção de quais serviços foram alterados
3. Build da imagem Docker de cada serviço alterado
4. Scan de segurança na imagem construída (Trivy image — `HIGH,CRITICAL`) — falha antes do push
5. Push para o Amazon ECR (repositório dedicado por serviço: `satubinha-api`, `satubinha-weather`, etc.)
6. Assinatura da imagem com Cosign
7. Atualização do AWS SSM Parameter Store com a URI completa da imagem (`sha-<git-sha>`)

As imagens são tagueadas com o SHA curto do commit (`sha-a3f9c12`), garantindo rastreabilidade e imutabilidade.

## Estrutura do projeto

```
satubinha-app/
├── front/              # Frontend Next.js
│   ├── components/
│   ├── pages/
│   └── styles/
├── api/                # API Node.js
│   └── src/
├── weather/            # Microsserviço Python
├── database/           # Dockerfile do PostgreSQL
├── migrate/            # Migrations Flyway
├── scripts/            # Scripts utilitários
├── secrets/            # Credenciais locais (não versionado)
├── compose.yaml
└── .env.example
```

## Autor

**Fabricio Peloso** — DevOps Engineer  
[github.com/fabricio-f5](https://github.com/fabricio-f5)
