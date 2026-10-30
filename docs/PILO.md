# Pilo — marca y mascota

> **Estado (30-oct-2026).** El nombre **Pilo** y la mascota **Pilo, el tití cabeciblanco**, están **elegidos y aprobados** por el autor, con el diseño final de la ronda 7 (§3). El mismo día el autor decidió **no esperar la búsqueda en la SIC** y hacer el cambio en el código con los iconos generados: rama `chore/rebrand-pilo` (§8.3). Hasta que esa rama salga a producción, la app sigue llamándose Reasonny para los usuarios. Este documento es la guía del **rebranding total**: qué se decidió, por qué, qué se descartó, cómo se regenera el arte y la lista completa de lo que falta (§8).
>
> El arte vive en [`docs/brand/pilo/`](brand/pilo/). La fuente de verdad del personaje es la hoja de referencia [`pilo-referencia.png`](brand/pilo/pilo-referencia.png) más la ficha [`illo/character.md`](brand/pilo/illo/character.md). Cualquier imagen nueva se genera **a partir de esa referencia**, nunca desde cero (§3.5).

| Icono de la app | Hoja de referencia |
| :---: | :---: |
| ![Icono de Pilo: el tití asomado sobre una tarjeta champaña, fondo vino](brand/pilo/pilo-icono.png) | ![Hoja de referencia: busto de Pilo con el copete blanco cayendo hacia atrás](brand/pilo/pilo-referencia.png) |

---

## 1. Resumen de decisiones

| Qué | Decisión | Dónde está el porqué |
| :--- | :--- | :--- |
| Nombre | **Pilo** | §2 |
| Mascota | **Pilo, el tití cabeciblanco**: copete blanco liso que cae hacia atrás, cara negra con dos ojos de punto, sin boca, cola vino como único acento | §3 |
| Estilo | **Pin de esmalte**: celdas de color plano con un contorno oscuro parejo. Parece insignia, no juego | §3.3 |
| Icono de la app | **Pilo asomado sobre una tarjeta champaña**, con las manos en el borde, sobre fondo vino | §3.4 |
| Cómo se dibuja | Con la skill **illo** y un modelo de imagen, siempre con la hoja de referencia | §3.5 |
| Colores de la interfaz | **Los que ya tiene el código**: vino para rellenos, champaña para acentos. Pilo usa los mismos tokens | §4 |
| Animación | **CSS sobre un redibujo vectorial por capas** (pendiente). Rive solo si un día hace falta, como excepción registrada | §6 |
| Comportamiento | Reacciona a hábitos, **nunca a montos**. No hay cara triste. No aparece en pantallas de datos | §5 |

---

## 2. El nombre

### 2.1 Por qué cambiar

Reasonny **falla la prueba del oído**: quien lo oye en una conversación no sabe escribirlo. «Ri-zo-ni» puede terminar como *reasony*, *rizoni*, *risoni*, *reasoni* o *reasonnie*. Mezcla una raíz en inglés (*reason*), una n doble y una terminación que no existe en ninguno de los dos idiomas. Para una app que se recomienda de boca en boca, un nombre que no se puede buscar después de oírlo es un costo real.

### 2.2 Criterios

1. **Se oye y se escribe igual a la primera**, en español y en inglés. Eso descarta las letras con dos escrituras en español: b/v, s/c/z, la h muda, ll/y, g/j, c/k/qu y las letras dobles.
2. **Corto**: dos sílabas.
3. **Sin choque** con apps de finanzas en Colombia y la región.
4. **Que dé para un personaje.**

### 2.3 Candidatos revisados

Verificado el **29-oct-2026** en buscadores, App Store, Google Play y en el registro de dominios .com y .app (consultas RDAP). Es una foto de ese día: los dominios y las apps cambian.

| Nombre | Resultado | Motivo |
| :--- | :--- | :--- |
| **Pilo** | ✅ **Elegido** | En Colombia, «pilo» es el juicioso, el despierto. Una sola forma de escribirlo. Ninguna app de finanzas con ese nombre: en el App Store solo aparecen myPilo (un aparato de relajación) y Pilo Animation Kit (dibujo para niños) |
| Rinde | Respaldo | «Que la plata rinda». Sin choques, pero es un verbo común: difícil de encontrar en buscadores y de registrar como marca |
| Tino | Respaldo | «Tener tino» es tener buen juicio, y hereda la idea de *reason*. Pero existe Tino, una fintech de crédito B2B en Brasil, y al oído se confunde con «tinto» |
| Hormi | ❌ | hormi.app ya es una app para dividir gastos del hogar por WhatsApp: casi el mismo producto |
| Miga | ❌ | Ya es la app de educación financiera de la Fundación WWB Colombia |
| Kipu | ❌ | Existe «Kipu - Finanzas Personales» en Google Play y Quipuk en Perú. Además se oye igual que «quipu» |

### 2.4 Riesgos conocidos de Pilo

