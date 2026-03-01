# Guía para Agregar Imágenes de Billetes

## Ubicación
Coloca las imágenes de los billetes en: `public/billetes/`

## Archivos Necesarios

### Opción 1: Formato JPG (Recomendado)
- `billete-10bs.jpg` - Imagen del billete de 10 Bolivianos
- `billete-20bs.jpg` - Imagen del billete de 20 Bolivianos
- `billete-50bs.jpg` - Imagen del billete de 50 Bolivianos

### Opción 2: Formato PNG
- `billete-10bs.png`
- `billete-20bs.png`
- `billete-50bs.png`

## Requisitos de las Imágenes

### Calidad y Formato
- **Formato**: JPG (preferido) o PNG
- **Resolución**: Mínimo 800x533px (ratio 3:2)
- **Tamaño**: Máximo 500KB por imagen
- **Orientación**: Horizontal (landscape)

### Contenido Visual
- Debe mostrar **claramente el número de serie** en la esquina superior derecha
- Buena iluminación, sin reflejos
- Enfoque nítido, especialmente en el área del número de serie
- Preferiblemente sobre fondo neutro

## Dónde Obtener las Imágenes

### Fuentes Oficiales
1. **Banco Central de Bolivia**: Sitio web oficial con imágenes de referencia
2. **Ministerio de Economía**: Documentos oficiales con fotografías de billetes

### Alternativa: Fotografiar Billetes Reales
Si decides fotografiar billetes:

1. **Iluminación**: Usa luz natural o luz blanca uniforme
2. **Cámara**: Celular en buena calidad (mínimo 12MP)
3. **Posición**: 
   - Coloca el billete sobre superficie lisa y clara
   - Fotografía desde arriba, perpendicular al billete
   - Asegúrate que el número de serie sea legible
4. **Edición**:
   - Recorta para mantener ratio 3:2
   - Ajusta brillo/contraste si es necesario
   - No uses filtros que alteren los colores reales

## Ejemplo de Estructura

```
public/
└── billetes/
    ├── billete-10bs.jpg  ← Billete de 10 Bs (color rojo/rosado)
    ├── billete-20bs.jpg  ← Billete de 20 Bs (color azul)
    └── billete-50bs.jpg  ← Billete de 50 Bs (color morado)
```

## Comportamiento del Sistema

### Con Imágenes
- Se mostrará la imagen real del billete
- Un recuadro rojo animado resaltará la ubicación del número de serie
- Al pasar el cursor, se oscurece ligeramente la imagen

### Sin Imágenes (Fallback)
- Se muestra un gradiente de color con formato del número de serie
- El sistema funciona normalmente sin las imágenes
- Es solo una mejora visual

## Verificación

Después de agregar las imágenes:

1. Reinicia el servidor de desarrollo: `npm run dev`
2. Navega a la página principal
3. Verifica que las imágenes se muestren en la sección "Guía de Referencia"
4. Confirma que el recuadro rojo resalte el número de serie correctamente

## Optimización Automática

Next.js optimizará automáticamente las imágenes:
- Conversión a WebP para navegadores compatibles
- Carga diferida (lazy loading)
- Redimensionamiento responsive
- Compresión automática

## Consideraciones Legales

⚠️ **Importante**: 
- Usa solo imágenes con permiso o de dominio público
- Las imágenes de billetes para uso educativo/informativo generalmente están permitidas
- Cita la fuente si usas imágenes oficiales del BCB
- No reproduzcas billetes a escala real (debe ser claramente diferente del tamaño real)

## Soporte

Si tienes problemas con las imágenes:
1. Verifica que los nombres de archivo sean exactos
2. Confirma que las imágenes estén en `public/billetes/`
3. Revisa la consola del navegador para errores
4. Asegúrate que el formato sea JPG o PNG válido
