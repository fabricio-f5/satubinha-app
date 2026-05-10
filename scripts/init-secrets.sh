#!/bin/bash

# ========================================
# Script para inicializar secrets locais
# ========================================

set -e

SECRETS_DIR="secrets"
COLORS_RED='\033[0;31m'
COLORS_GREEN='\033[0;32m'
COLORS_YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${COLORS_GREEN}Inicializador de Secrets - Satubinha Lab${NC}\n"

generate_password() {
    tr -dc 'A-Za-z0-9!@#%^&*' < /dev/urandom | head -c 24
}

mkdir -p "$SECRETS_DIR"

create_secret() {
    local filename=$1
    local description=$2
    local default_value=$3
    local secret_path="$SECRETS_DIR/$filename"

    if [ -f "$secret_path" ]; then
        echo -e "${COLORS_YELLOW}AVISO: $filename ja existe${NC}"
        read -p "Deseja sobrescrever? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return
        fi
    fi

    echo -e "${COLORS_GREEN}Criando $filename${NC}"
    echo "Descricao: $description"

    if [ "$INTERACTIVE" = "0" ]; then
        echo "$default_value" > "$secret_path"
    else
        read -p "Valor (Enter para usar gerado): " value
        echo "${value:-$default_value}" > "$secret_path"
    fi

    chmod 600 "$secret_path"
    echo -e "${COLORS_GREEN}Criado: $secret_path${NC}\n"
}

if [ -t 0 ]; then
    INTERACTIVE=1
else
    INTERACTIVE=0
    echo -e "${COLORS_YELLOW}Modo nao-interativo: usando valores gerados automaticamente${NC}\n"
fi

echo -e "${COLORS_YELLOW}Database:${NC}"
create_secret "db_user.txt" "Usuario do PostgreSQL" "postgres"
create_secret "db_password.txt" "Senha do PostgreSQL" "$(generate_password)"
create_secret "db_name.txt" "Nome do banco de dados" "satubinha"

echo -e "\n${COLORS_YELLOW}AWS (opcional):${NC}"
read -p "Deseja configurar AWS? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    mkdir -p "$SECRETS_DIR/aws"
    create_secret "aws/access_key.txt" "AWS Access Key ID" ""
    create_secret "aws/secret_key.txt" "AWS Secret Access Key" ""
fi

echo -e "\n${COLORS_GREEN}Secrets inicializados com sucesso!${NC}"

if grep -q "^secrets/" ".gitignore" 2>/dev/null; then
    echo -e "${COLORS_GREEN}OK: secrets/ esta no .gitignore${NC}"
else
    echo -e "${COLORS_RED}ATENCAO: secrets/ NAO esta no .gitignore${NC}"
    echo "Adicione: secrets/"
fi

echo -e "${COLORS_YELLOW}\nIMPORTANTE: salve os secrets em local seguro (ex: gerenciador de senhas).${NC}"
echo -e "${COLORS_YELLOW}Eles nao serao recuperaveis apos reinicializar.${NC}"
