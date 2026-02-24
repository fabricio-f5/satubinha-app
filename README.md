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
* Bridge Network
* Docker Secrets
* Healthchecks

## Segurança

* Uso de Docker Secrets para a senha do banco.
* Imagens Chainguard para:

  * PostgreSQL
  * API
  * Frontend
* Rede privada isolada (`app-network`).
* Containers não expõem portas internas desnecessárias (apenas o frontend publica porta para o host).

Secret utilizado:

./secrets/db_password.txt


## Healthchecks Implementados

### Banco de Dados

pg_isready -U postgres -d satubinha

### API

Validação do endpoint:

GET http://localhost:4000/health

Se retornar status 200, o container é considerado saudável.

## Como Executar

### 1. Criar o secret

mkdir -p secrets
echo "suasenha123" > secrets/db_password.txt

### 2. Subir a aplicação

docker compose up --build

### 3. Acessar a aplicação

Frontend disponível em:

http://localhost:8081

## Conceitos DevOps Aplicados

* Infraestrutura como código
* Containers imutáveis
* Orquestração declarativa
* Segregação de ambientes
* Automação de migrations
* Observabilidade básica com healthchecks
* Uso de imagens minimalistas e seguras (Chainguard)

## Roadmap (Próximas Evoluções)

* Implementar CI/CD (GitHub Actions)
* Criar pipeline de build multi-stage
* Adicionar reverse proxy (Nginx)
* Implementar monitoramento (Prometheus + Grafana)
* Deploy em Kubernetes
* Implementar testes automatizados
* Implementar scan de vulnerabilidades (Trivy)
* Adicionar logs estruturados e tracing

## Objetivo do Projeto

O satubinha-app é um laboratório prático para evolução profissional em:

* DevOps
* Containers
* Segurança
* Automação
* Arquitetura moderna

O objetivo é evoluir gradualmente a aplicação até um cenário próximo ao de produção, incorporando práticas reais de mercado.

