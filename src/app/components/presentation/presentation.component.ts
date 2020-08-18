import { Component, OnInit, HostListener } from '@angular/core';
import { ContentService } from 'src/app/core/services/content/content.service';
import { ThreeDService } from 'src/app/core/services/three-d.service';
import { CheckPoint } from 'src/app/core/models/checkPoints.model';
import { DataExchangeService } from 'src/app/core/services/DataExchange/data-exchange.service';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnInit {

  content: any;
  checkPoint: CheckPoint;
  startY: number;
  endY: number;
  scrollY = 0;
  scrolling = false;

  
  constructor(private contentS: ContentService, private threeDService: ThreeDService, private dataEx: DataExchangeService) { }

  ngOnInit(): void {
    this.startY = document.getElementById('presentation').offsetTop;
    this.endY = document.getElementById('presentation').offsetHeight;
    this.dataEx.addData(this.endY);
    console.log(this.endY)
    this.content = this.contentS.getPresentationContent();
    this.checkPoint = new CheckPoint('presentation', this.startY, this.endY, 0.05, -0.05, 1, 0);
    this.threeDService.addCheckPoint(this.checkPoint);
    console.log('ready state',document.readyState)
  }

 

}
