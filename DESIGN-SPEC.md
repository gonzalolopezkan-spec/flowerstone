# FlowerStone Real Estate — Design Spec (contrato obligatorio)

Sitio estático premium de 2 páginas en `C:\flowerstone`: `index.html` (home) y `alquiler.html`.
Idioma: **español**. Debe sentirse como una web de estudio de 10.000 €: precisa, serena, lujosa, con microinteracciones impecables.

## Dirección de arte — "Piedra y flor"

FlowerStone = mineral (piedra caliza, lo perenne) + botánico (jardín, lo vivo). Costa de la Luz: cal blanca, pinos de Roche, bronce de la arena al atardecer, Atlántico.

### Tokens (CSS custom properties en `:root`) — usar EXACTAMENTE estos nombres
```css
--ink:    #121A16;   /* casi-negro con fondo verde pino — texto principal y bandas oscuras */
--pine:   #1B2A23;   /* verde pino profundo — fondos de banda oscura, footer */
--paper:  #F8F7F2;   /* blanco alabastro — fondo general */
--stone:  #EAE6DB;   /* caliza clara — superficies, bordes, tarjetas */
--bronze: #A8874F;   /* bronce champán — acento, reglas, precios, hover */
--mist:   #6C7670;   /* gris-verde — texto secundario */
```
Nunca usar otros colores salvo transparencias/scrims de estos. Contraste AA: cuerpo de texto siempre --ink sobre --paper o --paper sobre --pine.

### Tipografía (Google Fonts, cargar con preconnect + display=swap)
- **Display**: `Marcellus` (romana lapidaria — la "piedra"). Titulares H1/H2, precios, wordmark. Sin bold: usar tamaño y espaciado.
- **Acento poético**: `Cormorant Garamond` *italic* (la "flor"). Frases destacadas, subtítulos emocionales, palabras sueltas dentro de titulares (`<em>`).
- **Cuerpo/UI**: `Jost` (300/400/500). Texto, navegación, botones, etiquetas.
- Eyebrows/etiquetas: Jost 500, uppercase, `letter-spacing: 0.22em`, 11–12px, color --bronze.
- H1 hero: Marcellus, `clamp(2.6rem, 6vw, 5.2rem)`, line-height 1.05. Body: Jost 300/400, 16–18px, line-height 1.65, máx 65ch.

### Logo
NO usar `assets/img/logo.webp` en el header (fondo blanco no transparente). Recrear el wordmark en HTML/CSS, fiel al original:
```html
<a class="logo" href="index.html" aria-label="FlowerStone Real Estate — inicio">
  <span class="logo__word">FlowerStone</span>
  <span class="logo__sub">Real Estate</span>
</a>
```
`.logo__word`: Marcellus, ~1.35rem, letter-spacing 0.02em. `.logo__sub`: Jost 400 uppercase, 9px, letter-spacing 0.45em, color --bronze (o --mist sobre claro). Favicon: `assets/img/favicon.webp`.

### Firma visual (elemento memorable)
**El trazo lapidario**: una regla de 1px en --bronze que "se talla" (scaleX 0→1, transform-origin left, 1.1s ease) al entrar cada sección en viewport, junto al eyebrow. Clase `.rule` + activada con `.in-view`. Repetida con disciplina en todas las secciones de ambas páginas.
Marca secundaria: rombo pequeño (cuadrado rotado 45°, borde 1px --bronze, 7×7px) como separador `.diamond` en eyebrows, marquee y footer.

