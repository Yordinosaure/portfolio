import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/core/services/content/content.service';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnInit {

  content: any;

  constructor(private contentS: ContentService) { }

  ngOnInit(): void {
    this.content = this.contentS.getPresentationContent();
  }

}