- **«Ser Pilo Paga»**: el programa de becas del Gobierno. La asociación es inevitable en Colombia. Es mayormente positiva, pero tiene carga política.
- **PliP**, una app colombiana de finanzas personales, se le parece **por escrito** (p-l-i-p / p-i-l-o). Al oído no se confunden.
- **Dominios** (29-oct-2026): `pilo.com` y `pilo.app` están registrados (`pilo.app` sin sitio, se puede intentar comprar). `holapilo.app` estaba libre.
- **Marca registrada: sin verificar.** Falta buscar en el SIPI de la SIC, clases de Niza **9** (software), **36** (servicios financieros) y **42** (software como servicio). Es el primer pendiente de §8.

---

## 3. La mascota

### 3.1 Cómo se llegó al diseño final

Siete rondas. Cada descarte enseñó algo, y la lección de la última es la que más pesa: **el problema no era el estilo sino el método**.

| Ronda | Propuestas | Qué pasó | Lección |
| :--- | :--- | :--- | :--- |
| 1 | Pixel, colibrí, chigüiro (SVG, violeta) | No convencieron | Faltaban referentes de finanzas y de lo que hoy funciona (§7) |
| 2 | Hicotea, tití cabeciblanco, marranito (SVG, colores costeños) | El autor no quiere una tortuga para una app de finanzas. **Eligió el tití**: «es gracioso, es autóctono, y el nombre Pilo le luce» | El autor es de Barranquilla: lo caribeño es bienvenido |
| 3 | El tití en 3D con Three.js | «Muy 3D», difícil de leer | Una mascota de app se lee a 16 px; el volumen estorba |
| 4 | El tití plano, tipo Duolingo, ojos enormes | «No parece un mono tití» | Ojos de caricatura de frente dibujan *un mono cualquiera* |
| 5 | Tres estilos (A, B, C) y el primer icono: media cara sobre una moneda o una tarjeta, según un boceto del autor | El estilo no convence | — |
| 6 | Dos estilos más (D silueta, E ilustrado) tras estudiar fotos reales del tití y mascotas como el Octocat de GitHub y Snoo de Reddit | Seguía genérico: copete como peluca, ojos de caricatura, y la moneda con la P parecía ficha de juego | Las rondas 1 a 6 se dibujaron escribiendo curvas en código, sin mano de ilustrador. Ese era el techo |
| 7 | **Skill illo + modelo de imagen**, estilo pin de esmalte (§3.5) | ✅ **Aprobado el 30-oct-2026** | Una ficha corta y cerrada produce el mismo personaje en todas las imágenes |

La ronda 7 tuvo tres pasos, todos con la cuenta de Codex del autor:

1. **Primera ficha** (4 imágenes): el personaje salió igual en las cuatro, así que la ficha funcionaba. Pero el copete salió en puntas, como **melena de león**. Y las dos que se pidieron como busto salieron de cuerpo entero.
2. **Copete corregido** (3 imágenes): liso, cayendo hacia atrás desde una frente recta. El **busto** salió como la mejor imagen de las siete rondas y quedó como **hoja de referencia**. De cuerpo entero y de frente, el pelo largo a los lados parece una peluca: sirve, pero es la vista más débil.
3. **Icono** (2 imágenes, con el busto como referencia): Pilo asomado sobre la tarjeta. Se eligió la versión con el chip simple.

Las imágenes descartadas de las rondas 4 a 7 están en artefactos privados de Claude, no en el repositorio.

### 3.2 Las referencias

- **Fotos reales del tití cabeciblanco** (*Saguinus oedipus*) en Wikimedia Commons. De ahí salen los rasgos: el copete blanco largo que nace en la frente y cae hacia atrás, la cara oscura, las orejas oscuras bajo la melena, las manos y el pecho blancos y la cola larga.
- **El boceto del autor para el icono**: media cara del tití, sorprendido, asomado sobre una moneda o una tarjeta, agarrado del borde. **Que no parezca un juego.**
- **Dos reglas del autor**: el pelo es **blanco, sí o sí**; el resto, en colores de marca.

> **Sobre la especie.** Las primeras rondas mezclaban el tití cabeciblanco con un tití pigmeo de una foto de referencia. El diseño final es **el cabeciblanco**, estilizado. Es endémico del Caribe colombiano, está en peligro crítico y ya fue *Baqui*, el símbolo de los Juegos Centroamericanos y del Caribe Barranquilla 2018. Si algún día se cuenta en público la historia barranquillera de Pilo, conviene decirlo bien y no prometer nada sobre conservación que no se haga (P3).

### 3.3 El diseño cerrado

La ficha completa, en el formato que illo necesita, está en [`illo/character.md`](brand/pilo/illo/character.md). En corto:

