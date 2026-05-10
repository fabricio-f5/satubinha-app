# 🔐 Guia de Segurança de Secrets

## ⚠️ NUNCA faça commit de secrets no Git!

Este guia explica como gerenciar credenciais e dados sensíveis no Satubinha Lab.

---

## 📁 Estrutura de Secrets

```
secrets/
├── db_user.txt           # Usuário do PostgreSQL
├── db_password.txt       # Senha do PostgreSQL
├── db_name.txt           # Nome do banco de dados
└── aws/                  # (Opcional) Credenciais AWS
    ├── access_key.txt
    └── secret_key.txt
```

### ✅ Está no `.gitignore`?
Verifique que a pasta `secrets/` está configurada no `.gitignore`:

```bash
cat .gitignore | grep secrets/
```

Se não estiver, adicione:
```
secrets/
```

---

## 🚀 Setup Inicial (Para novos devs)

### Opção 1: Script Automatizado (Recomendado)

```bash
chmod +x scripts/init-secrets.sh
./scripts/init-secrets.sh
```

O script irá:
- Criar a pasta `secrets/`
- Solicitar valores para cada secret
- Usar valores padrão se não especificar
- Verificar `.gitignore`

### Opção 2: Manual

```bash
# Criar diretório
mkdir -p secrets

# Criar arquivos de secret
echo "postgres" > secrets/db_user.txt
echo "sua_senha_super_segura" > secrets/db_password.txt
echo "satubinha" > secrets/db_name.txt

# Proteger permissões
chmod 600 secrets/*.txt
```

---

## 🐳 Usando com Docker Compose

Os secrets são montados automaticamente como arquivos em `/run/secrets/` dentro dos containers:

```yaml
db:
  environment:
    POSTGRES_USER_FILE: /run/secrets/db_user
    POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    POSTGRES_DB_FILE: /run/secrets/db_name
  secrets:
    - db_user
    - db_password
    - db_name

secrets:
  db_user:
    file: secrets/db_user.txt
  db_password:
    file: secrets/db_password.txt
  db_name:
    file: secrets/db_name.txt
```

---

## 🔑 Variáveis de Ambiente vs Secrets

### Variáveis de Ambiente (`.env`)
✅ Usar para:
- Configurações não-sensíveis (portas, URLs)
- Flags de desenvolvimento
- Nomes de aplicações

❌ NÃO usar para:
- Senhas
- Tokens
- Chaves de API

### Secrets (arquivos em `/run/secrets/`)
✅ Usar para:
- Senhas de banco de dados
- Tokens de autenticação
- Chaves criptográficas
- Credenciais AWS

❌ NÃO usar para:
- Configurações de aplicação
- URLs públicas

---

## 📋 Checklist de Segurança

Antes de fazer deploy:

- [ ] `secrets/` está no `.gitignore`
- [ ] Nenhum arquivo `.txt` de secrets está commitado
- [ ] Senhas são fortes (min. 12 caracteres, com símbolos)
- [ ] Secrets são diferentes entre desenvolvimento e produção
- [ ] Histórico do Git não contém secrets antigos

### Verificar se algo foi commitado:

```bash
# Ver histórico de commits com "password", "secret", etc
git log --all --source --full-history -S "password" --oneline

# Se encontrou algo, limpe com:
git filter-branch --tree-filter 'rm -rf secrets/*.txt'
```

---

## 🚀 Produção vs Desenvolvimento

### Desenvolvimento
- Use valores padrão/demo
- Secrets em arquivos locais
- Não compartilhe com outros devs

### Produção
- Use gerenciador de secrets:
  - **AWS Secrets Manager**
  - **Vault by HashiCorp**
  - **Azure Key Vault**
  - **Docker Swarm Secrets** (para Swarm)
  - **Kubernetes Secrets** (para K8s)

---

## 🔄 Rotação de Secrets

Para mudar uma senha:

```bash
# 1. Gere a nova senha
echo "nova_senha_aqui" > secrets/db_password.txt

# 2. Reinicie o serviço
docker-compose down
docker-compose up -d

# 3. Atualize o secret em produção também!
```

---

## ⚡ Boas Práticas

1. **Nunca loguei secrets** - Remova logs com credenciais
2. **Rotação regular** - Troque senhas periodicamente (a cada 90 dias)
3. **Diferentes em cada ambiente** - Dev ≠ Staging ≠ Prod
4. **Backup seguro** - Mantenha backup de secrets em local seguro
5. **Auditoria** - Registre quem acessou/mudou secrets
6. **Princípio do menor privilégio** - Dê apenas as permissões necessárias

---

## 🆘 Emergência: Secret Exposto no Git

Se acidentalmente commitou um secret:

```bash
# OPÇÃO 1: Limpar do histórico (mais agressivo)
git filter-branch --tree-filter 'rm -f secrets/*.txt' HEAD
git push -f origin master

# OPÇÃO 2: Usar git-filter-repo (recomendado)
pip install git-filter-repo
git filter-repo --path secrets/ --invert-paths

# DEPOIS:
# 1. Rotacione IMEDIATAMENTE todas as credenciais
# 2. Notifique o time
# 3. Faça audit do acesso
```

---

## 📚 Referências

- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Docker Secrets](https://docs.docker.com/engine/swarm/secrets/)
- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- [HashiCorp Vault](https://www.vaultproject.io/)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)

---

## ❓ FAQ

**P: Posso compartilhar o `.env.example`?**
R: Sim! Use para template, mas NUNCA coloque valores reais.

**P: Como novo dev consegue os secrets?**
R: Distribua fora do Git (Slack privado, email criptografado, Vault, etc.)

**P: Posso versionar secrets encrypted?**
R: Sim! Use `git-crypt` ou `sealed-secrets`, mas é complexo.

**P: Qual é a melhor prática para CI/CD?**
R: Use gerenciador de secrets do seu CI/CD (GitHub Secrets, GitLab CI Variables, etc.)

---

**Última atualização:** 2026-05-10
**Versão:** 1.0
