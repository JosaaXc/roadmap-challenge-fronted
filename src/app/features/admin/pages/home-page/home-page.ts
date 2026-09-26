import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-home-page',
  imports: [HlmCardImports, RouterModule],
  templateUrl: './home-page.html',
})
export class HomePage {
  readonly adminCards = [
    {
      link: 'catalog',
      title: 'Catálogo de Cursos',
      description:
        'Añade, edita, actualiza o elimina los cursos oficiales disponibles en la plataforma.',
    },
    {
      link: 'questions',
      title: 'Cuestionario',
      description:
        'Gestiona las preguntas, opciones y reglas del Assessment Wizard para los nuevos usuarios.',
    },
    {
      link: 'public-paths',
      title: 'Rutas Públicas',
      description:
        'Administra las rutas de aprendizaje creadas y modera el contenido de la comunidad.',
    },
  ];
}
