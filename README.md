<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
=======
# Proyecto Tiempos de Gloria

Aplicación desarrollada en **React + TypeScript** con integración de **Supabase** como backend para manejo de autenticación y base de datos. Este proyecto incluye un frontend moderno y eficiente diseñado para brindar una experiencia fluida y robusta, manteniendo buenas prácticas y escalabilidad en mente.

## Funcionalidades
- **Autenticación segura**: Login y registro de usuarios mediante Supabase.
- **Integración de base de datos**: Gestión eficiente de datos con la API de Supabase.
- **Componentes reutilizables**: Código modular y reutilizable en React y TypeScript.
- **Rutas dinámicas**: Navegación fluida sin recargas de página.

## Requisitos
- Node.js
- React 18+
- TypeScript
- Supabase

## Cómo empezar
1. Clonar el repositorio: `git clone https://github.com/anonymous-sys19/Tiempos-de-Gloria.git`
2. Instalar dependencias: `npm install`
3. Configurar variables de entorno en `.env`
4. Iniciar el proyecto: `npm start`

Este repositorio cuenta con dos ramas principales:
- **beta**: Rama de desarrollo
- **main**: Rama de producción, para lanzamientos estables.

Mantente atento a los cambios y revisa el README para futuras actualizaciones. ¡Contribuciones y retroalimentación son bienvenidas!

>>>>>>> beta
