import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  color = {darkpurple: "#2E1114", deepred: "#501B1D", darkLila: "#64485C", lightLila: "#83677B", gray: "#ADADAD"};

  constructor() { }

  getColors() {
    return this.color;
  }
}
