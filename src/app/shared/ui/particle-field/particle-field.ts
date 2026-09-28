import { Component } from '@angular/core';

// Pinpoints of light, the accent colour, and a few out of focus for depth
const MOTE_LOOKS = {
  spark: 'size-0.75 bg-foreground/80',
  glint: 'size-1 bg-highlight/80',
  haze: 'size-1.5 bg-highlight/35 blur-[1px]',
} as const;

interface Mote {
  // Across the field, in percent
  readonly left: number;
  readonly look: keyof typeof MOTE_LOOKS;
  // One climb, in seconds. The delay is negative so the field starts already in motion
  readonly duration: number;
  readonly delay: number;
  // Sideways sway over the climb, in pixels
  readonly drift: number;
}

// Fixed rather than random, so every render draws the same field
const MOTES: readonly Mote[] = [
  { left: 4, look: 'spark', duration: 10, delay: -2, drift: 6 },
  { left: 11, look: 'glint', duration: 12, delay: -7, drift: -10 },
  { left: 19, look: 'spark', duration: 9, delay: -4, drift: 8 },
  { left: 27, look: 'haze', duration: 14, delay: -9, drift: -6 },
  { left: 34, look: 'spark', duration: 8, delay: -1, drift: 10 },
  { left: 41, look: 'glint', duration: 11, delay: -11, drift: -12 },
  { left: 48, look: 'spark', duration: 9, delay: -6, drift: 5 },
  { left: 55, look: 'haze', duration: 13, delay: -3, drift: -8 },
  { left: 61, look: 'glint', duration: 12, delay: -8, drift: 12 },
  { left: 67, look: 'spark', duration: 8, delay: -5, drift: -5 },
  { left: 72, look: 'haze', duration: 15, delay: -12, drift: 9 },
  { left: 77, look: 'glint', duration: 9, delay: -2, drift: -10 },
  { left: 82, look: 'spark', duration: 11, delay: -9, drift: 7 },
  { left: 87, look: 'glint', duration: 10, delay: -4, drift: -7 },
  { left: 92, look: 'spark', duration: 8, delay: -7, drift: 6 },
  { left: 96, look: 'haze', duration: 13, delay: -10, drift: -9 },
];

// Motes rising through the positioned box it fills, for the one thing on screen that should
// feel alive. Motion is all it is, so with reduced motion it is not drawn at all
@Component({
  selector: 'app-particle-field',
  templateUrl: './particle-field.html',
  host: {
    'aria-hidden': 'true',
    // Fades in, as the motes start mid-climb and would otherwise all appear at once
    class:
      'animate-in fade-in pointer-events-none absolute inset-0 overflow-hidden duration-1000 motion-reduce:hidden',
  },
})
export class ParticleField {
  protected readonly motes = MOTES;
  protected readonly looks = MOTE_LOOKS;
}
