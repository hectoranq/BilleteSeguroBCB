# Validador de Billetes BCB

Sistema de validación de billetes del Banco Central de Bolivia. Permite verificar si un billete está en la lista negra de series inhabilitadas.

## 🚀 Características

- ✅ **Validación de billetes** por número de serie (10, 20, 50 Bs)
- 📷 **Escaneo con cámara** y reconocimiento OCR (Tesseract.js)
- 📊 **Historial de validaciones** con filtros y búsqueda
- 📈 **Estadísticas detalladas** de validaciones y rangos inhabilitados
- 🌙 **Modo oscuro** con persistencia
- 📱 **Diseño responsive** para móviles, tablets y desktop
- 💾 **Almacenamiento local** sin necesidad de backend
- 📥 **Exportar datos** a CSV (historial y rangos)

## 🛠️ Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **OCR**: Tesseract.js
- **Iconos**: Lucide React + Material Symbols
- **Gestión de tema**: next-themes
- **Fechas**: date-fns

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn

## 🔧 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd BilleteSeguroBCB

# Instalar dependencias
npm install

# (Opcional) Agregar imágenes de billetes
# Coloca las imágenes en public/billetes/
# Ver public/billetes/README.md para detalles

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 📸 Configuración de Imágenes (Opcional)

Para mejorar la guía visual, puedes agregar imágenes reales de billetes:

1. Coloca las imágenes en `public/billetes/` con los nombres:
   - `billete-10bs.jpg` (o .png)
   - `billete-20bs.jpg` (o .png)
   - `billete-50bs.jpg` (o .png)

2. Las imágenes deben:
   - Mostrar claramente el número de serie
   - Tener ratio 3:2 (horizontal)
   - Ser de buena calidad (mínimo 800x533px)

3. Ver [public/billetes/README.md](public/billetes/README.md) para instrucciones detalladas

**Nota**: El sistema funciona perfectamente sin las imágenes usando gradientes de color como fallback.

## 🎯 Uso

### Validación Manual

1. Selecciona la denominación del billete (10, 20 o 50 Bs)
2. Ingresa el número de serie en el formato: **9 dígitos + espacio + clase** (ej: 295095770 A)
3. Presiona "Validar" para verificar si el billete está en la lista negra

### Escaneo con Cámara

1. Haz clic en el botón "Escanear" 
2. Permite el acceso a la cámara
3. Alinea el número de serie dentro del marco
4. Captura la foto
5. El sistema extraerá automáticamente el número de serie y lo validará

### Historial

- Accede al historial desde el ícono de reloj en el header
- Filtra por estado: Todos, Válidos, No Válidos
- Busca por número de serie o denominación
- Exporta el historial completo a CSV
- Limpia el historial cuando lo necesites

### Estadísticas

- Ve el total de validaciones realizadas
- Revisa estadísticas por denominación
- Consulta información sobre rangos inhabilitados
- Exporta rangos específicos por denominación

## 📊 Rangos Inhabilitados

Los rangos de billetes no válidos están definidos en `lib/data/billetes-invalidos.json`:

- **10 Bs**: 67,250,001 - 67,700,000
- **20 Bs**: 87,280,145 - 91,646,549
- **50 Bs**: 77,100,001 - 77,550,000

## 🏗️ Estructura del Proyecto

```
BilleteSeguroBCB/
├── app/                          # Páginas de Next.js (App Router)
│   ├── layout.tsx               # Layout principal con tema
│   ├── page.tsx                 # Página principal de validación
│   ├── historial/               # Página de historial
│   ├── estadisticas/            # Página de estadísticas
│   └── globals.css              # Estilos globales
├── components/                   # Componentes React
│   ├── Header.tsx               # Barra de navegación
│   ├── DenominationSelector.tsx # Selector de denominación
│   ├── SerialInput.tsx          # Input de número de serie
│   ├── ValidationResult.tsx     # Resultado de validación
│   ├── ReferenceGuide.tsx       # Guía visual
│   ├── BlacklistRanges.tsx      # Tabla de rangos
│   ├── ScanDialog.tsx           # Modal de escaneo con cámara
│   └── theme-provider.tsx       # Proveedor de tema
├── lib/                          # Lógica de negocio
│   ├── types.ts                 # Definiciones TypeScript
│   ├── validation.ts            # Validación de billetes
│   ├── storage.ts               # Almacenamiento local
│   ├── ocr.ts                   # Procesamiento OCR
│   ├── utils.ts                 # Utilidades
│   └── data/
│       └── billetes-invalidos.json # Lista negra
├── public/                       # Archivos estáticos
├── next.config.mjs              # Configuración de Next.js
├── tailwind.config.ts           # Configuración de Tailwind
└── tsconfig.json                # Configuración de TypeScript
```

## 🎨 Personalización

### Actualizar Rangos Inhabilitados

Edita `lib/data/billetes-invalidos.json`:

```json
{
  "10": {
    "rangos": [
      { "inicio": 67250001, "fin": 67700000 }
    ],
    "series_especificas": ["AA1234567"]
  }
}
```

### Modificar Colores

Edita `tailwind.config.ts` para cambiar el esquema de colores:

```typescript
colors: {
  primary: {
    DEFAULT: "#e85d04", // Color primario
  }
}
```

## 🚀 Despliegue en Vercel

1. Empuja tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Vercel detectará automáticamente Next.js
4. Presiona "Deploy"

El sitio estará disponible en `https://tu-proyecto.vercel.app`

## 🔒 Consideraciones de Seguridad

- Los datos se almacenan localmente en el navegador (localStorage)
- No se envía información a servidores externos
- El OCR se procesa completamente en el cliente
- La lista negra está compilada en el build (no modificable en runtime)

## 📝 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles

## 👤 Autor

**Ivan H. Aquino Apaza** - Banco Central de Bolivia

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte o consultas, contacta al equipo del Banco Central de Bolivia.

---

Desarrollado con ❤️ para el Banco Central de Bolivia
