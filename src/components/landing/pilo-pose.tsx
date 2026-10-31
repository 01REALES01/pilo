import Image from 'next/image';
import React from 'react';

/**
 * Intrinsic size of each served pose (public/images/pilo/, trimmed to 480 on
 * the long side). Only the ratio matters here: it is what lets the browser
 * reserve the right height before the file arrives, so nothing shifts (CLS).
 */
const POSES = {
  anota: [480, 474],
  feliz: [480, 476],
  sorprendido: [474, 480],
  pensando: [480, 480],
  dormido: [480, 462],
  celebra: [471, 480],
} as const;

export type PiloPoseName = keyof typeof POSES;

interface PiloPoseProps {
  readonly pose: PiloPoseName;
  /** Rendered width in CSS px; next/image serves 1x and 2x of it. */
  readonly width: number;
  readonly className?: string;
}

/**
 * Pilo, drawn (docs/PILO_COPY.md §5.16-5.17).
 *
 * Always decorative: the text beside it already says what the pose shows, so
 * the alt is empty and a screen reader skips it. And never beside a figure:
 * the mascot lives next to copy, never on top of the data (docs/PILO.md §5.1,
 * rule 5).
 */
export function PiloPose({ pose, width, className }: PiloPoseProps): React.ReactElement {
  const [w, h] = POSES[pose];
  return (
    <Image
      className={className ? `landing-pilo ${className}` : 'landing-pilo'}
      src={`/images/pilo/pilo-${pose}.webp`}
      alt=""
      width={width}
      height={Math.round((width * h) / w)}
    />
  );
}
