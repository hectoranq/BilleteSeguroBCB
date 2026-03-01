#!/bin/bash
# Script de validación para Docker antes de desplegar en Coolify
# Ejecutar: chmod +x validate-docker.sh && ./validate-docker.sh

set -e

echo "🐳 Validando configuración Docker para Coolify..."
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Verificar que Docker esté instalado
echo -e "${YELLOW}Verificando Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker está instalado${NC}"

# Verificar archivos necesarios
echo ""
echo -e "${YELLOW}Verificando archivos necesarios...${NC}"

required_files=("Dockerfile" ".dockerignore" "next.config.mjs" "package.json")
all_files_exist=true

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file existe${NC}"
    else
        echo -e "${RED}❌ $file NO existe${NC}"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo ""
    echo -e "${RED}❌ Faltan archivos necesarios${NC}"
    exit 1
fi

# Verificar next.config.mjs tiene output: 'standalone'
echo ""
echo -e "${YELLOW}Verificando next.config.mjs...${NC}"
if grep -q "output.*standalone" next.config.mjs; then
    echo -e "${GREEN}✅ next.config.mjs tiene output: 'standalone'${NC}"
else
    echo -e "${YELLOW}⚠️  next.config.mjs NO tiene output: 'standalone'${NC}"
    echo -e "${YELLOW}   Esto es necesario para Docker${NC}"
fi

# Build de prueba
echo ""
echo -e "${YELLOW}Construyendo imagen de prueba...${NC}"
echo -e "${CYAN}Esto puede tomar varios minutos...${NC}"

if docker build -t billete-seguro-bcb:test . ; then
    echo -e "${GREEN}✅ Build exitoso${NC}"
else
    echo -e "${RED}❌ Build falló${NC}"
    exit 1
fi

# Verificar tamaño de imagen
echo ""
echo -e "${YELLOW}Verificando tamaño de imagen...${NC}"
image_size=$(docker images billete-seguro-bcb:test --format "{{.Size}}")
echo -e "${CYAN}📦 Tamaño de imagen: $image_size${NC}"

# Test de ejecución
echo ""
echo -e "${YELLOW}Iniciando contenedor de prueba...${NC}"
container_id=$(docker run -d -p 3001:3000 billete-seguro-bcb:test)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Contenedor iniciado: $container_id${NC}"
    
    # Esperar que la aplicación inicie
    echo -e "${CYAN}Esperando que la aplicación inicie (30 segundos)...${NC}"
    sleep 30
    
    # Verificar health check
    echo ""
    echo -e "${YELLOW}Verificando health check...${NC}"
    http_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ Health check exitoso (HTTP 200)${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check devolvió: $http_code${NC}"
    fi
    
    # Ver logs
    echo ""
    echo -e "${YELLOW}Últimas líneas de logs:${NC}"
    docker logs --tail 20 "$container_id"
    
    # Limpiar
    echo ""
    echo -e "${YELLOW}Limpiando contenedor de prueba...${NC}"
    docker stop "$container_id" > /dev/null
    docker rm "$container_id" > /dev/null
    echo -e "${GREEN}✅ Contenedor eliminado${NC}"
else
    echo -e "${RED}❌ No se pudo iniciar el contenedor${NC}"
    exit 1
fi

# Resumen
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Validación completada exitosamente${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📋 Siguiente paso:${NC}"
echo "   1. Subir cambios a Git: git push"
echo "   2. En Coolify: Conectar repositorio"
echo "   3. Configurar puerto: 3000"
echo "   4. Desplegar"
echo ""
echo -e "${CYAN}📖 Ver guía completa en COOLIFY.md${NC}"
echo ""
echo -e "${CYAN}💡 Tip: La imagen 'billete-seguro-bcb:test' está disponible localmente${NC}"
echo "   Para eliminarla: docker rmi billete-seguro-bcb:test"
echo ""
