import {Component, ElementRef, inject, OnInit} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {TitleStrategyService} from "../../../Core/Services/TitleStrategy.Service";
import {Title} from "@angular/platform-browser";
import {document} from "ngx-bootstrap/utils";
import {setOffsetToUTC} from "ngx-bootstrap/chronos/units/offset";
import {isEmpty} from "rxjs";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {LanguageSwitcherComponent} from "../language-switcher/language-switcher.component";
import {TranslocoPipe} from "@ngneat/transloco";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbar,
    TooltipModule,
    LanguageSwitcherComponent,
    TranslocoPipe
  ],
})
export class NavbarComponent {
  protected readonly document = document;
}
