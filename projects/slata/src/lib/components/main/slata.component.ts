import { Component, HostListener, Input, OnInit } from '@angular/core';
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
  isOpen = false;
  @HostListener('window:mouseup', ['$event'])
  handle(event: any): void {
    if(!event.target.dataset.selectValue && !event.target.closest('.language') && this.isOpen){
      this.isOpen = !this.isOpen;
    }
  }

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
            this.translationService.isDevMode ? this.getData() : null;
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

  openDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectOption(event: any): void {
    if(event.target.dataset.selectValue && event.target.dataset.selectValue !== this.selectedLanguageKey){
      this.getTranslationByLanguage(event.target.dataset.selectValue);
      this.selectedLanguageKey = event.target.dataset.selectValue;
      this.isOpen = !this.isOpen;
    }
  }

  private getData(): void {
    const w = window as any;
    setTimeout(() => {
      let allKey: any[] = [];
      let arrFunctions: any;
      if(w.webpackJsonp){
        arrFunctions = w.webpackJsonp;
      }
      else {
        for (const key in window) {
          if(key.includes('webpackChunk')){
            arrFunctions = window[key] as any;
          }
        }
      }
      arrFunctions.forEach((el: any) => {
        for (const key in el[1]) {
          let startFindIndex = 0;
          while (true) {
            const indexOfSearch = el[1][key].toString().indexOf('ɵɵproperty"]("', startFindIndex);
            if (indexOfSearch === -1) { break; }
            const indexOfEnd = el[1][key].toString().indexOf(');', indexOfSearch + 13);
            const keyName = el[1][key].toString().slice(indexOfSearch + 13, indexOfEnd);
            startFindIndex = indexOfEnd + 1;
            allKey.push(keyName);
            allKey = allKey.filter(str => str.includes('fullKey') && str.includes('defaultValue'));
          }
        }
      });
      const regExp = /(?<fullKey>fullKey",\s"[^"]+)|(?<defaultValue>defaultValue",\s"[^"]+)/gmu;
      const newAllKey: any[] = [];
      allKey.forEach(elem => {
        const arrPropAndVal: any[] = [];
        elem.match(regExp).forEach((some: string) => {
          const afterSplit =  some.split('", "');
          arrPropAndVal.push(afterSplit);
        });
        const entries = new Map(arrPropAndVal);
        // @ts-ignore
        const obj = Object.fromEntries(entries);
        newAllKey.push(obj);
      });
      newAllKey.map(elem => {
        elem.defaultValue = this.decodeUnicode(elem.defaultValue);
        return elem;
      });
      let correctNewKey: any[] = [];
      let badNewKey: any[] = [];
      const keyRegExp = /^[a-z0-9_]+\.[a-z0-9_]+(?:\.[a-z0-9_]+)*$/;
      if (localStorage.getItem('slataTranslations')){
        const slataTranslations: Array<any> = JSON.parse(<string>localStorage.getItem('slataTranslations')).translations;
        newAllKey.forEach(elem => {
          if (!slataTranslations.some(slata => slata.key === elem.fullKey)){
            correctNewKey.push(elem);
          }
          badNewKey = correctNewKey.filter(key => !keyRegExp.test(key.fullKey));
          correctNewKey = correctNewKey.filter(key => key.defaultValue && keyRegExp.test(elem.fullKey));
        });
      }
      if(correctNewKey && correctNewKey.length > 0) {
        this.translationService.sendNewKey(correctNewKey).subscribe(
            () => {
              this.getTranslationByLanguage(this.selectedLanguageKey);
              this.printInfoSuccessPush(correctNewKey);
            }, err => {
              console.log(err);
            }
        )
      } else {
        if (badNewKey && badNewKey.length > 0) {
          this.printInfoBadNewKey(badNewKey);
        }
        this.getData();
      }
    }, 5000);
  }

  private decodeUnicode(str: string): string {
    const regExp = /\\u([\d\w]{4})/gi;
    return unescape(str.replace(regExp, (match: any, grp: string) => String.fromCharCode(parseInt(grp, 16))));
  }

  private printInfoSuccessPush(newKey?: any[]): void {
    if (newKey && newKey.length > 0) {
      console.log('%c================================================================================', 'color:green');
      console.log('%cPushed new key successfully', 'color:green');
      newKey.forEach(elem => {
        console.log(`fullKey: ${elem.fullKey} =>`, `defaultValue: ${elem.defaultValue.length > 40 ? elem.defaultValue.slice(0, 40).concat('...') : elem.defaultValue}` );
      });
      console.log('%c================================================================================', 'color:green');
    }
  }

  private printInfoBadNewKey(badKey?: any[]): void {
    if (badKey && badKey.length > 0) {
      console.log('%c================================================================================', 'color:red');
      console.log('%cPushed new key failed', 'color:red');
      badKey.forEach(elem => {
        console.log(`fullKey: ${elem.fullKey}`);
      });
      console.log('%cInvalid "fullKey" property. Full key must contains only dots and underscore', 'color:red');
      console.log('%c================================================================================', 'color:red');
    }
  }
}
