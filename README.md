# Web de miniaturas de impresión 3D

Sitio web de **Amaia García Martín** para ofrecer servicios domésticos de diseño,
impresión, retoque y pintura de miniaturas 3D por encargo, con especial atención a
juegos de rol y wargames.

**En línea:** https://ea2oy.github.io/web-kitsune/

## Apartados

| Sección | Contenido |
|---|---|
| Inicio | Presentación del servicio con una pieza destacada |
| Servicios | Diseño, impresión, retoque, pintura, peanas y series |
| Trabajos | Portfolio de piezas reales, con filtros y visor ampliado |
| La impresión 3D | Cómo funciona el FDM, el proceso en seis fases y comparativa con la resina |
| Sobre mí | Trayectoria y forma de trabajo |
| Preguntas | Dudas frecuentes antes de encargar |
| Contacto | Formulario de encargo con validación |

## Características técnicas

- **Sin dependencias externas.** HTML, CSS y JavaScript propios; no requiere compilación
  ni instalación. Se abre con doble clic y se publica en cualquier alojamiento estático.
- **Diseño adaptable verificado** en nueve tamaños de pantalla, de 320 px a 1920 px.
- **Móvil cuidado:** márgenes seguros para pantallas con muesca, campos de 16 px para
  evitar el zoom automático de iOS, objetivos táctiles de 44 px y prefijos para Safari.
- **Portfolio interactivo:** filtros por categoría y visor ampliado navegable con teclado.
- **Accesibilidad:** navegación por teclado, textos alternativos descriptivos, soporte
  para `prefers-reduced-motion` y contenido visible aunque JavaScript esté desactivado.
- **Privacidad:** las fotografías publicadas están recortadas y sin metadatos EXIF
  (ni GPS ni datos del dispositivo).

## Estructura

```
index.html      Página completa con los siete apartados
styles.css      Estilos: paleta azul y morado, diseño adaptable y animaciones
script.js       Menú móvil, filtros, visor ampliado y validación del formulario
IMG_*.jpg       Fotografías del portfolio, sin metadatos
```

## Publicación

El sitio se sirve con **GitHub Pages** desde la rama `main`, en la raíz del repositorio.
Cualquier cambio que se suba a `main` se publica automáticamente en un par de minutos.

## Personalización

- **Textos:** todo el contenido está en `index.html`, en español y sin plantillas.
- **Colores:** las variables están al principio de `styles.css`, en `:root`.
- **Fotografías:** sustituye los archivos `IMG_*.jpg` manteniendo el nombre, o cambia la
  ruta y los atributos `width` y `height` en `index.html` con las medidas reales.

## Nota sobre el formulario

Al ser un sitio estático, el formulario no envía correos por sí solo: valida los campos y
copia el resumen del encargo al portapapeles con el enlace de contacto, listo para pegar
en un mensaje. Para recibir los envíos por correo hace falta un servicio externo
(por ejemplo Formspree) y una cuenta asociada.
