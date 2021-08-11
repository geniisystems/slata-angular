# Slata-angular
Angular plugin for the Slata online translation platform

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install dependency.

```bash
npm install slata
```

## Usage

### Add Slata config to environments variable
Open `/src/environments/environment.ts` and add your Slata configuration. You can find your project token in [slata.io](https://slata.io/).

```ts
export const environment = {
    production: false,
    slataConfig: {
        projectToken: '<your-project-token>',
        developMode: true | false
    }
};
```
Set `developMode: true` to push new key in slata online translation platform.

### Setup `@NgModule` for the `SlataModule`

```ts
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";

import { HttpClientModule } from "@angular/common/http"; // import HTTP module 
import { SlataModule } from "slata"; // import Slata module
import { environment } from "./environment";  // import config

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule, // added import here
        SlataModule.forRoot(environment.slataConfig), // added import here
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
```

If you need to share module in another modules in project. Don't forget about export
```ts
imports: [
    BrowserModule,
    HttpClientModule,
    SlataModule.forRoot(environment.slataConfig),
  ], 
exports: [HttpClientModule, SlataModule]
```

## Include

```angular2html
<lib-slata></lib-slata>
```
It is dropdown with available languages for project
## With @Input()
> @Input **isIcon**: boolean

> @Input **iconSize**: number 

> Available numbers: 20 , 60 , 120 , 140

## **Slata translation directive**

Init our directive for any tag in html
```angular2html
<p libTranslationKey></p>
```

Set translation key for each directive by @Input() fullKey and @Input() defaultValue
```angular2html
<p libTranslationKey
   [fullKey]="'header.navigation.home_page'"
   [defaultValue]="'some text inside tag'">
</p>
```
*VALID\* separations is dots and underscore!!!*

*Dots divide a sections!*

###EXAMPLE

```ts
const translations = {
    header: {
        title: {
            text: 'Slata'
        },
        navigation: {
            home_page: 'Homepage link'
        }
    }
}
```
```angular2html
<p libTranslationKey
   [fullKey]="'header.navigation.home_page'"
   [defaultValue]="'text will be here'">
</p>
```

## Slata Service

```ts
import { Component, OnInit } from "@angular/core";
import { SlataService } from "slata"; // Import SlataService

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(private slataService: SlataService) {}

  ngOnInit() {
    console.log(this.translationMessage('header.navigation.home_page'))
  }
  
  translationMessage(fullKey: string, defaultValue: string): string {
    // This method return STRING
    return this.slataService.getTranslationByKey(fullKey, defaultValue);
  }
}
```
