import {IProjectLanguages} from "./language.interface";

export interface IProjectDetails {
  allKeyCount: number;
  languages: IProjectLanguages[];
  name: string
}