## Microinteracciones (obligatorias, 150–400ms, ease `cubic-bezier(.25,.8,.25,1)`)
1. **Preloader** (solo home): pantalla --ink, wordmark "FlowerStone" aparece (fade+rise), cortina se levanta (translateY) ~1.2s total, luego se elimina del DOM. Con `prefers-reduced-motion`: quitar inmediatamente.
2. **Nav**: fija, transparente sobre el hero (texto blanco) → al hacer scroll >40px añade `.nav--solid` (fondo `rgba(248,247,242,.85)` + `backdrop-filter: blur(14px)` + borde inferior 1px stone, texto --ink). Links: subrayado 1px --bronze que crece desde el centro en hover. Transición suave de color.
3. **Botones**: `.btn` base (Jost 500, uppercase, letter-spacing .14em, 13px, padding 1rem 2rem). `.btn--bronze` (fondo --bronze, texto --paper; hover: fondo --ink, ligera elevación shadow). `.btn--ghost` (borde 1px actual, transparente; hover: fondo se llena con barrido `::before` scaleX). Todos `cursor:pointer` y focus-visible con outline 2px --bronze offset 3px.
4. **Hero Ken Burns**: imagen de fondo `scale(1.08)→scale(1)` en 2.5s al cargar. Titular: cada línea envuelta en un span con `overflow:hidden` y rise por línea con stagger 120ms.
5. **Reveal on scroll**: IntersectionObserver. Clase `.reveal` (opacity 0, translateY 26px) → `.in-view` (opacity 1, translateY 0, 0.8s). Stagger con `.reveal[data-delay="1|2|3"]` (100ms cada uno). Threshold 0.15, `unobserve` tras activar.
6. **Tarjetas de villa** (`.villa-card`): imagen en contenedor `overflow:hidden`, `img` scale 1→1.06 (0.7s); marco interior `::after` (inset 12px, borde 1px rgba bronce) que aparece en hover; chip de precio siempre visible; flecha "Ver villa" se desliza 4px→0 con opacity en hover. Sombra sube suavemente. Toda la tarjeta clicable (`<a>`), cursor pointer.
7. **Marquee**: banda infinita CSS (`@keyframes` translateX -50%, contenido duplicado con `aria-hidden`) con destinos: ROCHE ◆ CONIL DE LA FRONTERA ◆ SANCTI PETRI ◆ LA BARROSA ◆ EL PALMAR ◆ CÁDIZ. Lenta (~40s). Pausa en hover.
8. **Magnetic buttons** (solo desktop, pointer:fine): CTAs principales se desplazan sutilmente hacia el cursor (máx 6px, translate con lerp) y vuelven con transición al salir.
9. **Contadores**: números que cuentan de 0 al valor al entrar en viewport (~1.2s, easeOut).
10. `@media (prefers-reduced-motion: reduce)`: desactivar TODAS las animaciones/transiciones (reveals visibles de inicio, marquee estático, sin ken burns, sin magnetic).

## Contrato de clases compartidas (ambas páginas idénticas en esto)
`.nav`, `.nav--solid`, `.nav__links`, `.logo`, `.btn`, `.btn--bronze`, `.btn--ghost`, `.eyebrow`, `.rule`, `.diamond`, `.reveal`, `.in-view`, `.villa-card` (+ `.villa-card__media`, `__body`, `__name`, `__meta`, `__price`), `.marquee`, `.cta-band`, `.footer`, `.container` (max-width 1240px, padding-inline clamp(1.25rem, 4vw, 3rem)).

### NAV (HTML exacto en ambas páginas; en alquiler.html marcar aria-current en Alquiler)
```html
<header class="nav" id="nav">
  <div class="container nav__inner">
    <a class="logo" href="index.html" aria-label="FlowerStone Real Estate — inicio">
      <span class="logo__word">FlowerStone</span><span class="logo__sub">Real Estate</span>
    </a>
    <nav class="nav__links" aria-label="Principal">
      <a href="index.html">Home</a>
      <a href="alquiler.html">Alquiler</a>
      <a href="https://flowerstone.es/propiedades-en-venta/">Venta</a>
      <a href="https://flowerstone.es/nosotros/">Nosotros</a>
      <a href="https://flowerstone.es/contact/">Contacto</a>
    </nav>
    <a class="btn btn--bronze nav__cta" href="https://api.whatsapp.com/send?phone=611098971">Reservar</a>
    <button class="nav__toggle" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span></button>
  </div>
</header>
```
Móvil (<900px): links ocultos tras `.nav__toggle` (hamburguesa de 2 líneas que rota a X); panel a pantalla completa fondo --pine, links grandes Marcellus con stagger.

### FOOTER (idéntico en ambas)
- Banda --pine, texto --paper. Wordmark gigante "FlowerStone" en Marcellus (clamp 3–7rem, opacity .95) arriba.
- 3 columnas: (1) tagline corta + social: Instagram https://www.instagram.com/flowerstone_realestate/ · Facebook https://www.facebook.com/p/FlowerStone-61554717839087/ · LinkedIn https://www.linkedin.com/company/flowerstone-real-estate/ — iconos SVG inline (NO emojis, trazo 1.5, 20px). (2) Navegación (mismos 5 links). (3) Contacto: +34 611 098 971 (tel:), info@flowerstone.es (mailto:), WhatsApp.
- Línea inferior: `© 2026 FlowerStone Real Estate` + `Roche · Conil de la Frontera · Cádiz` con .diamond separadores.

