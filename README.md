# satubinha-app

Aplicação full stack voltada para estudos e evolução contínua na área de DevOps, rodando inicialmente com Docker Compose e utilizando boas práticas como:

* Containers isolados
* Rede privada dedicada
* Healthchecks
* Docker Secrets
* Banco PostgreSQL seguro (Chainguard)
* API e Frontend com imagens Chainguard
* Migrations com Flyway
* Orquestração com dependências condicionais
* Testes automatizados com Jest + Supertest
* CI/CD com GitHub Actions
* Scan de vulnerabilidades com Trivy
* Assinatura de imagens com Cosign (keyless)

A aplicação é composta por:

| Serviço | Tecnologia              | Responsabilidade        |
| ------- | ----------------------- | ----------------------- |
| db      | PostgreSQL (Chainguard) | Banco de dados          |
| migrate | Flyway 12               | Execução das migrations |
| api     | Node.js (Chainguard)    | Backend da aplicação    |
| front   | Nginx (Chainguard)      | Interface do usuário    |

---

## Fluxo de Inicialização

1. O PostgreSQL sobe.
2. O healthcheck valida se o banco está pronto.
3. O Flyway executa as migrations.
4. A API sobe após as migrations concluídas com sucesso.
5. O Frontend sobe após a API estar saudável.

Esse fluxo garante ordem correta de inicialização, padrão importante em ambientes reais e pipelines de CI/CD.

---

## Estrutura do Repositório

```
satubinha-app/
├── .github/
│   └── workflows/
│       └── satubinha-push-dev.yml   # pipeline CI/CD
├── api/
│   ├── src/
│   │   ├── server.js                # lógica pura — Express + endpoints
│   │   └── index.js                 # entrada em produção — lê secrets, cria pool
│   ├── test/
│   │   ├── Health.test.js
│   │   └── Db.test.js
│   ├── package.json
│   ├── package-lock.json
│   └── Dockerfile
├── front/
│   ├── index.html
│   ├── script.js
│   ├── nginx.conf
│   └── Dockerfile
├── migrate/
│   ├── sql/
│   └── Dockerfile
├── secrets/
├── VERSION                          # versionamento semântico das imagens
└── docker-compose.yml
```

---

## Pipeline CI/CD

O pipeline corre no GitHub Actions em dois jobs sequenciais.

### Arquitectura do pipeline

```
push main / workflow_dispatch
        │
        ▼
┌─────────────────────┐
│   job: test         │
│                     │
│  checkout           │
│  setup-node         │
│  npm ci             │
│  Jest + Supertest   │
│  Trivy fs scan      │
└────────┬────────────┘
         │ needs: test
         ▼
┌─────────────────────────────────────────────┐
│   job: build (matrix: api, front, migrate)  │
│                                             │
│  checkout                                   │
│  set image tag (lê VERSION)                 │
│  OIDC → AWS                                 │
│  ECR check → imagem já existe?              │
│    ├── sim  → falha com mensagem clara      │
│    └── não  → build → push → Cosign sign    │
└─────────────────────────────────────────────┘
```

### Jobs

**test** — corre uma vez, valida a API antes de qualquer build:
- `npm ci` + `npm run test:ci` (Jest + Supertest, cobertura LCOV)
- Trivy filesystem scan (`HIGH,CRITICAL`, exit code 1)

**build** — corre em paralelo para os 3 serviços via matrix:
- Autentica na AWS via OIDC (sem credenciais estáticas)
- Verifica se a imagem já existe no ECR pela tag versionada
- Se não existe: `docker build` → `docker push` → `cosign sign`
- Se existe: falha — obriga a actualizar o `VERSION` antes de novo push

### Versionamento de imagens

As imagens seguem versionamento semântico controlado pelo ficheiro `VERSION` na raiz do repositório:

```
api-v1.0.0
front-v1.0.0
migrate-v1.0.0
```

Para publicar uma nova versão, actualiza o `VERSION` e faz push:

```bash
echo "v1.1.0" > VERSION
git add VERSION
git commit -m "chore: bump version to v1.1.0"
git push origin main
```

O pipeline deteta a tag nova, faz build e push das 3 imagens automaticamente.

### Repositório ECR

Todas as imagens são publicadas num único repositório ECR com tags distintas por serviço:

```
satubinha-app-img-stables:api-v1.0.0
satubinha-app-img-stables:front-v1.0.0
satubinha-app-img-stables:migrate-v1.0.0
```

O repositório tem **Image tag mutability: IMMUTABLE** — uma tag nunca pode ser sobrescrita após push.

### Segurança do pipeline

| Prática | Detalhe |
|---|---|
| OIDC | Autenticação AWS sem credenciais estáticas |
| Trivy | Scan de filesystem antes do build — bloqueia em HIGH/CRITICAL |
| Cosign keyless | Assinatura via OIDC do GitHub Actions — sem gestão de chaves |
| ECR imutável | Tags não podem ser sobrescritas após push |
| IAM Role dedicada | `satubinha-app-github-actions-role` — permissões mínimas só no ECR |

