import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css',
  standalone: true,
  imports: []
})
export class LanguageSwitcherComponent {
  constructor(private translocoService: TranslocoService) {}

  setLanguage(language: string) {
    this.translocoService.setActiveLang(language);
  }

  getActiveLanguage(): string {
    return this.translocoService.getActiveLang();
  }
}
