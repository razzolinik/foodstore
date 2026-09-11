# Foodstore — Autenticación y Roles (TP TypeScript)

Evolución del TP anterior (HTML/CSS/JS plano) hacia Vite + TypeScript,
sumando Registro, Login y protección de rutas por rol con localStorage.
Se mantiene el diseño, la paleta y el catálogo del TP de DOM original.

## ⚠️ Nivel de seguridad

Esta autenticación es **educativa**, no apta para producción: toda la
validación ocurre en el cliente y los datos viven en `localStorage`, así
que cualquiera con las dev tools puede leerlos o modificarlos. En un
entorno real esto se resuelve con un backend.

## Instalación

```bash
npm install
npm run dev
```

## Cuenta de administrador de prueba

El primer arranque siembra un usuario admin (ver `sembrarDatosIniciales`
en `src/utils/storage.ts`), porque el registro solo crea cuentas client:

- Email: `admin@foodstore.com`
- Contraseña: `admin123`

## Qué cambió respecto al TP anterior

- `index.html` (la vitrina de productos) pasó a ser `src/pages/client/client.html`,
  protegida con `data-role="client"`. El markup, el CSS y la lógica de
  `cargarCategorias` / `cargarProductos` son los mismos, ahora tipados
  y leyendo el catálogo desde `localStorage` en vez de `data.js`.
- `admin.html` pasó a `src/pages/admin/admin.html` (`data-role="admin"`),
  con la tabla y el formulario de "Agregar Producto Rápido" ahora
  conectados de verdad: agregar, editar y eliminar productos persisten.
- `login.html` se mantiene con el mismo diseño (`login.css`) y ahora
  valida contra usuarios reales en vez de ser un formulario estático.
- Se agregó `src/pages/auth/registro/registro.html`, con el mismo estilo
  que el login, para dar de alta cuentas (siempre con rol `client`).

## Estructura

```
src/
├─ pages/
│  ├─ auth/
│  │  ├─ login/       Login: valida contra "users" y abre sesión en "userData"
│  │  └─ registro/    Alta de usuarios (rol client fijo)
│  ├─ admin/           Tabla de productos + alta rápida — requiere rol admin
│  └─ client/          Vitrina de productos (ex index.html) — requiere rol client
├─ types/
│  ├─ Rol.ts           enum Rol
│  ├─ IUser.ts          IUsuario / IUsuarioSesion
│  └─ IProduct.ts       IProducto
├─ utils/
│  ├─ storage.ts        wrapper tipado de localStorage (users, session, products)
│  ├─ auth.ts            registrarUsuario / iniciarSesion / cerrarSesion / verificarSesionYRol
│  └─ navigate.ts        redirigirA
└─ main.ts               guard centralizado: lee <body data-role="..."> y protege la página
```

## Cómo funciona la protección de rutas

Cada página protegida declara su rol requerido en el propio HTML:

```html
<body data-role="admin">
```

`main.ts` se importa en todas las páginas y, al cargar, llama a
`verificarSesionYRol(rol)`:

- Sin sesión y la página pide un rol → redirige al login.
- Con sesión pero rol distinto → redirige al home que le corresponde.
- Sin `data-role` (login, registro) → no bloquea nada.

Como la validación corre antes de pintar contenido en cada carga de
página, recargar (F5) o pegar la URL directamente no evade la protección.
