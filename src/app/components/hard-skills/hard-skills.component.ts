import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { runInThisContext } from 'vm';
import { ThreeDService } from 'src/app/core/services/three-d.service';
import { CheckPoint } from 'src/app/core/models/checkPoints.model';
import { DataExchangeService } from 'src/app/core/services/DataExchange/data-exchange.service';
import { DisplayData } from 'src/app/core/models/displayData.model';
import { TimelineMax } from 'gsap';

@Component({
  selector: 'app-hard-skills',
  templateUrl: './hard-skills.component.html',
  styleUrls: ['./hard-skills.component.scss']
})
export class HardSkillsComponent implements OnInit {

  
  checkPoint: CheckPoint;
  startY: number;
  endY: number;
  actualY: number;
  scrollY = 0;
  scrolling = false;
  animating:boolean = false;
  displayData: DisplayData;
  isVisible: boolean = false;

  @ViewChild('hardskillText', {static:true}) hardskillText: ElementRef<HTMLElement>;
  @HostListener('window:scroll', ['$event'])
  onWheel(event) {
    this.actualY = document.documentElement.scrollTop;
    console.log(this.actualY)
    if(this.actualY == this.startY && !this.animating) {
      this.animating = true;
      this.animateGsap();
    }
    // if(this.actualY >= this.startY && this.actualY < this.endY && !this.animating) {
    //   this.animating = true;
    //   this.animateGsap();
    // }
  }

  // @HostListener('wheel', ['$event'])
  // onScroll(event) {
  //   this.actualY = document.documentElement.scrollTop;
  //   console.log(this.actualY)
  //   if(this.actualY > this.startY && this.actualY < this.endY && !this.animating) {
  //     this.animating = true;
  //     this.animateGsap();
  //   }
  //   // event.preventDefault();
  //   // console.log('scrolling',event)
  // }


  constructor(private threeDService: ThreeDService, private dataEx: DataExchangeService) { }

  ngOnInit(): void {
    this.startY = document.getElementById('hard-skills').offsetTop;
    this.endY = this.startY + document.getElementById('hard-skills').offsetHeight;
    // this.dataEx.addData(this.endY);
    console.log('endpos', this.endY)
    console.log('hard start point',this.startY);

    this.displayData = new DisplayData('hard-skills', this.startY, this.endY, -0.4,0,0, false, 0);
    this.dataEx.addDisplayData(this.displayData);

    this.checkPoint = new CheckPoint('hard', this.startY, this.endY, 0, -0.1, 2, -2);
    this.threeDService.addCheckPoint(this.checkPoint);
    // this.animateGsap();
  }

  animateGsap() {
    console.log('animate')
    let tl:TimelineMax = new TimelineMax();
    tl.to(this.hardskillText.nativeElement, 1, {opacity: 1, y: 0});
    // this.animating = false;
  }

}
