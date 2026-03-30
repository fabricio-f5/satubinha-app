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

A aplicação é composta por:

| Serviço | Tecnologia                 | Responsabilidade        |
| ------- | -------------------------- | ----------------------- |
| db      | PostgreSQL (Chainguard)    | Banco de dados          |
| migrate | Flyway 12                  | Execução das migrations |
| api     | Node.js (Chainguard)       | Backend da aplicação    |
| front   | Aplicação Web (Chainguard) | Interface do usuário    |

## Fluxo de Inicialização

1. O PostgreSQL sobe.
2. O healthcheck valida se o banco está pronto.
3. O Flyway executa as migrations.
4. A API sobe após as migrations concluídas com sucesso.
5. O Frontend sobe após a API estar saudável.

Esse fluxo garante ordem correta de inicialização, padrão importante em ambientes reais e pipelines de CI/CD.

## Tecnologias Utilizadas

* Docker
* Docker Compose
* PostgreSQL (Chainguard image)
* Flyway 12
* Node.js
* Jest + Supertest
* Bridge Network
* Docker Secrets
* Healthchecks

## Estrutura da API

A API foi refatorada para suportar injeção de dependências — separando a lógica dos endpoints da configuração de infraestrutura. Isso permite que os testes corram sem depender de Docker Secrets ou de um banco de dados real.

```
api/
├── src/
│   ├── server.js     # lógica pura — cria a app Express e os endpoints
│   └── index.js      # ponto de entrada em produção — lê secrets, cria pool, arranca servidor
├── tests/
│   ├── health.test.js
│   └── db.test.js
├── package.json
└── Dockerfile
```

### Por que dois ficheiros separados?

O `server.js` recebe o pool do banco como parâmetro — não sabe nada de secrets ou de ligações reais. O `index.js` é o único ficheiro que lê os Docker Secrets e cria o pool real. Nos testes, passa-se um pool falso (mock) ao `server.js` — sem precisar do banco a correr.

Este padrão chama-se **injeção de dependências** e é um dos mais usados em programação para tornar código testável.

## Segurança

* Uso de Docker Secrets para a senha do banco.
* Imagens Chainguard para:

  * PostgreSQL
  * API
  * Frontend
* Rede privada isolada (`app-network`).
* Containers não expõem portas internas desnecessárias (apenas o frontend publica porta para o host).

Secret utilizado:

```
./secrets/db_password.txt
```

## Healthchecks Implementados

### Banco de Dados

```
pg_isready -U postgres -d satubinha
```

### API

Validação do endpoint:

```
GET http://localhost:4000/health
```

Se retornar status 200, o container é considerado saudável.

## Testes

**Framework:** Jest + Supertest

**Cobertura:** 92% de linhas em `src/server.js` (mínimo exigido: 80%)

| Ficheiro          | O que testa                                      |
| ----------------- | ------------------------------------------------ |
| health.test.js    | GET /health → status 200 e body `{ status: ok }` |
| db.test.js        | GET /nomes, POST /nome, DELETE /nome/:id com mock DB |

Os testes usam um mock do pool do PostgreSQL — não precisam do banco a correr para executar.

### Como correr os testes

Os testes correm dentro do container para garantir o mesmo ambiente do CI:

```bash
docker compose run --rm api npm test
```

Para ver o relatório de cobertura:

```bash
docker compose run --rm api npm test -- --coverage
```

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

Frontend disponível em:

```
http://localhost:8081
```

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

## Roadmap

* [x] Containers isolados com Docker Compose
* [x] Docker Secrets para credenciais do banco
* [x] Imagens Chainguard (PostgreSQL, API, Frontend)
* [x] Migrations com Flyway
* [x] Healthchecks na API e no banco
* [x] Refatoração da API para injeção de dependências
* [x] Testes automatizados com Jest + Supertest
* [ ] CI/CD com GitHub Actions
* [ ] Scan de vulnerabilidades (Trivy)
* [ ] Análise de qualidade (SonarCloud)
* [ ] Deploy em Kubernetes (ver satubinha-k8s)

## Objetivo do Projeto

O satubinha-app é um laboratório prático para evolução profissional em:

* DevOps
* Containers
* Segurança
* Automação
* Testes
* Arquitetura moderna

O objetivo é evoluir gradualmente a aplicação até um cenário próximo ao de produção, incorporando práticas reais de mercado.

---

## Série hands-on-satubinha

| Projecto | Descrição | Relação | Estado |
|---|---|---|---|
| **satubinha-app** | App fullstack com Docker Compose, Chainguard, Flyway, testes | — | ✅ |
| [satubinha-iac-terragrunt](https://github.com/fabricio-f5/hands-on-satubinha-iac-terragrunt) | Infra AWS multi-ambiente com Terraform + Terragrunt | infra repo | ✅ |
| [satubinha-jenkins](https://github.com/fabricio-f5/hands-on-satubinha-jenkins) | Plataforma de execução de infra self-hosted | pipeline repo | ✅ |
| [satubinha-k8s](https://github.com/fabricio-f5/hands-on-satubinha-k8s) | EKS + GitHub Actions + deploy contínuo | fecha o ciclo | 🔲 em curso |