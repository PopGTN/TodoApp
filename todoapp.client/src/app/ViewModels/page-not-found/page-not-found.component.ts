import {Component, Inject} from '@angular/core';
import {RouterLink} from "@angular/router";
import {TranslocoModule} from "@ngneat/transloco";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    RouterLink,
    TranslocoModule
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {


}
