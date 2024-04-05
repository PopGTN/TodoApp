import {TranslocoService} from "@ngneat/transloco";
import {Injectable} from "@angular/core";

export const supportedLanguages = ['en', 'fr', 'de', 'es', 'hi', 'ja']; // List of supported languages
export const defaultLang = 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(private translocoService: TranslocoService) {
  }

  setLanguageBasedOnPreference() {
    const storedPreference = localStorage.getItem('languagePreference');

    if (storedPreference) {
      if (storedPreference === 'auto') {
        this.setBrowserDefaultLanguage();
      } else {
        this.translocoService.setActiveLang(storedPreference);
      }
    } else {
      // If there's no stored preference, default to auto
      localStorage.setItem('languagePreference', 'auto');
      this.setBrowserDefaultLanguage();
    }
  }

  setBrowserDefaultLanguage() {
    const browserLanguage = navigator.language.split('-')[0]; // Extract the language code

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

  setLanguagePreference(preference: string) {
    localStorage.setItem('languagePreference', preference);
    if (preference === 'auto') {
      this.setBrowserDefaultLanguage();
    } else {
      this.translocoService.setActiveLang(preference);
    }
  }
}