| Rasgo | Cómo es | Por qué |
| :--- | :--- | :--- |
| Silueta | Cuerpo de pera, sentado, cabeza tan ancha como el cuerpo | Una sola forma, legible en chico |
| Copete | Pelo blanco **liso** que nace en una frente recta y cae **hacia atrás** en una ola, hasta los hombros. Sin puntas | Es la firma del tití. En puntas se lee como león |
| Cara | Máscara negra con el borde de arriba recto (la frente) y orejitas a los lados | La frente recta y los ojos chicos debajo le dan la **cara de viejito sabio** |
| Ojos | Dos puntos claros, **chicos y juntos**, justo bajo la frente | Los ojos grandes de caricatura eran lo que lo volvía genérico |
| Boca | **No tiene** | La emoción va en los ojos y la pose (§5.2). Cada rasgo extra es algo que el modelo dibuja distinto cada vez |
| Manos | Blancas, redondas, sin dedos | Pueden agarrarse de un borde (el icono) o cargar algo |
| Acento | **La cola, en vino.** Es la única parte de color | La regla de illo: un solo acento. Así el vino siempre señala lo mismo |

**Lo que se dejó fuera a propósito**, aunque el tití real lo tiene: el lomo café, los muslos rojizos y el hocico. Más partes significan más diferencias entre una imagen y otra. Además, el modelo ignoró el hocico las tres veces que se pidió.

### 3.4 Archivos

| Archivo | Qué es | Uso |
| :--- | :--- | :--- |
| [`pilo-icono.png`](brand/pilo/pilo-icono.png) | **Icono aprobado**, 1254 × 1254, chip simple | Maestro del icono hasta que exista el SVG (§8.2) |
| [`pilo-icono-chip.png`](brand/pilo/pilo-icono-chip.png) | Variante con chip detallado | Alternativa. A 32 px el chip se vuelve ruido |
| [`pilo-referencia.png`](brand/pilo/pilo-referencia.png) | **Hoja de referencia**: busto con leve giro | Se pasa como `--ref` en **toda** imagen nueva |
| [`pilo-avatar-bot.jpg`](brand/pilo/pilo-avatar-bot.jpg) | La hoja de referencia en 640 × 640, JPG | Foto de perfil del bot. Telegram solo acepta JPG y la recorta en círculo |
| [`pilo-cuerpo-a.png`](brand/pilo/pilo-cuerpo-a.png), [`pilo-cuerpo-b.png`](brand/pilo/pilo-cuerpo-b.png) | Cuerpo entero, sentado, de frente | Landing y bienvenida. Es la vista más débil (§3.1) |
| [`illo/character.md`](brand/pilo/illo/character.md) | La ficha cerrada del personaje, en inglés | La lee illo; es la definición del personaje |
| [`illo/prompt-*.txt`](brand/pilo/illo/) | Los textos exactos con que se generó cada imagen | Para repetir o ajustar una imagen |

Los prompts guardados son **los que se usaron**, tal cual. Por eso `prompt-cuerpo.txt` y `prompt-busto.txt` todavía piden un hocico que el modelo no dibujó. La ficha `character.md` ya no lo pide y añade las orejas que sí salieron.

### 3.5 Cómo se generó y cómo se regenera

