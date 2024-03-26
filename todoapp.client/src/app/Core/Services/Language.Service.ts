import {TranslocoService} from "@ngneat/transloco";
import {Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(private translocoService: TranslocoService) { }

  setDefaultLanguage() {
    const browserLanguage = navigator.language.split('-')[0]; // Extract the language code
    const supportedLanguages = ['en', 'fr', 'de', 'es', 'hi', 'ja']; // List of supported languages

    if (supportedLanguages.includes(browserLanguage)) {
      this.translocoService.setActiveLang(browserLanguage);
      localStorage.setItem('preferredLanguage', browserLanguage);
    } else {
      // Fallback to a default language if the browser language is not supported
      const defaultLanguage = 'en'; // Default language code
      this.translocoService.setActiveLang(defaultLanguage);
      localStorage.setItem('preferredLanguage', defaultLanguage);
    }
  }
}
