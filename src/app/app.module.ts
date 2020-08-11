import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { ThreeTestComponent } from './components/three-test/three-test.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PresentationComponent } from './components/presentation/presentation.component';
import { HardSkillsComponent } from './components/hard-skills/hard-skills.component';
import { Canvas3DComponent } from './components/shared/canvas3-d/canvas3-d.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ThreeTestComponent,
    PresentationComponent,
    HardSkillsComponent,
    Canvas3DComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
