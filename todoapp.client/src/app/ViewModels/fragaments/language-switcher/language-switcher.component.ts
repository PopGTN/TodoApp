import { Component } from '@angular/core';
import {TranslocoPipe, TranslocoService} from '@ngneat/transloco';
import {LanguageService} from "../../../Core/Services/Language.Service";

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css',
  standalone: true,
  imports: [
    TranslocoPipe
  ]
})
export class LanguageSwitcherComponent {

  constructor(private translocoService: TranslocoService, private LangServ :LanguageService) {}

  setLanguage(language: string) {
    this.LangServ.setLanguagePreference(language);
  }

  getActiveLanguage(): string {
    return this.translocoService.getActiveLang();
  }
}
