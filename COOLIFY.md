# Despliegue en Coolify

Guía completa para desplegar BilleteSeguroBCB en Coolify.

## 📋 Pre-requisitos

- Servidor con Coolify instalado
- Repositorio Git (GitHub, GitLab, etc.)
- Acceso SSH al servidor (opcional)

## 🚀 Configuración Inicial

### 1. Conectar Repositorio

1. Accede a tu panel de Coolify
2. Ve a **Projects** → **New Project**
3. Dale un nombre: `BilleteSeguroBCB`
4. Conecta tu repositorio Git

### 2. Configurar Aplicación

1. **Application Type**: Dockerfile
2. **Dockerfile Location**: `./Dockerfile` (raíz del proyecto)
3. **Port**: `3000`
4. **Build Pack**: Docker

### 3. Variables de Entorno (Opcional)

```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 4. Configuración de Red

- **Puerto Interno**: 3000
- **Puerto Externo**: Auto (Coolify lo asignará)
- **Dominio**: Configura tu dominio personalizado o usa el subdominio de Coolify

## ⚙️ Configuración Avanzada

### Health Check

El Dockerfile incluye un health check configurado:
- **Intervalo**: 30s
- **Timeout**: 10s
- **Start Period**: 40s
- **Retries**: 3

Coolify usará automáticamente este health check.

### Recursos

Valores recomendados para BilleteSeguroBCB:

```yaml
Resources:
  Memory Limit: 512MB
  Memory Reservation: 256MB
  CPU Limit: 0.5
  CPU Reservation: 0.25
```

### Volúmenes (No requeridos)

Esta aplicación es completamente stateless. Los datos se almacenan en localStorage del navegador, por lo que **NO necesita volúmenes persistentes**.

## 🔧 Configuración del Build

### Build Arguments (No requeridos)

El build no necesita argumentos especiales, todo está configurado en el Dockerfile.

### Build Command

Coolify ejecutará automáticamente:
```bash
docker build -t <image-name> .
```

## 🌐 Configuración de Dominio

### Opción 1: Subdominio de Coolify

Coolify asignará automáticamente un subdominio:
```
https://billete-seguro-abc123.coolify.io
```

### Opción 2: Dominio Personalizado

1. Ve a **Domains** en tu aplicación
2. Agrega tu dominio: `billetes.tudominio.com`
3. Configura los DNS en tu proveedor:
   ```
   Type: A
   Name: billetes
   Value: [IP-de-tu-servidor]
   ```
4. Coolify configurará automáticamente SSL con Let's Encrypt

## 🔒 SSL/TLS

Coolify maneja automáticamente:
- ✅ Certificados SSL con Let's Encrypt
- ✅ Renovación automática
- ✅ Redirección HTTP → HTTPS
- ✅ HSTS headers

No requiere configuración adicional.

## 📊 Monitoreo

### Logs

Ver logs en tiempo real:
```bash
# Desde el panel de Coolify
Logs → Real-time logs

