import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { DeviMascot } from '../../../../shared/ui/devi-mascot/devi-mascot';
import { DiscordButton } from '../../../../shared/ui/discord-button/discord-button';
import { Reveal } from '../../../../shared/ui/reveal/reveal';

@Component({
  imports: [RouterLink, HlmButton, HlmCardImports, DeviMascot, DiscordButton, Reveal],
  selector: 'app-landing-closing',
  templateUrl: './landing-closing.html',
  host: { class: 'contents' },
})
export class LandingClosing {}
