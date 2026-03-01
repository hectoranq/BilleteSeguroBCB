# Checklist Pre-Despliegue a Coolify

Usa este checklist antes de desplegar a producción en Coolify.

## 📋 Preparación Local

### Archivos y Configuración
- [ ] `Dockerfile` existe en la raíz del proyecto
- [ ] `.dockerignore` está configurado
- [ ] `next.config.mjs` tiene `output: 'standalone'`
- [ ] `package.json` tiene todos los scripts necesarios
- [ ] `.coolify.json` está presente (opcional pero recomendado)

### Build Local
- [ ] `npm install` ejecuta sin errores
- [ ] `npm run build` completa exitosamente
- [ ] `npm start` inicia la aplicación localmente
- [ ] No hay errores de TypeScript: `npm run lint`

### Docker Local (Recomendado)
- [ ] Ejecutar `.\validate-docker.ps1` (Windows) o `./validate-docker.sh` (Linux/Mac)
- [ ] Build de Docker completa sin errores
- [ ] Contenedor inicia correctamente
- [ ] Health check responde HTTP 200
- [ ] Tamaño de imagen es razonable (~150-250MB)

## 🔐 Seguridad

### Archivos Sensibles
- [ ] `.env` está en `.gitignore` (NO subir a Git)
- [ ] `.env.local` está en `.gitignore`
- [ ] No hay claves API o secretos en el código
- [ ] No hay credenciales en archivos de configuración

### Dependencias
- [ ] `npm audit` no muestra vulnerabilidades críticas
- [ ] Dependencias están actualizadas: `npm outdated`
- [ ] `package-lock.json` está versionado en Git

## 📦 Git y Repositorio

### Commits y Tags
- [ ] Todos los cambios están commiteados
- [ ] Mensaje de commit descriptivo
- [ ] Push a la rama correcta (main/develop)
- [ ] (Opcional) Tag de versión creado: `git tag v1.0.0`

### Repositorio
- [ ] Repositorio está en GitHub/GitLab
- [ ] README.md está actualizado
- [ ] CHANGELOG.md refleja cambios (si aplica)
- [ ] Documentación técnica completa

## ☁️ Configuración de Coolify

### Conexión
- [ ] Coolify tiene acceso al repositorio
- [ ] Branch correcta seleccionada
- [ ] Webhook configurado (para auto-deploy)

### Configuración de Aplicación
- [ ] Nombre de aplicación: `BilleteSeguroBCB`
- [ ] Tipo: Dockerfile
- [ ] Puerto interno: `3000`
- [ ] Dockerfile path: `./Dockerfile`

### Variables de Entorno
- [ ] `NODE_ENV=production`
- [ ] `NEXT_TELEMETRY_DISABLED=1`
- [ ] Otras variables según necesidad

### Recursos
- [ ] Memory Limit: 512MB (mínimo recomendado)
- [ ] CPU Limit: 0.5 cores (mínimo recomendado)
- [ ] Ajustar según carga esperada

## 🌐 Dominio y Red

### Dominio
- [ ] Dominio personalizado configurado (opcional)
- [ ] DNS apunta al servidor Coolify
- [ ] Registros A/CNAME configurados correctamente

### SSL/TLS
- [ ] SSL habilitado en Coolify
- [ ] Let's Encrypt configurado
- [ ] HTTPS funciona correctamente
- [ ] Redirección HTTP → HTTPS activa

## 🏥 Monitoreo y Health Checks

### Health Checks
- [ ] Health check path: `/`
- [ ] Interval: 30s
- [ ] Timeout: 10s
- [ ] Retries: 3
- [ ] Start period: 40s

### Logs
- [ ] Logs visibles en Coolify
- [ ] No hay errores en logs iniciales
- [ ] Formato de logs es legible

## 🧪 Pruebas

### Funcionalidad
- [ ] Página principal carga correctamente
- [ ] Validación de billetes funciona
- [ ] Escaneo con cámara funciona (si HTTPS)
- [ ] Historial se guarda correctamente
- [ ] Estadísticas se muestran correctamente
- [ ] Modo oscuro funciona
- [ ] Responsive en móvil

### Performance
- [ ] Tiempo de carga < 3 segundos
- [ ] Imágenes optimizadas
- [ ] CSS/JS minificados
- [ ] Next.js optimizations activas

### Navegadores
- [ ] Chrome/Edge: ✅
- [ ] Firefox: ✅
- [ ] Safari: ✅
- [ ] Móvil (Chrome/Safari): ✅

## 🚀 Despliegue

### Pre-Despliegue
- [ ] Notificar a usuarios (si hay usuarios activos)
- [ ] Backup de configuración actual (si aplica)
- [ ] Ventana de mantenimiento planificada (opcional)

### Durante Despliegue
- [ ] Monitorear logs en tiempo real
- [ ] Verificar que el build completa
- [ ] Verificar que el contenedor inicia
- [ ] Verificar health checks pasan

### Post-Despliegue
- [ ] Aplicación accesible en el dominio
- [ ] HTTPS funciona correctamente
- [ ] Certificado SSL válido
- [ ] Todas las funcionalidades operativas
- [ ] No hay errores en logs
- [ ] Performance aceptable

## 📊 Validación Final

### Testing en Producción
- [ ] Validar un billete de cada denominación (10, 20, 50 Bs)
- [ ] Probar validación con número válido
- [ ] Probar validación con número inválido
- [ ] Verificar que el historial se guarda
- [ ] Exportar datos funciona
- [ ] Cambiar tema claro/oscuro

### Monitoring
- [ ] Health checks muestran "Healthy"
- [ ] Uso de CPU normal (<50%)
- [ ] Uso de memoria normal (<400MB)
- [ ] Sin errores en logs
- [ ] Tiempos de respuesta aceptables

## 🎉 Post-Despliegue

### Documentación
- [ ] Actualizar documentación con URL de producción
- [ ] Documentar cualquier issue encontrado
- [ ] Actualizar versión en package.json
- [ ] Crear release en GitHub (opcional)

### Comunicación
- [ ] Notificar a usuarios que la app está lista
- [ ] Compartir URL de producción
- [ ] Proveer documentación de uso
- [ ] Establecer canal de soporte

### Monitoreo Continuo
- [ ] Configurar alertas en Coolify (opcional)
- [ ] Revisar logs periódicamente
- [ ] Monitorear uso de recursos
- [ ] Planificar actualizaciones futuras

## ⚠️ Rollback Plan

En caso de problemas críticos:

1. **Coolify**: Click en "Rollback" para volver a versión anterior
2. **Git**: Revertir commit problemático y re-desplegar
3. **Manual**: Detener contenedor y iniciar versión anterior

```bash
# Si tienes acceso SSH
docker stop billete-seguro-bcb
docker run -d --name billete-seguro-bcb -p 3000:3000 imagen-anterior:tag
```

## 📞 Contactos de Emergencia

- **Administrador Servidor**: _______
- **Equipo DevOps**: _______
- **Soporte Coolify**: https://coolify.io/docs
- **Issues GitHub**: [Tu Repositorio]/issues

---

## ✅ Checklist Summary

```
Total Items: ~80
Required Items: ~50
Optional Items: ~30

Prioridades:
🔴 CRÍTICO: Build local exitoso, Docker funciona, sin secretos en Git
🟡 IMPORTANTE: Tests pasan, health checks configurados
🟢 OPCIONAL: GitHub Actions, monitoreo avanzado
```

**Cuando hayas completado ≥90% de items críticos e importantes, estás listo para desplegar! 🚀**
