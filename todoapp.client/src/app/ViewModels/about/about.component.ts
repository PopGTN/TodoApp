import { Component } from '@angular/core';
import {TranslocoPipe} from "@ngneat/transloco";


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
}
