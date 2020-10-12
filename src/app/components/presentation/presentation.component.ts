import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ContentService } from 'src/app/core/services/content/content.service';
import { ThreeDService } from 'src/app/core/services/three-d.service';
import { CheckPoint } from 'src/app/core/models/checkPoints.model';
import { DataExchangeService } from 'src/app/core/services/DataExchange/data-exchange.service';
import { DisplayData } from 'src/app/core/models/displayData.model';
import {TimelineMax, TweenMax} from 'gsap';
import { SplitText } from "gsap/SplitText";

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
  displayData: DisplayData;

  @ViewChild('jobTitle', { static: true }) jobTitle: ElementRef<HTMLElement>;
  @ViewChild('quote', { static: true }) quote: ElementRef<HTMLElement>;
  @ViewChild('name', { static: true }) name: ElementRef<HTMLElement>;

  
  constructor(private contentS: ContentService, private threeDService: ThreeDService, private dataEx: DataExchangeService) { }

  ngOnInit(): void {
    this.startY = document.getElementById('presentation').offsetTop;
    this.endY = document.getElementById('presentation').offsetHeight;
    // this.dataEx.addData(this.endY);
    // console.log(this.endY)
    this.content = this.contentS.getPresentationContent();
    this.checkPoint = new CheckPoint('presentation', this.startY, this.endY, 0.05, -0.05, 1, 0);
    this.threeDService.addCheckPoint(this.checkPoint);
    this.displayData = new DisplayData('presentation', this.startY, this.endY, -0.4,0,0, false, 0);
    this.dataEx.addDisplayData(this.displayData);
    this.animateGsap();
    // console.log('ready state',document.readyState)
  }

  animateGsap(){
    let tl:TimelineMax = new TimelineMax();
    tl.from(this.jobTitle.nativeElement, 0.7, {opacity: 0, y: -50})
      .from(this.quote.nativeElement, 1, {opacity: 0, x: -100})
      .from(this.name.nativeElement, 1.3, {opacity: 0, y: 50})
  }

}
