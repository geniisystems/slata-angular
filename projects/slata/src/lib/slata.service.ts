import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CONFIG } from './slata.module';
import { IProjectConfig } from "./interfaces/project-config.interface";
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { IProjectDetails } from './interfaces/project-details.interface';
import { environment } from "./constants/environment";

@Injectable({
  providedIn: 'root'
})
export class SlataService {

  public allTranslation$: Subject<Array<any>> = new Subject<Array<any>>();
  public translationKeyArray: Array<any> = [];


  constructor(
      @Inject(CONFIG) private config: IProjectConfig,
      private http: HttpClient
  ) { }

  getProjectDetails(): Observable<IProjectDetails> {
    const type = `BACKEND_URL_${this.config.backendType}`;
    // @ts-ignore
    const apiURL = environment[type]
    return this.http.get<IProjectDetails>(`${apiURL}public/projects`, {
      headers: new HttpHeaders().set('projectToken', this.config.projectToken)
    });
  }

  getTranslationByLanguage(languageName: string): Observable<HttpResponse<any>> {
    const type = `BACKEND_URL_${this.config.backendType}`;
    // @ts-ignore
    const apiURL = environment[type]
    return this.http.get<any>(`${apiURL}public/projects/translations`, {
      params: new HttpParams().set('language', languageName),
      headers: new HttpHeaders().set('projectToken', this.config.projectToken),
      observe: 'response'
    });
  }

  getTranslationByKey(keyName: string): string {

    if (localStorage.length > 0 &&  localStorage.getItem('slataTranslations')) {
      const locale = localStorage.getItem('slataTranslations')
      if (locale != null) {
        const slataTranslations = JSON.parse(locale);
        this.translationKeyArray = slataTranslations.translations;
      }
    }
    const namespace = this.translationKeyArray.find((elem: { key: string; }) => elem.key === keyName);

    if(namespace && namespace.value) {
      return  namespace.value
    }
    else {
      const key = [ { fullKey: keyName, defaultValue: "default value" } ];
      this.sendNewKey(key);
    }
    return '';
  }

  sendNewKey(key: Array<any>): Observable<HttpResponse<any>> {
    const type = `BACKEND_URL_${this.config.backendType}`;
    // @ts-ignore
    const apiURL = environment[type]
    return this.http.post<any>(`${apiURL}public/projects/translations`, { keys: key }, {
      headers: new HttpHeaders().set('projectToken', this.config.projectToken),
    });
  }

  get isDevMode(): boolean {
    return this.config.developMode || false;
  }
}
