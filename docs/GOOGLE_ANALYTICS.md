# Google Analytics - Configuración

Esta guía te ayudará a configurar Google Analytics en BilleteSeguroBCB.

## 📊 ¿Por qué Google Analytics?

Google Analytics te permite rastrear:
- 📈 Número de visitantes y validaciones
- 🌍 Ubicación geográfica de usuarios
- 📱 Dispositivos usados (móvil, desktop, tablet)
- ⏱️ Tiempo en el sitio
- 🔄 Tasa de rebote
- 📄 Páginas más visitadas

## 🚀 Configuración Rápida

### Paso 1: Crear Propiedad en Google Analytics

1. Ve a [Google Analytics](https://analytics.google.com)
2. Inicia sesión con tu cuenta de Google
3. Click en **Admin** (engranaje en la esquina inferior izquierda)
4. Click en **Crear propiedad**
5. Completa el formulario:
   - **Nombre de la propiedad**: `Validador Billetes BCB`
   - **Zona horaria**: `GMT-4 (Bolivia)`
   - **Moneda**: `Boliviano (BOB)`
6. Click en **Siguiente**
7. Selecciona categoría: **Gobierno** o **Tecnología**
8. Click en **Crear**

### Paso 2: Obtener Measurement ID

1. En la propiedad recién creada, ve a **Flujos de datos**
2. Click en **Agregar flujo → Web**
3. Completa:
   - **URL del sitio web**: `https://tu-dominio.com`
   - **Nombre del flujo**: `Web`
4. Click en **Crear flujo**
5. Copia el **ID de medición** (formato: `G-XXXXXXXXXX`)

### Paso 3: Configurar en el Proyecto

#### Desarrollo Local

1. Crea archivo `.env.local` en la raíz del proyecto:
   ```bash
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

2. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

#### Producción (Coolify)

1. Ve a tu aplicación en Coolify
2. **Settings** → **Environment Variables**
3. Agrega nueva variable:
   - **Key**: `NEXT_PUBLIC_GA_ID`
   - **Value**: `G-XXXXXXXXXX`
4. **Save** y **Redeploy**

#### Producción (Vercel)

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Agrega:
   - **Key**: `NEXT_PUBLIC_GA_ID`
   - **Value**: `G-XXXXXXXXXX`
4. **Save** y redespliega

## ✅ Verificar Instalación

### Opción 1: Google Analytics Debugger

1. Instala la extensión [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
2. Activa la extensión
3. Abre tu sitio
4. Abre DevTools (F12) → Consola
5. Deberías ver mensajes de Google Analytics

### Opción 2: Tiempo Real en Google Analytics

1. Ve a Google Analytics
2. **Informes** → **Tiempo real** → **Visión general**
3. Abre tu sitio en otra pestaña
4. Deberías ver tu visita en tiempo real

### Opción 3: Verificar en Código Fuente

1. Abre tu sitio
2. Click derecho → **Ver código fuente**
3. Busca (Ctrl+F): `gtag`
4. Deberías ver el script de Google Analytics con tu ID

## 📊 Métricas Principales

Una vez configurado, podrás ver:

### Dashboard Principal
- Usuarios activos en tiempo real
- Total de usuarios (diario, semanal, mensual)
- Sesiones promedio
- Duración de sesión promedio
- Páginas vistas

### Informes Útiles

**Adquisición**
- ¿De dónde vienen los usuarios? (directo, búsqueda, redes sociales)

**Comportamiento**
- Páginas más visitadas
- Flujo de comportamiento

**Conversiones** (Opcional)
- Puedes configurar eventos personalizados:
  - Validación exitosa
  - Validación fallida
  - Escaneo con cámara usado
  - Exportación de datos

## 🎯 Eventos Personalizados (Opcional)

Si quieres rastrear eventos específicos, puedes agregar código adicional.

### Ejemplo: Rastrear Validación

Edita `components/SerialInput.tsx`:

```typescript
const handleValidate = () => {
  // ... código existente ...
  
  // Enviar evento a Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'validacion', {
      event_category: 'billete',
      event_label: result.isValid ? 'valido' : 'invalido',
      value: denomination,
    });
  }
};
```

### Agregar tipos TypeScript

Crea `types/gtag.d.ts`:

```typescript
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export {};
```

## 🔒 Privacidad y GDPR

### Consideraciones

Si tienes usuarios de Europa, considera:

1. **Banner de Cookies**: Informar sobre el uso de cookies
2. **Opción de Opt-out**: Permitir deshabilitar Analytics
3. **Anonimización de IP**: Ya configurado por defecto en Next.js

### Deshabilitar Analytics (para usuarios que lo soliciten)

Agrega en el layout:

```typescript
// Deshabilitar Analytics si el usuario lo solicita
if (typeof window !== 'undefined') {
  const disableGA = localStorage.getItem('ga-disable');
  if (disableGA === 'true') {
    window[`ga-disable-${GA_ID}`] = true;
  }
}
```

## 🚫 Desactivar Analytics

Para desactivar temporalmente:

1. **Desarrollo**: Elimina `.env.local` o comenta la variable
2. **Producción**: Elimina la variable `NEXT_PUBLIC_GA_ID` en Coolify/Vercel

El código está diseñado para funcionar sin problema si no hay `GA_ID` configurado.

## 📈 Mejores Prácticas

1. **No rastrear en desarrollo**: La configuración actual solo rastrea si `GA_ID` está configurado
2. **Revisar regularmente**: Chequea Analytics al menos semanalmente
3. **Configurar alertas**: Para picos inusuales de tráfico
4. **Limpiar datos**: Filtra tráfico de bots si es necesario
5. **Cumplir con privacidad**: Respeta las leyes locales de protección de datos

## 🆘 Troubleshooting

### Analytics no aparece en mi sitio

**Verificar:**
- ✅ Variable `NEXT_PUBLIC_GA_ID` está configurada
- ✅ El ID tiene formato correcto: `G-XXXXXXXXXX`
- ✅ Redespliegue después de agregar la variable
- ✅ Verificar en código fuente que el script está presente

### Los datos no aparecen en Google Analytics

**Posibles causas:**
- Dar tiempo (puede tomar 24-48 horas para datos históricos)
- Verificar "Tiempo real" para datos inmediatos
- Asegurar que el ID sea correcto
- Deshabilitar bloqueadores de anuncios al probar

### El ID está expuesto en el código fuente

**Esto es normal y esperado**. Los IDs de Google Analytics (que comienzan con `G-`) son públicos y deben estar en el frontend. No son secretos.

## 📚 Recursos Adicionales

- [Google Analytics Documentation](https://developers.google.com/analytics)
- [Next.js Analytics Guide](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [Google Analytics Academy](https://analytics.google.com/analytics/academy/)

---

**¿Necesitas ayuda?** Consulta la documentación oficial o abre un issue en el repositorio.
