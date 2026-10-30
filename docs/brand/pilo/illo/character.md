# Pilo — custom character

Pilo is a cotton-top tamarin (tití cabeciblanco, endemic to the Colombian
Caribbean); the name is costeño slang for "sharp, on top of things".

Style: **enamel**
Aliases: tití, tití cabeciblanco, tamarin, monkey

## Locked design

- **Body**: one rounded pear-shaped torso, seated, pale white enamel; head
  about as wide as the torso.
- **Crest**: long, smooth, silky white hair that grows from a straight brow
  line and sweeps BACK over the skull in one soft wave, falling behind the
  head down to the shoulders. Smooth outline with a few large rounded locks:
  no spikes, no jagged points, not a lion mane.
- **Face**: a deep charcoal face mask with a flat straight top edge (the
  brow) and small rounded ears on both sides; two SMALL round pale dot eyes
  set close together right under the brow; no mouth, no nose marks.
- **Limbs**: short white arms ending in rounded mitten hands (no fingers);
  short legs tucked under the body.
- **Accent carrier**: the long tail, curving up beside the body — the only
  wine-coloured part.

## Interaction model

- Contact surfaces: mitten hands — hook over an edge, press, carry.
- Reach: short.
- Grip: hook.
- Support/locomotion: seated on body mass; feet.
- Protected regions: the face mask interior — only the eye marks appear.
- Special operators: none (the tail never holds objects).

## Prompt spec (drop into the CHARACTER slot)

> the recurring mascot — a cotton-top tamarin with a rounded pear-shaped
> pale white body and a head as wide as the body. CREST: long, smooth, silky
> white hair that grows from a straight brow line and sweeps BACK over the
> skull in one soft wave, falling behind the head down to the shoulders —
> the crest outline is SMOOTH with a few large rounded locks, NO spikes, NO
> jagged points, NOT a lion mane, NOT messy. FACE: a deep charcoal face mask
> shaped like a rounded shield with a flat straight top edge (the brow);
> two SMALL round pale dot eyes set close together right under the flat
> brow, giving a calm, wise little-old-man look; no mouth, no nose marks.
> Short white arms with rounded mitten hands, short tucked legs. The ONLY
> accent-colored part is the long tail curving up beside the body (deep
> wine #9b2c45 — must NOT be the body color).

## Value rules

- **Dark grounds (wine #781d32, plum #380a1c)**: the white body and crest
  carry the contrast; the face mask stays charcoal; eyes pale.
- **Light grounds (champagne #e4cca6)**: same cells; the dark metal outline
  keeps the white body from melting into the ground.

## Expressions (eye marks only — the face never gets a mouth)

| Expression | Eye marks |
| :--- | :--- |
| Calm (default) | two small round pale dots |
| Surprised | two slightly larger round pale dots |
| Happy | two small upward pale arcs |
| Thinking | two small dots shifted up and to one side |
| Sleeping | two short flat pale lines |

## Personality

A calm, slightly grumpy little old man of the forest — the white crest makes
him look like a wise grandpa. Earnest, never zany. Emotion is carried by the
eye marks and the pose, never by an open mouth.

## Reference

`../pilo-referencia.png` is the locked model sheet. Every new render passes
it as `--ref`; renders made from the prompt alone drift into a different
character.
