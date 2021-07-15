import { Inject, Injectable } from '@angular/core';
import { IProjectConfig } from "../../interfaces/project-config.interface";
import { CONFIG } from "../../slata.module";
import { Observable } from "rxjs";
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { environment } from "../../constants/environment";
import {IProjectDetails} from "../../interfaces/project-details.interface";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(
    @Inject(CONFIG) private config: IProjectConfig,
    private http: HttpClient
  ) { }

  // getProjectDetails(): Observable<IProjectDetails> {
  //   const apiURL = this.config.production
  //     ? environment.BACKEND_URL_PRODUCTION
  //     : environment.BACKEND_URL_STAGING;
  //   return this.http.get<IProjectDetails>(`${apiURL}public-api/projects`, {
  //     headers: new HttpHeaders().set('projectToken', this.config.projectToken)
  //   });
  // }
}
