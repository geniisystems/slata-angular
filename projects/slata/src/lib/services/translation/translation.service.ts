import {Inject, Injectable} from '@angular/core';
import {CONFIG} from "../../slata.module";
import {IProjectConfig} from "../../interfaces/project-config.interface";
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {environment} from "../../constants/environment";
import {IProjectDetails} from "../../interfaces/project-details.interface";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  public allTranslation$: Subject<Array<any>> = new Subject<Array<any>>();

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
}
