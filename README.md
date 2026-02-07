# 💧 Lumina APR (Sistema de Agua Potable Rural)

¡Hola! 👋 Bienvenido a tu proyecto **Lumina APR**. 

Este archivo es un `README` (léeme), y sirve para explicarte de qué trata este proyecto y cómo hacerlo funcionar en tu computador. Como me contaste que estás empezando en este mundo de la programación, lo he escrito todo de forma muy sencilla. ¡Ánimo! 🚀

---

## 🤔 ¿Qué es esto?

Este es un **Sistema de Gestión para APR (Agua Potable Rural)**. Básicamente, es una página web moderna que permite a los comités de agua:
- Registrar socios (las personas que viven ahí).
- Anotar las lecturas de los medidores de agua cada mes.
- Calcular cuánto debe pagar cada vecino (facturación).
- Ver gráficos y estadísticas bonitas.

Lo genial es que **funciona sin internet** (guardamos los datos en tu propio navegador) y tiene un diseño moderno llamado "Glassmorphism" (parece vidrio esmerilado).

---

## 🛠️ ¿Qué necesitas tener instalado?

Antes de empezar, necesitas una herramienta clave en tu computador llamada **Node.js**.

1.  **Node.js**: Es como el motor que permite ejecutar código moderno de JavaScript fuera del navegador.
    *   👉 [Descárgalo aquí](https://nodejs.org/es/) (instala la versión que dice "LTS", que es la más estable).
    *   Para saber si ya lo tienes, abre una terminal (o consola) y escribe: `node -v`

---

## 🚀 ¿Cómo hago funcionar el proyecto?

Sigue estos 3 pasos simples:

### 1. Abrir la terminal
Abre la carpeta del proyecto (`Apr 3.0`) en tu editor de código (como Visual Studio Code). Luego, abre la terminal integrada (generalmente presionando `Ctrl + ñ` o en el menú *Terminal > Nueva Terminal*).

### 2. Instalar las dependencias
Las "dependencias" son librerías (código que otros escribieron) que nuestro proyecto necesita para funcionar (como React, gráficas, iconos, etc.). Para descargarlas, escribe este comando y presiona Enter:

```bash
npm install
```
*Veraś que aparece una carpeta llamada `node_modules`. ¡No la toques! Ahí vive toda la magia que acabas de descargar.*

### 3. ¡Arrancar el servidor!
Ahora vamos a encender la aplicación para verla en tu navegador. Escribe:

```bash
npm run dev
```

Si todo sale bien, verás un mensaje con un link, algo como `Local: http://localhost:5173`.
Haz **Ctrl + Click** en ese link (o cópialo y pégalo en Chrome/Edge).

¡Listo! 🎉 Deberías ver la pantalla de inicio de sesión de Lumina APR.

---

## 📂 ¿Cómo está organizado el código?

Aquí te explico las carpetas más importantes para que no te pierdas:

*   **`src/`**: Aquí está TODO el código fuente que nosotros escribimos.
    *   **`src/main.jsx`**: Es la entrada principal, el "Big Bang" de la aplicación.
    *   **`src/App.jsx`**: Es el componente principal que decide qué página mostrar (Rutas).
    *   **`src/pages/`**: Aquí están las pantallas de la app (Login, Dashboard, Socios, etc.).
    *   **`src/components/`**: Piezas de LEGO reutilizables (como el menú lateral `Layout.jsx`).
    *   **`src/context/`**: Maneja "estados globales", como saber si el usuario está logueado o no.
    *   **`src/db/`**: Aquí configuramos la base de datos local (Dexie).

*   **`index.html`**: El archivo base de la página web.
*   **`package.json`**: Es como el DNI del proyecto. Dice cómo se llama, qué versión es y qué librerías necesita.

---

## 🧪 Tecnologías que estás usando (para presumir)

Si alguien te pregunta "¿En qué está hecho?", diles esto:
*   **React**: La librería más popular del mundo para crear interfaces web.
*   **Vite**: La herramienta que hace que todo cargue súper rápido.
*   **Dexie.js (IndexedDB)**: Una base de datos que vive DENTRO del navegador del usuario (por eso funciona offline).
*   **CSS Puro**: Todo el diseño bonito lo hicimos a mano con CSS, sin usar librerías de estilos pesadas.

---

¡Disfruta tu aprendizaje! Si rompes algo, no te preocupes, es la mejor forma de aprender. 😄
