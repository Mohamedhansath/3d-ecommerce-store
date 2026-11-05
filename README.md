# FORME — 3D E-Commerce Store

A premium, scroll-led 3D shopping experience built with React, Vite, Three.js, React Three Fiber and GSAP.

## Project principles
- Frontend-only application; no backend or external checkout.
- Cart, wishlist, profile and demo orders are stored in browser LocalStorage.
- 3D scenes are progressively enhanced, with a usable product fallback.
- Responsive layout, reduced-motion support and accessible controls.
- Demo checkout is a local simulation, not a real payment.

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```

## 3D assets
Product models should be optimized GLB/GLTF files. Keep models lightweight and provide image fallbacks for devices that cannot render WebGL.

## Important
This is a frontend portfolio/demo store. LocalStorage authentication and checkout are not secure or suitable for real customer accounts or payments.