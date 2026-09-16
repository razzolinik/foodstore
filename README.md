# Food Store — Catálogo con Autenticación y Roles

Trabajo Práctico — UTN FRM TUPAD
Alumna: Khiara Razzolini
Link al repositorio: https://github.com/razzolinik/foodstore 

## Descripción

Aplicación web desarrollada con **Vite + TypeScript** que simula una tienda de comidas (Food Store). Incluye:

- Registro e inicio de sesión con roles (`admin` / `client`), persistidos en `localStorage`.
- Protección de rutas: cada página valida el rol antes de mostrar contenido.
- Catálogo de productos con búsqueda por nombre y filtrado por categoría.
- Carrito de compras con agregar, modificar cantidad, eliminar y vaciar, persistido en `localStorage`.
- Panel de administración para gestionar productos (alta, edición y baja).

## Requisitos

- Node.js (versión 18 o superior)
- npm

## Instrucciones para ejecutarlo

1. Clonar o descomprimir el proyecto.
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Levantar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir la URL que muestra la terminal (por defecto `http://localhost:5173`).

### Cuenta de administrador de prueba

Al primer arranque se crea automáticamente un usuario admin:

- **Email:** admin@foodstore.com
- **Contraseña:** admin123

Para probar el rol `client`, hay que registrarse desde la pantalla de registro (los usuarios nuevos siempre se crean con ese rol).

### Generar build de producción

```bash
npm run build
npm run preview
```
