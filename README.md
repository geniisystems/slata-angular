# **Slata-angular**

Angular plugin for the Slata online translation platform. This plugin can be applied to your Angular website to upload new and download existing translatable tags, thus automating the translation process without the need for translation files.

_**Please Note:**_ this plugin will only work with a **unique project token** available to you once you have registered with [Slata](https://www.slata.io) and created a project.

## **Installation**

Use the package manager [npm](https://www.npmjs.com/) to install the plugin.

```bash
npm install slata
```

## **Usage**

### **Adding Slata configuration to your environments variable**

Open `/src/environments/environment.ts` and add your Slata configuration.

Available configuration items are:

* **projectToken**:string (*required*) - the unique token for your project You can find your project token in [slata.io](https://slata.io/).
* **developMode**:boolean (*optional* default = false) - set to **true** to push new keys to the slata online translation platform.

### EXAMPLE

```ts
export const environment = {
    production: false,
    slataConfig: {
        projectToken: 'eyJhbGciOiJIUzI1NiJ9.xMjM0NTY3ODkwIiwisZSI6ImVuLVpBIiwiaWF0Ijox',
        developMode: true
    }
};
```

### Create an `@NgModule` including the `SlataModule`

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

If you need to share module in another modules in project remember to export the SlataModule

```ts
imports: [
    BrowserModule,
    HttpClientModule,
    SlataModule.forRoot(environment.slataConfig),
  ], 
exports: [HttpClientModule, SlataModule]
```

## **Language dropdown (optional)**

Include the following tag to your html to add a dropdown containing all available (published) languages

```angular2html
<lib-slata></lib-slata>
```

This comes with the following @Input() arguments

* **isIcon**:boolean (*optional* default = false) - adds a icon to the dropdown depicting the relevant country to which the language applies
* **iconSize**: number (*optional* default = 20) - defines the pixel size of the icon. Valid values are 20, 60, 120 and 140

## **Slata translation directive**

In order to allow for automatic tag registration on - and retrieval from - the Slata system you need to apply the following directive to each HTML tag containing translatable text:

```angular2html
<p libTranslationKey></p>
```

This will ensure that all texts inside the tag will be replaced by the translated text for the requested language. If no translated text is available the original text or the text in the @Input 'defaultValue' will be used.

**libTranslationKey** requires the following arguments:

* **fullKey**:string (*required*) - this is the key that uniquely identifies this piece of text
* **defaultValue**:string (*optional*) - default text to display if no translation is available (typically the text in the source language)

Set translation key for each directive by @Input() fullKey and @Input() defaultValue

```angular2html
<p libTranslationKey
   [fullKey]="'header.navigation.home_page'"
   [defaultValue]="'some text inside tag'">
</p>
```

### More about **fullKey**

* Valid values for fullKey are letters or numbers as well as dots and underscore [[A-za-z0-9\._]]
* Dots divide namespaces: currently we support namesspaces of depth 1, i.e. ONE dot - any other dots will be treated as ordinary characters.
* Underscores are used to infer namespace names on the Slata website: they are replaced by space and each resulting word is capitalized.

### EXAMPLE 2

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

## **Slata Service**

If you need to retrieve translations directly you can do so by calling the SlataService as follows:

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
    // This method returns the translated STRING
    return this.slataService.getTranslationByKey(fullKey, defaultValue);
  }
}
```