**Herramienta.** [illo](https://github.com/tmchow/illo-skill) (licencia MIT, versión 0.37.0) es una skill de Claude Code para ilustraciones con un personaje recurrente. Su método: una entrevista corta, poner a prueba el concepto antes de dibujar, una ficha cerrada y una hoja de referencia que se reusa siempre. Está instalada en `~/.claude/skills/illo`.

**Quién dibuja.** El modelo de imagen de OpenAI, a través de **Codex CLI** con la cuenta de ChatGPT del autor. No hay cobro por imagen: se descuenta de la cuota de Codex. Codex usa la cuenta de OpenAI, **no** la de Claude.

**Para generar una imagen nueva** (una pose, una expresión, un disfraz):

```bash
SKILL_DIR="$HOME/.claude/skills/illo";
RUN=$(python3 "$SKILL_DIR/scripts/illo.py" newrun);
python3 "$SKILL_DIR/scripts/illo.py" generate --prompt-file mi-prompt.txt --ref docs/brand/pilo/pilo-referencia.png --aspect 1:1 --count 2 --label "qué es" --out "$RUN/x.png"
python3 "$SKILL_DIR/scripts/illo.py" gallery "$RUN" --title "Pilo — qué es" --open
```

**Reglas de uso:**

1. **Siempre con `--ref pilo-referencia.png`.** Una imagen generada solo con texto sale como otro personaje parecido, no como Pilo.
2. El prompt se arma con el bloque `Prompt spec` de la ficha, más las líneas de estilo y paleta de `illo/prompt-icono.txt`.
3. **Revisar cada imagen antes de usarla**, con la lista de illo: la cara exacta (dos puntos, sin boca), ninguna parte que no esté en la ficha, el vino solo en la cola y la silueta legible en chico. Si falla, se genera otra vez. Si falla dos veces, el problema es el prompt, no la suerte.
4. **Lo que el modelo hace mal, comprobado:** ignora el hocico; ignoró la pose de busto hasta que se pidió explícitamente «recortado a media altura del pecho, sin piernas ni cola»; y si el copete no se describe como «liso, sin puntas», lo dibuja en puntas.

**Permisos en Claude Code.** El modo automático bloquea instalar y ejecutar código descargado de internet, aunque el autor lo autorice en el chat. La primera vez, el autor instaló illo y Codex él mismo, con un script. Desde entonces Claude puede correr illo sin problema.

### 3.6 Procedencia y derechos

- Los PNG llevan **credenciales de contenido C2PA** de OpenAI, que los identifican como generados por IA. Se dejan así: es lo honesto.
- Los términos de OpenAI le ceden al usuario los derechos que existan sobre lo generado. Pero **una imagen hecha solo por IA casi no tiene protección de derechos de autor**: la Oficina de Derechos de Autor de EE. UU. exige autoría humana, y en Colombia la Decisión Andina 351 define al autor como la persona natural que crea la obra.
- **El registro de marca ante la SIC protege el signo** aparte del derecho de autor. Aun así, el redibujo vectorial (§8.2) le añade autoría humana al icono, y conviene hacerlo antes de registrar.
- Esto no es asesoría legal. Antes de registrar la marca, se consulta con un abogado de propiedad intelectual.

---

## 4. Colores

### 4.1 Lo que la interfaz ya usa (y no cambia)

El autor pidió «vino champaña, rosadito» y no violeta. **El código ya está ahí desde el 07-sep-2026** (commit `0243057`, `src/app/globals.css`):

| Token | Valor | Rol | Medido el 29-oct-2026 |
| :--- | :--- | :--- | :--- |
| `--brand-500` | `#9b2c45` | Vino: botones primarios, foco, navegación activa. Es la cola de Pilo | Texto blanco encima: **7,4:1** |
| `--brand-600` | `#781d32` | Vino profundo: presionado. Es el fondo del icono | — |
| `--brand-400` | `#e4cca6` | Champaña: enlaces y acentos sobre oscuro. Es la tarjeta del icono | **12,8:1** sobre `#09090b`; distancia 28,5 al rojo de «crítico» |
| `--app-ground` | `#380a1c` | Fondo ciruela de la app | — |

> **Documento desactualizado.** `docs/DESIGN_SYSTEM.md` §2.1 y §2.4 todavía describen el violeta `#8172F2` como marca. El código lo cambió el 07-sep-2026 y el documento no se actualizó. Se corrige en la rama del rebranding (§8.3). La paleta categórica (`--cat-1`…`--cat-6`) **no cambia**: `--cat-1` sigue siendo violeta porque es una categoría validada contra daltonismo, no la marca.

**Se evaluó y se descartó** añadir un acento rosé a la interfaz (`#E8B4B0`). Pasaba las pruebas: 11:1 de contraste, distancia 23 al rojo de «crítico» y 25 al rosa de las gráficas. Pero la champaña existente es mejor en las dos medidas, y un segundo acento no hace falta. También se midió el vino como color de texto o acento (`#B5475F`): 3,8:1 de contraste, por debajo del 4,5:1 que pide el texto, y distancia 9,7 al rojo de «crítico». Un botón así se lee como un error. Por eso el vino va en **rellenos** con texto claro encima, nunca como texto sobre fondo oscuro.

*Método de las distancias:* OKLab × 100, con el daltonismo simulado con Machado 2009 a severidad completa. Cálculo puntual, no el validador del proyecto: antes de tocar un token de la interfaz se corre el validador.

### 4.2 La paleta de Pilo

La mascota **no trae colores nuevos a la interfaz**: el vino y la champaña son tokens que ya existen. El rosé de la ronda 4 (cara rosada, sombras rosadas) desapareció con el estilo de esmalte.

| Parte | Color | Token |
| :--- | :--- | :--- |
| Pelo, cuerpo, manos y ojos | `#FBF7F2` | — (blanco cálido, regla del autor) |
| Máscara de la cara y orejas | `#2B1A1F` | — |
| Contorno («metal» del pin) | `#2A1018` | — |
| Cola, el único acento | `#9B2C45` | `--brand-500` |
| Fondo del icono | `#781D32` | `--brand-600` |
| Tarjeta del icono y fondo de las hojas | `#E4CCA6` | `--brand-400` |

Son los valores que se le **pidieron** al modelo. El PNG los aproxima, con el brillo del esmalte encima. El redibujo vectorial (§8.2) los usa exactos. Cuando Pilo entre al código, los tres que no tienen token pasan a `--pilo-*` en `globals.css`: la regla 9.1 del sistema de diseño (ningún literal de color en componentes) aplica también a la mascota.

---

## 5. Cómo se comporta

### 5.1 Reglas

Salen de los principios del proyecto (`IMPLEMENTATION_PLAN.md` §3):

1. **Reacciona a lo que haces, nunca a cuánto gastas (P1).** Celebra el hábito de anotar. Nunca celebra ni lamenta un monto.
2. **No hay cara triste.** Una mascota triste porque gastaste es un juicio. Eso es asesoría, no educación (P4).
3. **No opina de tu plata (P4).** Nunca dice «deberías ahorrar más».
4. **No insiste (P2).** Nada de la culpa de Duolingo como recordatorio. «Dormido» existe para que de noche no moleste.
5. **Fuera de las pantallas de datos.** Vive en el icono, la landing, la bienvenida, los estados vacíos, los errores y el bot (avatar y stickers). En `/mes`, en la lista y en las gráficas mandan los números. Así se respeta lo que el sistema de diseño dijo de los personajes en §1 («no aportan aquí»): no aportan *encima de los datos*.
6. **Se lee en chico.** Medido el 30-oct-2026 con el icono reducido: a **60 px** se lee completo; a **32 px** se leen el copete y el borde de la tarjeta, y los ojos casi desaparecen. A **16 px** (pestaña del navegador) hace falta una versión aparte con solo el copete y la cara (§8.2).
7. **Toda celebración se puede apagar.** Es el modelo de Asana.

### 5.2 Expresiones y momentos

Pilo no tiene boca, así que las expresiones son **marcas en los ojos** más la pose. Las marcas están cerradas en la ficha (`character.md`) para que el modelo las repita igual. **Ninguna está generada todavía** (§8.2).

| Expresión | Ojos | Momento del producto |
| :--- | :--- | :--- |
| Tranquilo | Dos puntos chicos (la referencia) | Está ahí contigo, sin pedir nada |
| Feliz | Dos arcos hacia arriba | Anotaste el gasto del día |
| Pensando | Dos puntos movidos hacia arriba y a un lado | Mientras Gemini responde (2 a 6 s reales) |
| Sorprendido | Dos puntos un poco más grandes (el icono) | Llegó un SMS que el motor de reglas no reconoce |
| Celebra | Arcos hacia arriba y brazos arriba | Una racha de días anotando (por ejemplo, 7) |
| Dormido | Dos rayitas planas | De noche: no molesta |

### 5.3 La voz

El autor es de Barranquilla. La calidez costeña va para los hábitos; con la plata, la voz es neutral.

| | Ejemplo | Por qué |
| :--- | :--- | :--- |
| ✅ Sí | «¡Qué nota! Llevas 7 días anotando.» | Celebra el hábito (P1) |
| ✅ Sí | «Anotado: $12.000 en Café.» | Neutral con el monto |
| ❌ Nunca | «¡Qué nota! Gastaste $80.000 en rumba.» | Celebrar un gasto premia el monto, y opinar de él es asesoría (P4) |

Decidido el 30-oct-2026: **poca en la interfaz**, un toque por sección como máximo, y más en el bot. Los 3 usuarios actuales no son necesariamente costeños. La regla operativa está en [`PILO_COPY.md`](PILO_COPY.md) §3.3.

---

## 6. Animación

### 6.1 Primero el vector, después CSS

El arte aprobado es **PNG**: una imagen plana, sin capas, así que no se puede animar por partes. El camino:

1. **Redibujo vectorial** (§8.2). El estilo de esmalte ayuda: son celdas cerradas de color plano, la forma más fácil de pasar a SVG. Cada parte va en su propia capa con un `id`: `pilo-todo`, `pilo-cola`, `pilo-cuerpo`, `pilo-copete`, `pilo-mascara`, `pilo-ojos` y `pilo-manos`.
2. **CSS sobre esas capas**, solo con `transform` y `opacity` (`DESIGN_SYSTEM.md` §5.1). Pesa 0 KB:
   - **Parpadear:** `pilo-ojos` se aplasta en vertical un instante.
   - **Mover la cola:** `pilo-cola` gira unos grados sobre su base.
   - **Respirar:** `pilo-cuerpo` escala ±1,5 % desde abajo.
   - **Saltar al tocarlo:** `pilo-todo` se aplasta, se estira y cae.
   - **Asomarse** (el icono hecho movimiento): la cabeza sube desde detrás de la tarjeta.
   - **Movimiento reducido:** todo quieto.

Ojo con `DESIGN_SYSTEM.md` §5.5, que prohíbe las animaciones en bucle fuera de los esqueletos de carga. Respirar, parpadear y la cola son bucles: en la app solo pueden existir donde Pilo es protagonista (bienvenida, landing) y se detienen fuera de pantalla. Si no, se quitan. Se decide al integrarlo.

### 6.2 Después, si hace falta: Rive

[Rive](https://rive.app) es lo que usa Duolingo para animar a sus personajes: máquinas de estado que combinan poses con la boca al hablar.

| Hecho | Valor (29-oct-2026) |
| :--- | :--- |
| Runtime web (`@rive-app/canvas-lite` 2.49.0) | ≈ 119 KB de JS + 339 KB de WASM gzip = **≈ 458 KB**, medido |
| Plan gratis | Exporta, pero el `.riv` muestra una pantalla de Rive al inicio |
| Quitar esa pantalla | Plan Cadet, ≈ US$9 por puesto al mes. **Confirmar en rive.app**: las fuentes no coinciden |
| Importa SVG | Sí, como objetos editables. Las capas de §6.1 llegarían con nombre |
| Quién anima | Se anima en el editor visual de Rive. Es trabajo de diseño, no de código |

**Cuándo tendría sentido:** si Pilo necesita reacciones complejas, como encadenar muchos estados según eventos de la app. **Cómo:** carga diferida solo donde aparece Pilo, como **excepción registrada**, igual que Three.js en `DESIGN_SYSTEM.md` §5.6. 458 KB son el triple de lo que cuesta la escena 3D de la landing.

### 6.3 Descartado

- **Pilo en 3D** (ronda 3). Se probó con Three.js, armado solo con formas básicas. Funcionaba técnicamente, pero se leía mal en tamaños chicos. Three.js quedó para otra cosa: la escena de la landing (`DESIGN_SYSTEM.md` §5.6).
- **Dibujar a Pilo escribiendo curvas en código** (rondas 4 a 6). Sirve para formas geométricas, no para un personaje: todo salía «armado con piezas». El código sí sirve para el **redibujo** del icono (§8.2), porque ahí la forma ya está resuelta y solo se calca.

---

## 7. Referentes

Las mascotas que funcionan en finanzas tienen un **papel dentro del producto**. No son decoración.

| Referente | Qué hace | Qué toma Pilo |
| :--- | :--- | :--- |
| **GitHub** (Octocat) | La mascota es también el logo: una silueta que se reconoce en una sola tinta. Octodex le pone más de cien disfraces a esa misma base | La silueta primero. Los disfraces van sobre la hoja de referencia, sin cambiar el personaje |
| **Reddit** (Snoo) | Una cabeza que funciona como favicon, sello y bordado | La versión de 16 px y la de una tinta (§8.2) |
| **Monobank** (Ucrania, gato) | El usuario viste al gato completando tareas financieras. En su versión para Reino Unido lo quitaron: allá lo vieron «demasiado astuto» | Los disfraces se ganan con hábitos, no con montos. Y una mascota es local: Pilo es costeño a propósito |
| **Snoop** (Reino Unido, robot) | Pone cara a las sugerencias de una app de presupuesto | Pilo es la cara del bot de Telegram y de WhatsApp |
| **Finch** (pájaro) | La mascota es el ciclo central: la cuidas con tus rutinas | El ciclo de Pilo es anotar |
| **Duolingo** (búho) | Silueta inconfundible, sistema de emociones, más de 18 millones de seguidores en TikTok | La silueta y las emociones. **No** la culpa como recordatorio (P2) |
| **DuckDuckGo** (Dax, pato) | Un personaje simple que aguanta cientos de disfraces | Disfraces por temporada: Carnaval (marimonda), quincena, prima de diciembre |
| **Microsoft Copilot** (Mico) | Un acompañante sobrio que da cara a una IA | En L1/L2, Pilo da cara al asistente sin hacerse pasar por persona |
| **Asana** (criaturas) | Celebran tareas cumplidas, y se pueden apagar | Toda celebración de Pilo se puede apagar |

---

## 8. El rebranding total: lo que falta

En orden. Cada bloque depende del anterior.

### 8.1 Antes de tocar nada (bloqueantes)

- [ ] **Buscar «Pilo» en el SIPI de la SIC**, clases 9, 36 y 42. Si está tomado, se vuelve a §2.3. Iba a bloquear todo lo demás; **el 30-oct-2026 el autor decidió no esperarla** (registrado en `IMPLEMENTATION_PLAN.md` §4.5). Sigue pendiente, y si sale mal hay que renombrar otra vez.
- [ ] Decidir el dominio (`pilo.app` por compra, `holapilo.app` o un `.co`).
- [ ] Renombrar el repo de GitHub **antes** de crear el repo público del agente L2 (`reasonny-agent`). GitHub redirige el nombre viejo.

### 8.2 El arte que falta

Se genera con illo y la hoja de referencia (§3.5), salvo lo que dice «vector». El 30-oct-2026 el autor decidió salir **con los PNG generados** y dejar el vector para después: los iconos de la app se recortaron de `pilo-icono.png` (§8.3).

| Pieza | Para qué | Notas |
| :--- | :--- | :--- |
| **Icono en vector** (SVG) | Maestro definitivo del icono | Se calca `pilo-icono.png` en celdas cerradas, con los colores exactos de §4.2. Suma autoría humana (§3.6) |
| ~~Icono *maskable*~~ | Android recorta el icono en círculo | **Hecho** el 30-oct-2026: el icono al 68 % sobre su mismo fondo vino, todo dentro de la zona segura del 80 % |
| Favicon 16 y 32 px | Pestaña del navegador | Solo el copete y la cara, sin tarjeta (§5.1, regla 6) |
| Marca de una tinta | Sellos, fondos de un color, impresión | Silueta del copete y la cara |
| Logotipo | Pilo junto a la palabra «Pilo» | Con la tipografía de la app (`DESIGN_SYSTEM.md`) |
| Las seis expresiones (§5.2) | Bienvenida, estados vacíos, bot | Busto, con `--ref` |
| ~~Avatar del bot~~ | Foto de perfil en Telegram y WhatsApp | **Hecho**: `pilo-avatar-bot.jpg`. Falta subirlo (§8.4) |
| Imagen Open Graph (1200 × 630) | Vista previa al compartir enlaces | Pilo + nombre sobre fondo ciruela |
| *Opcional:* copete del icono | Visto desde arriba, el copete se parece a crema batida | Que arranque hacia arriba desde la frente antes de caer. El autor aprobó el icono tal como está |

### 8.3 El cambio en el código (rama propia, `chore/rebrand-pilo`)

El 30-oct-2026 había **120 apariciones de «Reasonny» en 46 archivos de `src/`**.

| Qué | Dónde | Cuidado |
| :--- | :--- | :--- |
| Nombre visible | `app_name` en `src/lib/i18n.ts` (es y en) | — |
| Landing | `src/app/page.tsx` (título, descripción, Open Graph, JSON-LD) y los componentes de `src/components/landing/` | — |
| Iconos | `public/icon.png`, `public/apple-icon.png` (180 × 180), `public/icons/icon-192.png`, `icon-512.png`, `icon-512-maskable.png` e `icon.svg` | Se referencian desde `src/app/manifest.ts`, `src/app/layout.tsx` y `src/lib/notifications.ts` (icono de las notificaciones). **Hecho** desde el PNG, sin metadatos. `icon.svg` era la «R» vieja y se borró: no vuelve hasta el vector. El `?v=` de `layout.tsx` subió a 4 y la caché del service worker a `pilo-v5`, para que los navegadores suelten el icono viejo. Falta revisar DevTools → Application → Manifest sin errores rojos (`CLAUDE.md`, PWA) |
| Logo de la landing y del aviso de permisos | `landing-top-bar.tsx`, `landing-grand-finale-footer.tsx`, `app-permissions-prompt.tsx` | **Hecho**: la «R» dibujada en SVG se cambió por el icono de la app |
| Política de privacidad | `src/content/privacy-policy.ts` | Si cambia el texto de la política, se versiona y se avisa a los usuarios (Ley 1581) |
| Nombre del archivo exportado | `src/app/api/v1/export/route.ts` (`reasonny-export-…`) | Lo ve el usuario: se cambia |
| Bot de Telegram | **Nombre visible**: `pnpm telegram:webhook` ahora lo fija desde `app_name` (`setMyName`). **Foto de perfil**: `setMyProfilePhoto` (Bot API 10.3) o BotFather, una sola vez, porque cada llamada sube una foto nueva | El `@usuario` se queda. Cambiarlo es crear otro bot y volver a vincular los chats |
| Dominio | Vercel | **`reasonny.vercel.app` se queda para siempre como alias**: los Atajos de los 3 iPhone lo tienen escrito, y `NEXT_PUBLIC_APP_URL` no está definida en producción |
| Documentación | `CLAUDE.md` (título y nombre), `README.md`, `DESIGN_SYSTEM.md` §2.1 y §2.4 (marca real, ver §4.1) y una sección de mascota con las reglas de §5 (§6.9) | **Hecho**. Los documentos históricos (`AUDIT.md`, `LANDING_AUDIT.md`, `PRUEBA_USO_REAL.md`) conservan el nombre viejo: cuentan lo que pasó |

**No se renombran** las claves internas. Cambiarlas borraría el estado guardado en los teléfonos de los usuarios (bienvenida vista, permisos ya pedidos, progreso de la configuración):

| Clave | Archivo |
| :--- | :--- |
| `reasonny_welcomed` | `src/lib/onboarding.ts` |
| `reasonny_consent_intent` | `src/core/privacy.ts` |
| `reasonny_permissions_prompted_v1` | `src/components/pwa/app-permissions-prompt.tsx` |
| `reasonny.ingest.progress`, `reasonny.ingest.locale` | `src/components/ingest/ingest-setup.tsx` |
| `reasonny-alert`, `reasonny-welcome` (etiquetas de notificación) | `src/lib/notifications.ts` |

Tampoco hace falta tocar el nombre del paquete en `package.json`, el proyecto de Vercel ni el de Neon: son internos.

**Lo que se dejó como estaba en el cambio del 30-oct-2026, y por qué:**

- **La política de privacidad cambió el nombre, no el fondo.** El responsable sigue siendo el mismo, igual que los datos, los fines y los proveedores. Según la regla de `src/content/privacy-policy.ts`, eso es redacción y no pide un `POLICY_VERSION` nuevo: nadie tiene que volver a autorizar. Igual se avisa a los usuarios del cambio de nombre (§8.4).
- **La frase «Razón y dinero, en el mismo lugar»** (entrada y bienvenida) nació del nombre viejo. Se queda hasta que haya una nueva (§8.5).
- **El dominio de respaldo `reasonny.app`** en `layout.tsx`, `robots.ts` y `sitemap.ts` sigue igual hasta decidir el dominio (§8.1).

### 8.4 Salida

- [ ] Deploy con `vercel --prod` y **reasignar el alias** `reasonny.vercel.app` a mano (`CLAUDE.md`, Cuentas).
- [ ] `pnpm telegram:webhook` para que el bot pase a llamarse Pilo, y subir `pilo-avatar-bot.jpg` como foto del bot.
- [ ] Revisar el nombre en lo que se configura fuera del código y cambiarlo donde diga Reasonny: la pantalla de consentimiento de Google (Google Cloud → Branding) y el nombre de la app en los correos del código de un solo uso (Neon Auth).
- [ ] Comprobar en un iPhone real que el icono nuevo aparece al reinstalar la PWA. iOS guarda el icono viejo hasta que se quita y se vuelve a añadir a la pantalla de inicio: hay que decírselo a los usuarios.
- [ ] Avisar a los 3 usuarios del cambio de nombre, y de la política si cambió (§8.3).

### 8.5 Preguntas abiertas

- ~~¿Qué frase reemplaza a «Razón y dinero, en el mismo lugar»?~~ **«Pagas. Pilo anota.»** (30-oct-2026). El plan completo del copy está en [`PILO_COPY.md`](PILO_COPY.md).
- ~~¿La voz costeña llega a la interfaz o se queda en el bot?~~ **Poca en la interfaz**, más en el bot ([`PILO_COPY.md`](PILO_COPY.md) §7).
- ¿Pilo es el avatar del bot desde el primer día del cambio de nombre?
- ¿Se cuenta en público la historia del tití barranquillero? Si sí, con la especie bien dicha (§3.2).
- ¿Rive algún día? Solo si aparece una necesidad que CSS no cubra (§6.2).

---

## 9. Fuentes

Consultadas el 29 y el 30-oct-2026.

- Monobank: [Mono cat (mascot)](https://en.wikipedia.org/wiki/Mono_cat_(mascot))
- Ejemplos de mascotas de apps: [48 Famous App Mascots](https://svgapp.ai/blog/app-mascot-examples/) · [Mascot Design Trends 2026](https://svgapp.ai/blog/mascot-design-trends-2026/)
- Duolingo en TikTok: [CNBC, 13-oct-2026](https://www.cnbc.com/make-it/2026/10/13/gen-z-spending-power-brands.html)
- Duolingo y Rive: [World character visemes](https://blog.duolingo.com/world-character-visemes)
- Rive: [precios](https://rive.app/docs/account-admin/pricing) · [importar SVG](https://rive.app/docs/editor/assets/svg) · [plan gratis y uso comercial](https://www.exodeui.com/questions/is-rive-free-for-commercial-use/)
- El tití como símbolo de Barranquilla 2018: [El Heraldo](https://www.elheraldo.co/deportes/un-titi-cabeciblanco-simbolo-de-juegos-barranquilla-2018-393467)
- Fotos del tití cabeciblanco: [Wikimedia Commons, *Saguinus oedipus*](https://commons.wikimedia.org/wiki/Category:Saguinus_oedipus)
- La skill illo: [tmchow/illo-skill](https://github.com/tmchow/illo-skill) · otras revisadas y descartadas: [logo-designer](https://github.com/neonwatty/logo-designer-skill) (escribe SVG a mano, el mismo método de las rondas 4 a 6) y [canvas-design](https://mcpservers.org/claude-skills/anthropic/canvas-design) (afiches, no personajes)
- Autoría humana y obras generadas por IA: [U.S. Copyright Office, Copyright and Artificial Intelligence](https://www.copyright.gov/ai/)
- Miga, Fundación WWB: [El País](https://www.elpais.com.co/tecnologia/la-fundacion-wwb-colombia-lanza-miga-su-app-de-educacion-financiera.html)
- PliP: [Portafolio](https://www.portafolio.co/tecnologia/ia-intuitiva-para-optimizar-el-manejo-de-finanzas-personales-las-novedades-de-la-aplicacion-plip-489086)
- Tino: [Dealroom](https://app.dealroom.co/companies/tino_1)
- Kipu: [Google Play](https://play.google.com/store/apps/developer?id=Mossaic) · Quipuk: [RPP](https://rpp.pe/campanas/publirreportaje/quipuk-la-app-peruana-que-te-ayuda-a-controlar-tus-finanzas-y-declarar-tus-impuestos-noticia-1690762)
- Fals Borda y el «hombre hicotea» (ronda 2): [CLACSO](https://biblioteca-repositorio.clacso.edu.ar/bitstream/CLACSO/16387/1/Presentacion-Fals-Borda.pdf)