# O vía CLI si tienes acceso SSH
docker logs -f <container-name>
```

### Métricas

Coolify proporciona:
- CPU usage
- Memory usage
- Network I/O
- Disk usage

## 🔄 Despliegue y Actualizaciones

### Despliegue Inicial

1. Click en **Deploy** en Coolify
2. Coolify clonará el repo, construirá la imagen y ejecutará el contenedor
3. Espera ~2-3 minutos para el primer build
4. La aplicación estará disponible en el dominio configurado

### Actualizaciones Automáticas

Habilitar **Auto Deploy** en Coolify para desplegar automáticamente cuando:
- Se hace push a la rama principal
- Se crea un nuevo tag/release

### Actualizaciones Manuales

1. Haz push de tus cambios a Git
2. Ve a Coolify → Tu aplicación
3. Click en **Redeploy**

### Zero-Downtime Deployments

Coolify soporta despliegues sin tiempo de inactividad:
1. **Settings** → **Advanced**
2. Habilita **Zero Downtime Deployment**

## 🐛 Troubleshooting

### Build falla

**Verificar:**
```bash
# En el panel de Coolify, ve a Build Logs
# Busca errores en las etapas:
- Dependencies installation
- Application build
- Docker image creation
```

**Soluciones comunes:**
- Verificar que `package.json` y `package-lock.json` estén en el repo
- Asegurar que el `Dockerfile` esté en la raíz
- Verificar que `next.config.mjs` tenga `output: 'standalone'`

### Contenedor no inicia

**Verificar logs:**
```bash
docker logs <container-name>
```

**Verificar health check:**
```bash
# En Coolify, ve a Health Checks
# Debe mostrar: Healthy
```

### Puerto no accesible

**Verificar:**
1. Puerto interno configurado: `3000`
2. Firewall del servidor permite tráfico
3. Coolify proxy está funcionando

### SSL no funciona

**Verificar:**
1. DNS apunta correctamente al servidor
2. Puerto 80 y 443 están abiertos
3. Dominio está verificado en Coolify

## 📝 Checklist de Producción

Antes de ir a producción:

- [ ] Dominio personalizado configurado
- [ ] SSL habilitado y funcionando
- [ ] Health check reporta "Healthy"
- [ ] Logs muestran inicio exitoso
- [ ] Auto-deploy configurado (opcional)
- [ ] Backups de configuración (exportar desde Coolify)
- [ ] Recursos (CPU/RAM) dimensionados apropiadamente
- [ ] Monitoreo habilitado

## 🎯 Comandos Útiles

### Acceso SSH al servidor

```bash
# Conectar al servidor
ssh user@your-server.com

# Ver contenedores
docker ps

# Ver logs de la aplicación
docker logs -f billete-seguro-bcb

# Reiniciar aplicación
docker restart billete-seguro-bcb

# Ver uso de recursos
docker stats billete-seguro-bcb
```

### Backup de datos

Como la aplicación usa localStorage del navegador:
- No hay datos en servidor para respaldar
- Los usuarios deben exportar su historial si desean conservarlo

## 🔐 Seguridad en Producción

### Headers de Seguridad

Next.js ya incluye headers de seguridad por defecto:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

### Recomendaciones

1. **Mantener actualizado**: 
   ```bash
   # Actualizar dependencias regularmente
   npm update
   npm audit fix
   ```

2. **No exponer `.env` files**:
   - Ya está en `.dockerignore`
   - Usar variables de entorno de Coolify

3. **HTTPS obligatorio**:
   - Coolify maneja esto automáticamente

4. **Rate Limiting** (opcional):
   - Configurar en el proxy de Coolify o CloudFlare

## 📞 Soporte

### Recursos

- [Documentación de Coolify](https://coolify.io/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [GitHub Issues](https://github.com/your-repo/issues)

### Logs y Debugging

```bash
# Ver logs de Coolify
sudo journalctl -u coolify -f

# Ver logs de Docker
docker logs -f billete-seguro-bcb

# Inspeccionar contenedor
docker inspect billete-seguro-bcb
```

## 🚀 Ejemplo de Configuración Completa

### coolify.json (Opcional)

Puedes crear un `coolify.json` en la raíz del proyecto para pre-configurar:

```json
{
  "name": "BilleteSeguroBCB",
  "description": "Validador de Billetes BCB",
  "port": 3000,
  "buildPack": "dockerfile",
  "dockerfilePath": "./Dockerfile",
  "healthCheckPath": "/",
  "environment": {
    "NODE_ENV": "production",
    "NEXT_TELEMETRY_DISABLED": "1"
  }
}
```

---

**¡Listo!** Tu aplicación estará disponible en producción con:
- ✅ SSL automático
- ✅ Despliegues automáticos
- ✅ Monitoreo integrado
- ✅ Zero downtime deployments
- ✅ Logs centralizados