## Datos reales de villas (usar EXACTAMENTE — imágenes en `assets/img/`)
| Villa | Zona (data-zone) | €/noche | Imagen | Enlace real |
|---|---|---|---|---|
| Villa Suecia | roche · "Roche, Conil" | 915 | suecia.png | https://flowerstone.es/properties/villa-suecia/ |
| Villa América | roche · "Roche, Conil" | 450 | america-hero.jpg | https://flowerstone.es/properties/villa-america/ |
| Villa Martiniano II | costa · "Costa de la Luz" | 415 | martiniano.jpg | https://flowerstone.es/properties/villa-martiniano-ii/ |
| Villa Joviano | costa · "Costa de la Luz" | 330 | joviano-hero.jpg | https://flowerstone.es/properties/villa-joviano/ |
| Villa Irlanda | roche · "Roche, Conil" | 302 | irlanda-hero.jpg | https://flowerstone.es/properties/villa-irlanda/ |
| Villa Australia | costa · "Costa de la Luz" | 275 | australia-hero.jpg | https://flowerstone.es/properties/villa-australia/ |
| Villa Francia | costa · "Costa de la Luz, Cádiz" | 220 | francia-hero.jpg | https://flowerstone.es/properties/villa-francia/ |
| Villa Guadalajara | costa · "Costa de la Luz" | 195 | guadalajara.jpg | https://flowerstone.es/properties/villa-guadalajara/ |
| Villa Índico | sancti · "Sancti Petri Hills Golf" | null ("Consultar") | indico.jpg | https://flowerstone.es/properties/villa-indico-sancti-petri-hills-golf/ |

Imágenes secundarias disponibles: interior-1.jpg, interior-2.jpg, guadalajara-2.jpg, francia-2.jpg, irlanda-2.jpg, indico-2.jpg.
Todas las `<img>` con `alt` descriptivo, `loading="lazy"` (excepto hero) y `object-fit:cover`.

## Copy aprobado (usar tal cual; se permite pulir microcopy)
- Tagline/H1 home: **"Más que una inmobiliaria, una forma de entender el espacio."** (envolver "una forma de entender" o "el espacio" en `<em>` Cormorant italic)
- Eyebrow hero: REAL ESTATE — COSTA DE LA LUZ
- Sub hero: "Villas escogidas una a una entre Roche, Conil y Sancti Petri. Alquiler, venta y proyectos a medida, con un mismo nivel de exigencia."
- Manifiesto (cita Cormorant italic): "Creemos en crear experiencias memorables: que cada persona se sienta en casa, ya sea en su residencia, en un destino de vacaciones o en un refugio de fin de semana."
- Manifiesto body: "Ofrecemos una gama completa de servicios: gestión de alquileres, mantenimiento de propiedades, compraventa de inmuebles, reformas integrales y proyectos de interiorismo. Un solo interlocutor, un mismo cuidado."
- Servicios (4): Alquiler vacacional — "Gestión integral de la villa: calendario, huéspedes, limpieza y mantenimiento." / Compra & Venta — "Acompañamiento completo en la compraventa de propiedades singulares." / Reformas & Interiorismo — "Proyectos integrales con la firma de Marta Sierra Interiorismo." / Paisajismo & Mantenimiento — "Jardines de autor y cuidado continuo de los exteriores."
- CTA band: "Su próxima casa en la Costa de la Luz empieza con una conversación." — botones: WhatsApp / +34 611 098 971 / info@flowerstone.es
- Contadores home: 9 villas exclusivas · 6 destinos en Cádiz · 24/7 atención al huésped ("24/7" no se anima, los otros sí).

---

