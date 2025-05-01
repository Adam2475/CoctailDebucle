import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private availableLanguages: string[] = ['en', 'fr', 'it'];
  private currentLang: string;

  constructor(private translate: TranslateService) {
    this.translate.addLangs(this.availableLanguages);
    this.translate.setDefaultLang('en');

    const browserLang = this.translate.getBrowserLang() ?? 'en';
    const savedLang = localStorage.getItem('lang');

    this.currentLang = this.availableLanguages.includes(savedLang ?? '')
      ? savedLang!
      : (this.availableLanguages.includes(browserLang) ? browserLang : 'en');

    this.translate.use(this.currentLang);
  }

  getCurrentLang(): string {
    return this.currentLang;
  }

  getAvailableLanguages(): string[] {
    return this.availableLanguages;
  }

  changeLanguage(lang: string): void {
    if (this.availableLanguages.includes(lang)) {
      this.currentLang = lang;
      this.translate.use(lang);
      localStorage.setItem('lang', lang);
    }
  }
}