### Secrets necessários no GitHub

| Secret | Descrição |
|---|---|
| `AWS_ROLE_ARN` | ARN da IAM Role para OIDC |
| `AWS_ACCOUNT_ID` | ID da conta AWS para construir o URI do ECR |

---

## Estrutura da API

A API foi refatorada para suportar injeção de dependências — separando a lógica dos endpoints da configuração de infraestrutura. Isso permite que os testes corram sem depender de Docker Secrets ou de um banco de dados real.

### Por que dois ficheiros separados?

O `server.js` recebe o pool do banco como parâmetro — não sabe nada de secrets ou de ligações reais. O `index.js` é o único ficheiro que lê os Docker Secrets e cria o pool real. Nos testes, passa-se um pool falso (mock) ao `server.js` — sem precisar do banco a correr.

Este padrão chama-se **injeção de dependências** e é um dos mais usados em programação para tornar código testável.

---

## Testes

**Framework:** Jest + Supertest

**Cobertura:** 92% de linhas em `src/server.js` (mínimo exigido: 80%)

| Ficheiro        | O que testa                                          |
| --------------- | ---------------------------------------------------- |
| Health.test.js  | GET /health → status 200 e body `{ status: ok }`    |
| Db.test.js      | GET /nomes, POST /nome, DELETE /nome/:id com mock DB |

Os testes usam um mock do pool do PostgreSQL — não precisam do banco a correr.

### Como correr os testes localmente

```bash
docker compose run --rm api npm test
```

Para ver o relatório de cobertura:

```bash
docker compose run --rm api npm test -- --coverage
```

---

## Segurança

* Docker Secrets para credenciais do banco
* Imagens Chainguard (PostgreSQL, API, Frontend, Migrate)
* Rede privada isolada (`app-network`)
* Containers não expõem portas internas desnecessárias
* Imagens assinadas com Cosign keyless
* Scan de vulnerabilidades com Trivy em cada push

---

## Healthchecks Implementados

### Banco de Dados

```
pg_isready -U postgres -d satubinha
```

### API

```
GET http://localhost:4000/health
```

Se retornar status 200, o container é considerado saudável.

---

## Como Executar

### 1. Criar os secrets

```bash
mkdir -p .secrets
echo "seudbname" > .secrets/db_name.txt
echo "suasenha123" > .secrets/db_password.txt
echo "seuuser" > .secrets/db_user.txt
```

### 2. Subir a aplicação

```bash
docker compose up --build
```

### 3. Acessar a aplicação

```
http://localhost:8081
```

---

## Conceitos DevOps Aplicados

* Infraestrutura como código
* Containers imutáveis
* Orquestração declarativa
* Segregação de ambientes
* Automação de migrations
* Observabilidade básica com healthchecks
* Uso de imagens minimalistas e seguras (Chainguard)
* Testes automatizados com mock de dependências
* Injeção de dependências para testabilidade
* CI/CD com jobs paralelos via matrix
* Versionamento semântico de imagens
* Supply chain security com Cosign keyless
* Autenticação keyless na AWS via OIDC

---

## Roadmap

* [x] Containers isolados com Docker Compose
* [x] Docker Secrets para credenciais do banco
* [x] Imagens Chainguard (PostgreSQL, API, Frontend, Migrate)
* [x] Migrations com Flyway
* [x] Healthchecks na API e no banco
* [x] Refatoração da API para injeção de dependências
* [x] Testes automatizados com Jest + Supertest
* [x] CI/CD com GitHub Actions (matrix build)
* [x] Scan de vulnerabilidades com Trivy
* [x] Assinatura de imagens com Cosign keyless
* [x] Versionamento semântico de imagens
* [x] OIDC — autenticação AWS sem credenciais estáticas
* [ ] Deploy em Kubernetes (ver satubinha-k8s)

---

## Série hands-on-satubinha

| Projecto | Descrição | Relação | Estado |
|---|---|---|---|
| **satubinha-app** | App fullstack com Docker Compose, Chainguard, Flyway, testes, CI/CD | — | ✅ |
| [satubinha-iac-terragrunt](https://github.com/fabricio-f5/hands-on-satubinha-iac-terragrunt) | Infra AWS multi-ambiente com Terraform + Terragrunt | infra repo | ✅ |
| [satubinha-jenkins](https://github.com/fabricio-f5/hands-on-satubinha-jenkins) | Plataforma de execução de infra self-hosted | pipeline repo | ✅ |
| [satubinha-k8s](https://github.com/fabricio-f5/hands-on-satubinha-k8s) | EKS + GitHub Actions + deploy contínuo | fecha o ciclo | 🔲 em curso |