import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { SlataComponent } from './components/main/slata.component';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IProjectConfig } from './interfaces/project-config.interface';
import { TranslationKeyDirective } from './directives/translation-key/translation-key.directive';
import { SlataService } from "./slata.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

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
  ]
})
export class SlataModule {

  constructor() { }

  static forRoot(config: IProjectConfig): ModuleWithProviders<any> {

    if(!config.developMode){
      config.developMode = false
    }

    if(!config.backendType){
      config.backendType = 'PRODUCTION';
    }

    return {
      ngModule: SlataModule,
      providers: [
        SlataService,
        { provide: CONFIG, useValue: config }
      ]
    };
  }
}

export const CONFIG = new InjectionToken<IProjectConfig>('config');
