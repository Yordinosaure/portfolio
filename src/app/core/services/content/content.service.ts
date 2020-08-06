import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  menuContent = [
    {cssId: 'who', title: 'who am i'},
    {cssId: 'experience', title: 'experience'},
    {cssId: 'hard', title: 'hard skills'},
    {cssId: 'soft', title: 'soft skills'},
    {cssId: 'contact', title: 'contact me'},
    {cssId: 'about', title: 'about'}
  ]

  constructor() { }

  getMenuContent() {
    return this.menuContent;
  }
}
