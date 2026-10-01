# Torque Performance

Web del proyecto intermodular (Vue 3 + Vite + GSAP).

## Uso
```
npm install
npm run dev      # desarrollo
npm run build    # producción en /dist
```

## Estructura
- `src/components/` una sección de la web por componente
- `src/composables/useClutch.js` estado compartido del laboratorio de par (T = μ·F·n·Rm)
- `src/data/` kits (`productos.js`), motorizaciones (`motores.js`) y textos (`contenido.js`)
- `src/assets/main.css` estilos y tema claro/oscuro

## Añadir un kit o un motor
Edita `src/data/productos.js` o `src/data/motores.js`. La tienda muestra 9 kits y el resto con el botón "Ver más" (constante `LIM` en `ShopSection.vue`).

## Datos
Los pares y precios reales salen de fichas de fabricantes (enlazadas en cada kit). Los precios de mano de obra y consumibles del presupuesto son hipótesis del proyecto.
# Torque-Performance-
