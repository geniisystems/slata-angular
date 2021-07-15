import {Component, Input, OnInit} from '@angular/core';
import { IProjectLanguages } from "../../interfaces/language.interface";
import { SlataService } from "../../slata.service";

@Component({
  selector: 'lib-slata',
  templateUrl: './slata.component.html',
  styleUrls: ['./slata.component.css']
})
export class SlataComponent implements OnInit {

  @Input() public isIcon: boolean = true;
  @Input() public iconSize: number = 20;
  languages: Array<IProjectLanguages> = [];
  selectedLanguageKey: string = '';

  constructor(
    private translationService: SlataService
  ) { }

  ngOnInit(): void {
    this.loadProjectDetails();
    // this.getCurrentUserLanguageKey();
  }

  loadProjectDetails(): void {
    this.translationService.getProjectDetails().subscribe(
      data => {
        if (data) {
          this.languages = data.languages;
          if(data.languages.length > 0) {
            this.selectedLanguageKey = data.languages[0].key;
            this.getCurrentUserLanguageKey();
          }
        }
      }, err => {
        console.log(err);
      }
    )
  }

  getLanguageImage(key: string): string | undefined {
    const images: {size: string; url: string}[] = this.languages.find(language => language.key === key)?.images || [];
    if(images.length > 0 ) {
      const url = images.find(image => image.size === `h${this.iconSize}`)?.url;
      return url;
    }
    return '';
  }

  getCurrentUserLanguageKey(): void {

    if (localStorage.length > 0 &&  localStorage.getItem('slataTranslations')) {
      const locale = localStorage.getItem('slataTranslations')
      if (locale != null) {
        const slataTranslations = JSON.parse(locale);
        this.selectedLanguageKey = slataTranslations.selectedProjectLanguage;
      }
    }
  }

  getLanguageName(key: string): string | undefined {
    return this.languages.find(language => language.key === key)?.name;
  }

  getLanguageCountry(key: string): string | undefined {
    return this.languages.find(language => language.key === key)?.country;
  }

  getTranslationByLanguage(languageName: string): void {
    console.log(languageName)
    if (languageName) {
      this.translationService.getTranslationByLanguage(languageName).subscribe(
        data => {
          if(data) {
            console.log(data);
            this.saveLanguagesToLocalStorage(data.body.translations);
            this.translationService.allTranslation$.next(data.body.translations);
          }
        }
      );
    } else {
      this.translationService.allTranslation$.next([]);
    }
  }
  saveLanguagesToLocalStorage(translations: any): void {
    const project = {
      projectLanguages: this.languages,
      selectedProjectLanguage: this.selectedLanguageKey,
      translations,
    }
    this.translationService.translationKeyArray = translations;
    localStorage.setItem('slataTranslations', JSON.stringify(project));
  }
}
