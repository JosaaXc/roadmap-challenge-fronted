import { booleanAttribute, Component, computed, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

// Poses of Devi, the DevTalles mascot, each with its own artwork and ratio
export type DeviPose = 'launch' | 'hello' | 'hello-border' | 'laptop' | 'normal';

interface DeviArtwork {
  readonly src: string;
  // Intrinsic size from the artwork's viewBox, so the browser reserves the right box
  readonly width: number;
  readonly height: number;
}

const DEVI_ARTWORK: Record<DeviPose, DeviArtwork> = {
  // `launch` renders inline in the template so its thrusters can animate; this
  // entry stays as the record of where that artwork comes from
  launch: { src: '/assets/devi/devi-launch.svg', width: 440, height: 520 },
  hello: { src: '/assets/devi/devi-hello.svg', width: 273, height: 291 },
  // Outlined variant, the one that holds up against a dark surface
  'hello-border': { src: '/assets/devi/devi-hello-border.svg', width: 293, height: 311 },
  laptop: { src: '/assets/devi/devi-laptop.svg', width: 247, height: 276 },
  normal: { src: '/assets/devi/devi-normal.svg', width: 247, height: 285 },
};

// Devi, sized by the consumer: `<app-devi-mascot pose="hello" class="h-40" />`
// Always decorative: whatever the mascot suggests, the copy around it has to say
// on its own, so screen readers are never told about an image that adds nothing
@Component({
  selector: 'app-devi-mascot',
  templateUrl: './devi-mascot.html',
})
export class DeviMascot {
  readonly pose = input.required<DeviPose>();

  // Ambient drift, turned off where the mascot sits next to moving content
  readonly floating = input(true, { transform: booleanAttribute });

  protected readonly artwork = computed(() => DEVI_ARTWORK[this.pose()]);

  constructor() {
    classes(() => ['inline-block', this.floating() ? 'motion-safe:animate-float' : '']);
  }
}