## index.html — secciones en orden
1. **Preloader** (spec §Micro 1).
2. **Nav** (contrato).
3. **Hero** full-viewport: `joviano-hero.jpg` (preload, `fetchpriority="high"`), scrim gradiente (ink 55%→transparente), Ken Burns. Eyebrow + H1 + sub + 2 CTAs (`Ver las villas`→alquiler.html bronze; `Nuestros servicios`→#servicios ghost claro). Abajo: indicador de scroll (línea vertical animada + "Descubrir"). Texto en blanco/--paper.
4. **Manifiesto**: fondo --paper. Grid 2 col: izquierda eyebrow "FLOWERSTONE" + rule + cita Cormorant grande + body + firma "FlowerStone Real Estate — Cádiz"; derecha composición de 2 fotos solapadas (interior-1.jpg grande + guadalajara-2.jpg offset con borde --paper 8px y sombra) con leve parallax entre ellas al hacer scroll (translateY diferencial sutil, opcional).
5. **Villas destacadas**: fondo --stone (banda). Header: eyebrow "LA COLECCIÓN" + H2 "Villas que <em>respiran</em> calma" + link "Ver todas →" (alquiler.html). 3 `.villa-card` grandes: Suecia (915), América (450), Joviano (330), con zona y desc de 1 línea. Grid 3→1 col.
6. **Marquee** destinos (spec §Micro 7), fondo --paper, texto Marcellus grande opacity .35, --ink.
7. **Servicios** `id="servicios"`: fondo --paper. Eyebrow "SERVICIOS" + H2 "Todo lo que una casa necesita". 4 filas full-width con borde superior 1px stone: nombre en Marcellus (~1.8rem) izquierda, descripción --mist centro, flecha → derecha. Hover: fondo de fila pasa a --pine con texto --paper (transición 0.35s), flecha se desplaza, y una miniatura (14rem, foto asociada: francia-2 / irlanda-2 / interior-2 / guadalajara-2) aparece flotando siguiendo levemente el cursor (desktop only). Cada fila enlaza a la página real correspondiente de flowerstone.es (compra-venta / reformas / paisajismo; alquiler → alquiler.html).
8. **Banda experiencia** parallax: `america-hero.jpg` fija (background-attachment o transform-parallax), scrim --pine 70%. Cita Cormorant italic blanca: "El lujo, para nosotros, es que no tenga que ocuparse de nada." + contadores (spec copy).
9. **CTA band** (contrato): fondo --stone, H2 Marcellus + 3 botones.
10. **Footer** (contrato).

## alquiler.html — secciones en orden
1. **Nav** (aria-current="page" en Alquiler).
2. **Hero de página** (60–70vh): fondo `australia-hero.jpg` con scrim ink→, eyebrow "LA COLECCIÓN — ALQUILER", H1 "Propiedades en <em>alquiler</em>", sub: "Nueve villas escogidas una a una en la Costa de la Luz. Piscina privada, jardines cuidados y la luz de Cádiz." Migas: Home ◆ Alquiler.
3. **Barra de filtros** sticky bajo la nav (fondo paper blur, borde stone): chips de zona `Todas · Roche · Costa de la Luz · Sancti Petri` (`data-zone`: all/roche/costa/sancti) + orden `Destacadas · Precio ↓ · Precio ↑` (select estilizado o chips). Chip activa: fondo --ink texto --paper. Filtrado client-side: las tarjetas no coincidentes fade+scale out (0.3s) y se ocultan (display:none tras transición o grid re-flow directo con animación de opacity); contador "9 villas" se actualiza ("N villas").
4. **Grid de villas**: 9 `.villa-card` (datos de la tabla), grid 3 col → 2 → 1. Cada tarjeta: imagen 4:3, chip precio ("desde 915 € / noche" o "Consultar"), nombre Marcellus, zona con icono pin SVG pequeño, línea desc corta, "Ver villa →". Stagger reveal.
5. **Spotlight Villa Suecia** ("La joya de la colección"): banda --pine texto --paper, split: suecia.png grande + interior-2.jpg pequeña solapada; copy: "Villa Suecia — Amplia y elegante, pensada para familias numerosas y grupos que buscan confort y tranquilidad en un entorno exclusivo." + precio 915 €/noche + btn bronze "Ver Villa Suecia" (enlace real).
6. **Nota de servicio** (3 items en línea, iconos SVG trazo): "Atención personal 24/7" · "Casas cuidadas por nuestro equipo" · "Check-in sin complicaciones".
7. **CTA band** + **Footer** (contrato).

## Calidad (checklist obligatoria)
- Responsive perfecto en 375 / 768 / 1024 / 1440. Sin scroll horizontal (verificar marquee y fotos solapadas: `overflow-x: clip` en body como red de seguridad).
- Iconos: SVG inline trazo 1.5px, 24×24 viewBox. PROHIBIDO emojis como iconos.
- Focus visible, alt en todas las imágenes, `aria-expanded` en toggle, contraste AA.
- Hovers sin layout shift. Todo clicable con cursor pointer.
- `<title>` y meta description por página. `lang="es"`. Viewport meta.
- CSS compartido en `css/styles.css`; JS compartido en `js/main.js` (nav scroll, reveals, marquee pause, magnetic, contadores, menú móvil). JS de página (filtros) puede ir inline al final de alquiler.html.
- Sin frameworks ni CDNs salvo Google Fonts. Vanilla HTML/CSS/JS.
