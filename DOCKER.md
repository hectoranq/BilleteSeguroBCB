# Docker Deployment Guide

Este proyecto está completamente dockerizado para facilitar el despliegue en cualquier plataforma que soporte contenedores.

## 🏗️ Arquitectura del Dockerfile

El Dockerfile usa una estrategia **multi-stage build** con 3 etapas:

### Stage 1: Dependencies
- Instala solo las dependencias de producción
- Usa `npm ci` para builds reproducibles
- Imagen base: `node:20-alpine`

### Stage 2: Builder
- Copia las dependencias del stage anterior
- Compila la aplicación Next.js
- Genera el output standalone optimizado

### Stage 3: Runner
- Imagen final ultra-ligera
- Solo contiene los archivos necesarios para ejecutar
- Usuario no-root para seguridad
- Tamaño final: ~150-200MB

## 🚀 Comandos Básicos

### Build Local

```bash
# Construcción estándar
docker build -t billete-seguro-bcb:latest .

# Build con tag específico
docker build -t billete-seguro-bcb:v1.0.0 .

# Build sin caché (útil para troubleshooting)
docker build --no-cache -t billete-seguro-bcb:latest .
```

### Ejecutar Contenedor

```bash
# Ejecución básica
docker run -p 3000:3000 billete-seguro-bcb:latest

# Con nombre y modo detached
docker run -d --name billete-seguro -p 3000:3000 billete-seguro-bcb:latest

# Con restart automático
docker run -d --name billete-seguro --restart=unless-stopped -p 3000:3000 billete-seguro-bcb:latest
```

### Gestión de Contenedores

```bash
# Ver contenedores activos
docker ps

# Ver logs
docker logs billete-seguro

# Ver logs en tiempo real
docker logs -f billete-seguro

# Detener contenedor
docker stop billete-seguro

# Iniciar contenedor
docker start billete-seguro

# Eliminar contenedor
docker rm billete-seguro

# Eliminar contenedor forzadamente
docker rm -f billete-seguro
```

## 🔧 Docker Compose

### Estructura del docker-compose.yml

```yaml
version: '3.8'

services:
  billete-seguro:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Comandos Docker Compose

```bash
# Construir y ejecutar
docker-compose up -d

# Reconstruir y ejecutar
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Ver estado
docker-compose ps

# Detener servicios
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener, eliminar contenedores y volúmenes
docker-compose down -v
```

## ☁️ Despliegue en la Nube

### Coolify (Recomendado)

**Ver [COOLIFY.md](COOLIFY.md) para la guía completa.**

Configuración rápida:
1. Conecta tu repositorio Git a Coolify
2. Selecciona "Dockerfile" como tipo de aplicación
3. Puerto: `3000`
4. Despliega

Coolify detectará automáticamente el Dockerfile y configurará:
- ✅ SSL con Let's Encrypt
- ✅ Health checks automáticos
- ✅ Auto-deploys desde Git
- ✅ Zero downtime deployments

### Railway

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init

# Desplegar
railway up
```

### Render

1. Conecta tu repositorio
2. Selecciona "Docker"
3. Render detectará el Dockerfile automáticamente
4. Configura el puerto: `3000`
5. Despliega

### Docker Hub / Registry

```bash
# Login a Docker Hub
docker login

# Tag imagen
docker tag billete-seguro-bcb:latest your-username/billete-seguro-bcb:latest

# Push imagen
docker push your-username/billete-seguro-bcb:latest

# Pull en servidor de producción
docker pull your-username/billete-seguro-bcb:latest

# Ejecutar
docker run -d -p 3000:3000 your-username/billete-seguro-bcb:latest
```

## 🔍 Troubleshooting

### Problema: Build falla en etapa de dependencias

**Solución:**
```bash
# Limpiar caché de Docker
docker builder prune

# Build sin caché
docker build --no-cache -t billete-seguro-bcb:latest .
```

### Problema: Contenedor no inicia

**Verificar logs:**
```bash
docker logs billete-seguro
```

**Ejecutar en modo interactivo:**
```bash
docker run -it -p 3000:3000 billete-seguro-bcb:latest /bin/sh
```

### Problema: Puerto ya en uso

**Solución:**
```bash
# Usar otro puerto
docker run -p 8080:3000 billete-seguro-bcb:latest

# O detener el proceso que usa el puerto 3000
```

### Problema: Imagen muy grande

**Verificar tamaño:**
```bash
docker images billete-seguro-bcb
```

**El Dockerfile ya está optimizado con:**
- Multi-stage builds
- Alpine Linux como base
- Output standalone de Next.js
- .dockerignore apropiado

## 🔐 Seguridad

### Mejores Prácticas Implementadas

✅ Usuario no-root (nextjs:nodejs)
✅ Imagen base Alpine (menor superficie de ataque)
✅ Multi-stage build (no incluye herramientas de desarrollo)
✅ Dependencias bloqueadas (npm ci)
✅ .dockerignore para excluir archivos sensibles

### Recomendaciones Adicionales

```bash
# Escanear vulnerabilidades (requiere Docker Scout)
docker scout cves billete-seguro-bcb:latest

# O usar Trivy
docker run aquasec/trivy image billete-seguro-bcb:latest
```

## 📊 Monitoreo

### Health Checks

El docker-compose.yml incluye un health check:

```yaml
healthcheck:
  test: ["CMD", "wget", "--spider", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Recursos

```bash
# Ver uso de recursos
docker stats billete-seguro

# Limitar recursos
docker run -d \
  --name billete-seguro \
  --memory="512m" \
  --cpus="0.5" \
  -p 3000:3000 \
  billete-seguro-bcb:latest
```

## 🎯 Variables de Entorno

El proyecto actualmente no requiere variables de entorno obligatorias, pero puedes configurar:

```bash
# Archivo .env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Ejecutar con variables
docker run -d \
  --name billete-seguro \
  --env-file .env \
  -p 3000:3000 \
  billete-seguro-bcb:latest
```

## 📝 Notas

- El output standalone de Next.js reduce el tamaño de la imagen final
- Los datos se almacenan en localStorage del navegador (no necesita volúmenes)
- La aplicación es completamente stateless
- No requiere base de datos externa
- OCR se procesa en el cliente (Tesseract.js)

---

Para más información, consulta el [README.md](README.md) principal.
