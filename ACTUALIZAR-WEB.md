# Cómo actualizar la web

La web está publicada con **GitHub Pages** y se actualiza sola cada vez que subes
cambios a la rama `main`. No hay que compilar nada ni instalar programas.

- **Web en línea:** https://ea2oy.github.io/web-kitsune/
- **Repositorio:** https://github.com/EA2OY/web-kitsune

## Qué archivos tocar

| Quiero cambiar... | Archivo |
|---|---|
| Cualquier texto de la web | `index.html` |
| Colores | `styles.css` (bloque `:root`, al principio del archivo) |
| Una fotografía | Sustituye el `IMG_*.jpg` manteniendo el nombre |
| El comportamiento de los filtros o del visor | `script.js` |

Si cambias una fotografía por otra de distinto tamaño, actualiza también sus atributos
`width` y `height` en `index.html`: evitan que la página "salte" mientras carga.

## Cómo publicar un cambio

**Opción A — Desde la web de GitHub (la más rápida, sin instalar nada)**

1. Entra en https://github.com/EA2OY/web-kitsune
2. Abre el archivo que quieras (por ejemplo `index.html`).
3. Pulsa el icono del lápiz (*Edit this file*).
4. Haz el cambio y pulsa **Commit changes**.
5. En 1 o 2 minutos el cambio estará visible en la web.

**Opción B — Desde tu ordenador con git**

```bash
cd "C:\Users\Jesus\Desktop\webminiaturas"
git add -A
git commit -m "Describe aquí el cambio"
git push
```

Si `git push` te pide usuario y contraseña, el usuario es `EA2OY` y la contraseña es
tu token de GitHub (el que está en `Documents\TokenGithub.txt`).

## Comprobar que el cambio se ha publicado

```bash
curl -s -o NUL -w "%{http_code}" https://ea2oy.github.io/web-kitsune/
```

Debe responder `200`. Si sigue mostrando la versión antigua, espera un minuto y
recarga con `Ctrl + F5` (fuerza la recarga sin caché).

## Ver la web en tu ordenador antes de publicar

Abre `index.html` con doble clic. Funciona directamente, sin servidor. Para que las
rutas se comporten igual que en internet puedes levantar un servidor local:

```bash
cd "C:\Users\Jesus\Desktop\webminiaturas"
python -m http.server 4321
```

Y abre http://127.0.0.1:4321/ en el navegador.

## Aviso importante: las fotos originales

La carpeta `originales/` contiene tus fotografías tal y como salieron del móvil,
**con metadatos EXIF que incluyen GPS y datos del dispositivo**. Está excluida del
repositorio mediante `.gitignore`, así que no se publica.

No la añadas nunca al repositorio mientras sea público: revelaría la ubicación.
Si algún día quieres publicar esas versiones, primero hay que borrarles los metadatos.

## Activar el envío real del formulario

Ahora mismo el formulario valida los datos y copia el resumen del encargo al
portapapeles, listo para pegar en un mensaje. Para que envíe correos de verdad:

1. Crea una cuenta gratuita en [Formspree](https://formspree.io) y añade un formulario.
2. Copia la URL que te dan (con el formato `https://formspree.io/f/xxxxxxx`).
3. En `script.js`, dentro del bloque `form.addEventListener('submit', ...)`, añade una
   llamada a `fetch` con esa URL enviando el `FormData` del formulario.

Con eso los encargos llegarían directamente a tu correo.

## Herramientas de verificación (opcionales)

La carpeta `.dev/` (no publicada) contiene los scripts con los que se comprobó la web.
Necesitan Chrome abierto con `--remote-debugging-port=9222` y el servidor local activo:

| Script | Para qué sirve |
|---|---|
| `verify-responsive.mjs` | Mide la maquetación en 9 tamaños de pantalla |
| `verificar-publicada.mjs` | Comprueba la web ya publicada en GitHub Pages |
| `diagnostico-imagenes.mjs` | Revisa que todas las imágenes carguen bien |
| `procesar-fotos.mjs` | Recorta y limpia los metadatos de las fotos |
| `publicar.mjs` | Crea el repositorio y activa Pages |

## Si algún día quieres un dominio propio

Se puede usar el dominio que quieras (por ejemplo `kitsune-miniaturas.com`) en lugar de
la dirección `github.io`. Se configura en **Settings → Pages → Custom domain**, y en tu
proveedor de dominio hay que crear un registro `CNAME` apuntando a `ea2oy.github.io`.
