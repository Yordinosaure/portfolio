import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/core/services/content/content.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  toggled = "";
  contents = [];
  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.contents = this.contentService.getMenuContent();
  }

  toggle(str) {
    console.log(str)
    this.toggled = str;
  }

}
