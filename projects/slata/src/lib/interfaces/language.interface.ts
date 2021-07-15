export interface ILanguage {
  reference?: string;
  name: string;
  country: string;
  images: Array<IImage>;
}

export interface IImage {
  reference: string;
  name: string;
  size: string;
  contentType: string;
  url: string;
}

export interface IProjectLanguages {
  country: string;
  images: [
    {
      size: string;
      url: string
    }
  ];
  key: string;
  lastPublishDate: string;
  name: string
}
