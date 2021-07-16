# slata-angular
Angular plugin for the Slata online translation platform

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install dependency.

```bash
npm install slata
```

## Usage

```python
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";

import { SlataModule } from "slata";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // Import here
    //
    SlataModule.forRoot(CONFIG),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

```

```python
// CONFIG EXAMPLE
//
export const CONFIG {
    backendType: 'LOCAL' | 'STAGING' | 'PRODUCTION',
    projectToken: '************' 
}
```

```python
// If need to share module in another modules in project.
// Don't forget about export
//
imports: [
    BrowserModule,
    // Import SlataModule
    //
    SlataModule.forRoot(CONFIG),
  ],
  exports: [SlataModule],
```

## Include

```python
<lib-slata></lib-slata>
```
> It is dropdown with available languages for project
## With @Input()
> @Input **isIcon**: boolean

> @Input **iconSize**: number 

> Available numbers: 20 , 60 , 120 , 140

## **Slata translation directive**

```python
// init our directive for any tag in html
//
<p libTranslationKey >Some text inside tag</p>
```

```python
// set translation key for each directive by @Input() fullKey
//
<p libTranslationKey
   [fullKey]="'header.navigation.home_page'">
    Some text inside tag
</p>
```
*VALID\* separations is dots and underscore!!!*

*Dots divide a sections!*

###EXAMPLE

```python
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


<p libTranslationKey
   [fullKey]="'header.navigation.home_page'">
    text will be here
</p>
```

## Slata Service

```python
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
  
  translationMessage(fullKey: string): string {
    // This method return STRING
    //
    return this.slataService.getTranslationByKey(fullKey)
  }
}
```
