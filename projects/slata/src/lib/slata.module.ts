import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { SlataComponent } from './components/main/slata.component';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IProjectConfig } from './interfaces/project-config.interface';
// import { LanguageService } from "./services/language/language.service";
// import { TranslationService } from "./services/translation/translation.service";
import { TranslationKeyDirective } from './directives/translation-key/translation-key.directive';
import { SlataService } from "./slata.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [
    SlataComponent,
    TranslationKeyDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  exports: [
    SlataComponent,
    TranslationKeyDirective
  ],
  // providers: [TranslationService, LanguageService]
})
export class SlataModule {

  constructor(
    // public languageService: LanguageService,
    // public translationService: TranslationService
  ) { }

  static forRoot(config?: IProjectConfig): ModuleWithProviders<any> {
    return {
      ngModule: SlataModule,
      providers: [
        SlataService,
        // LanguageService,
        // TranslationService,
        { provide: CONFIG, useValue: config }
      ]
    };
  }
}

export const CONFIG = new InjectionToken<IProjectConfig>('config');
