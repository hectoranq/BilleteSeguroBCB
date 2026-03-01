# GitHub Actions

Este directorio contiene workflows de CI/CD para automatizar pruebas y validaciones.

## Workflows Disponibles

### docker-validation.yml

**Propósito**: Validar que el Dockerfile construye correctamente y la aplicación inicia sin errores.

**Se ejecuta en**:
- Push a `main` o `develop`
- Pull requests a `main`

**Pasos**:
1. ✅ Checkout del código
2. 🏗️ Build de la imagen Docker
3. 🧪 Inicia contenedor y valida health check
4. 📏 Reporta tamaño de imagen
5. 🔒 Escaneo de vulnerabilidades con Trivy (opcional)

**Caché**: Usa GitHub Actions cache para acelerar builds subsecuentes.

## Activar GitHub Actions

1. Los workflows están en `.github/workflows/`
2. Se activan automáticamente al hacer push
3. Ver resultados en la pestaña "Actions" de GitHub

## Personalización

### Cambiar ramas de validación

```yaml
on:
  push:
    branches: [ main, develop, tu-rama ]
```

### Deshabilitar escaneo de seguridad

Comenta o elimina el job `security-scan` si no lo necesitas.

### Agregar notificaciones

Puedes agregar notificaciones a Slack, Discord, etc. usando actions adicionales.

## Beneficios

- ✅ Validación automática antes de desplegar
- ✅ Previene errores en producción
- ✅ Feedback inmediato en pull requests
- ✅ Escaneo de seguridad integrado
- ✅ Compatible con Coolify y otros PaaS

## Integración con Coolify

Coolify puede conectarse a GitHub y auto-desplegar cuando:
- El workflow de validación pasa ✅
- Se hace push a la rama configurada
- Se crea un nuevo tag/release

**Configuración en Coolify**:
1. Settings → Git
2. Habilitar "Auto Deploy"
3. Seleccionar rama (ej: `main`)
