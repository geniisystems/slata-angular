import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { SlataService } from '../../slata.service';

@Directive({
  selector: '[libTranslationKey]'
})
export class TranslationKeyDirective implements OnInit{
  @Input() fullKey: string = '';
  @Input() defaultValue: string = '';
  savedTextContent: string = '';


  constructor(
    private translationService: SlataService,
    private elementRef: ElementRef,
  ) {
    this.changeTextByKey();
  }

  ngOnInit() {
    this.savedTextContent = this.elementRef.nativeElement.textContent;
    this.changeTextByKey();
    this.getProjectTranslations();
  }

  changeTextByKey(): void {
    this.translationService.allTranslation$.subscribe(
        translations => {
          if (translations.length > 0) {
            const namespace = translations.find(elem => elem.key === this.fullKey);
            if(namespace && namespace.value) {
              this.elementRef.nativeElement.textContent = namespace.value
            } else {
              this.elementRef.nativeElement.textContent = this.defaultValue ? this.defaultValue : this.savedTextContent;
            }
          }
        }
    )
  }

  getProjectTranslations(): void {
    if (localStorage.length > 0 &&  localStorage.getItem('slataTranslations')) {
      const locale = localStorage.getItem('slataTranslations')
      if (locale != null) {
        const slataTranslations = JSON.parse(locale);
        const namespace = slataTranslations.translations.find((elem: { key: string; }) => elem.key === this.fullKey);

        if(namespace && namespace.value) {
          this.elementRef.nativeElement.textContent = namespace.value
        } else {
          this.elementRef.nativeElement.textContent = this.defaultValue ? this.defaultValue : this.savedTextContent;
        }
      }
    }
  }
}
