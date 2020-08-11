import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/core/services/content/content.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('menuState', [
      state('show', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('hide', style({
        opacity: 0,
        transform: 'translateY(-50px)',
        display:'none'
      })),
      transition('show => hide', animate('600ms ease-out')),
      transition('hide => show', animate('600ms ease-in'))
    ])
  ]
})
export class HeaderComponent implements OnInit {

  toggled = "";
  isMenuDisplayed = false;
  contents = [];
  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.contents = this.contentService.getMenuContent();
    this.toggled = this.contents[0].cssId;
  }

  toggleMenuItem(str) {
    console.log(str)
    this.toggled = str;
  }

  get stateName() {
    return this.isMenuDisplayed ? 'show':'hide';
  }

  displayMenu() {
    this.isMenuDisplayed = !this.isMenuDisplayed;
  }

}
