import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/core/services/content/content.service';
import { ThreeDService } from 'src/app/core/services/three-d.service';
import { CheckPoint } from 'src/app/core/models/checkPoints.model';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnInit {

  content: any;
  checkPoint: CheckPoint

  constructor(private contentS: ContentService, private threeDService: ThreeDService) { }

  ngOnInit(): void {
    this.content = this.contentS.getPresentationContent();
    this.checkPoint = new CheckPoint('presentation', 0, 0, 0, 0, 0);
    this.threeDService.addCheckPoint(this.checkPoint);
  }

}
