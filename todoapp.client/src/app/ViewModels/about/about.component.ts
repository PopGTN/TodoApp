import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  standalone: true,
  imports: [
    TranslocoPipe
  ],
})
export class AboutComponent {
  constructor(private translocoService: TranslocoService) {}
}
