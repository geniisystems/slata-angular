import { Component, Input, OnInit } from '@angular/core';
import { IProjectLanguages } from '../../interfaces/language.interface';
import { SlataService } from '../../slata.service';

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
  }

  loadProjectDetails(): void {
    this.translationService.getProjectDetails().subscribe(
      data => {
        if (data) {
          this.languages = data.languages;
          if(data.languages.length > 0) {
            this.selectedLanguageKey = data.languages[0].key;
            this.getCurrentUserLanguageKey();
            this.getTranslationByLanguage(this.selectedLanguageKey);
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
    if (languageName) {
      this.translationService.getTranslationByLanguage(languageName).subscribe(
        data => {
          if(data) {
            this.saveLanguagesToLocalStorage(data.body.translations);
            this.translationService.allTranslation$.next(data.body.translations);
            this.getData();
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

  getData(): void {
    const w = window as any;
    setTimeout(() => {
      let allKey: any[] = [];
      w.webpackJsonp.forEach((el: any) => {
        for (const key in el[1]) {
          let startFindIndex = 0;
          while (true) {
            const indexOfSearch = el[1][key].toString().indexOf('property"]("fullKey", "', startFindIndex);
            if (indexOfSearch === -1) { break; }
            const indexOfEnd = el[1][key].toString().indexOf('"', indexOfSearch + 23);
            const keyName = el[1][key].toString().slice(indexOfSearch + 23, indexOfEnd);
            let keyValue: any = '';
            const indexOfDefaultValue = el[1][key].toString().indexOf('defaultValue', indexOfEnd);
            if (indexOfDefaultValue === -1 || indexOfDefaultValue > indexOfEnd + 15)  {
              keyValue = null;
            } else {
              const indexOfEndDefaultValue = el[1][key].toString().indexOf('\"\);', indexOfDefaultValue + 16);
              keyValue = el[1][key].toString().slice(indexOfDefaultValue + 16, indexOfEndDefaultValue);
            }
            startFindIndex = indexOfEnd + 1;
            allKey.push({
              fullKey: keyName,
              defaultValue: keyValue
            });
            allKey = allKey.filter(kk => !kk.fullKey.startsWith(`'`));
          }
        }
      });
      let newKey: any[] = [];
      if (localStorage.getItem('slataTranslations')){
        const slataTranslations: Array<any> = JSON.parse(<string>localStorage.getItem('slataTranslations')).translations;
        allKey.forEach(elem => {
          if (!slataTranslations.some(slata => slata.key === elem.fullKey)){
            newKey.push(elem);
          }
          newKey = newKey.filter(key => key.defaultValue);
        });
      }
      if(newKey && newKey.length > 0) {
        this.translationService.sendNewKey(newKey).subscribe(
            () => {
              this.getTranslationByLanguage(this.selectedLanguageKey);
            }, err => {
              console.log(err);
            }
        )
      } else {
        this.getData();
      }
    }, 5000);
  }
}
