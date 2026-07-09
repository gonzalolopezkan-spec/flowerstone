# FlowerStone Real Estate

Rediseño premium del sitio de [FlowerStone Real Estate](https://flowerstone.es/) — villas de lujo en la Costa de la Luz (Roche, Conil de la Frontera, Sancti Petri · Cádiz).

Sitio estático de dos páginas, sin frameworks: **HTML + CSS + JavaScript vanilla**.

## Páginas

- **[index.html](index.html)** — Home: hero con efecto Ken Burns, manifiesto, colección de villas destacadas, marquee de destinos, servicios con hover-reveal, banda parallax con contadores y CTA.
- **[alquiler.html](alquiler.html)** — Alquiler: catálogo de 9 villas con filtro por zona y ordenación por precio en tiempo real, spotlight de Villa Suecia y nota de servicio.

## Sistema de diseño — «Piedra y flor»

| Rol | Valor |
|-----|-------|
| Tinta | `#121A16` |
| Verde pino | `#1B2A23` |
| Alabastro | `#F8F7F2` |
| Caliza | `#EAE6DB` |
| Bronce | `#A8874F` |
| Bruma | `#6C7670` |

**Tipografías:** Marcellus (display, romana lapidaria) · Cormorant Garamond *italic* (acentos) · Jost (cuerpo y UI).

**Firma visual:** el «trazo lapidario» — una regla de bronce que se talla al entrar cada sección en el viewport.

Toda la especificación de diseño está en [DESIGN-SPEC.md](DESIGN-SPEC.md).

## Cómo verlo en local

```bash
node .claude/serve.js
# http://localhost:4173
```

O simplemente abre `index.html` en el navegador.

## Estructura

```
├── index.html          # Home
├── alquiler.html       # Alquiler
├── css/
│   ├── styles.css      # Sistema de diseño + estilos compartidos
│   └── alquiler.css    # Estilos específicos de la página de alquiler
├── js/
│   └── main.js         # Nav, reveals, marquee, contadores, menú móvil
├── assets/img/         # Fotografía y branding
└── DESIGN-SPEC.md      # Especificación de diseño
```

---

Las fotografías y la marca FlowerStone pertenecen a FlowerStone Real Estate.
