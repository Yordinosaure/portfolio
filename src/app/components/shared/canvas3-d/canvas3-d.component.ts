import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ThreeDService } from 'src/app/core/services/three-d.service';
import { ThreeService } from 'src/app/core/services/three/three.service';
import { DataExchangeService } from 'src/app/core/services/DataExchange/data-exchange.service';
import { Observable, observable } from 'rxjs';

@Component({
  selector: 'app-canvas3-d',
  templateUrl: './canvas3-d.component.html',
  styleUrls: ['./canvas3-d.component.scss']
})
export class Canvas3DComponent implements OnInit {

  @ViewChild('renderer', { static: true })
  rendererCanvas: ElementRef<HTMLDivElement>;

  @HostListener('window:resize')
  onResize() {
    this.threeDService.resizeAction();
  }

  @HostListener('mousemove', ['$event'])
  onMouseDrag(event) {
    // this.threeService.onMouseDragAction(event);
  }

  // @HostListener('wheel', ['$event']) // for window wheel events
  // onWheel(event) {
  //  console.log(event.deltaY)
  //   this.threeService.zoom(event.deltaY);
  // }

  // @HostListener('window:scroll', ['$event'])
  // onScroll(event) {
  //   event.preventDefault();
  // }

  @HostListener('wheel', ['$event'])
  onWheel(event) {
    //  this.threeDService.upDateDisplayCoord(window.pageYOffset);
    //  console.log('scroll', window.pageYOffset)
    // this.getActualPos()
    if (!this.scrolling) {
      this.scroll(event.deltaY)

    }
    // console.log(event)
  }

  offsetData: any[] = [];
  currentOffsetData: number;
  scrollY = 0;
  scrolling = false;
  endY: number;
  startY: number;
  actualY: number = 1;

  constructor(private threeDService: ThreeDService, private dataEx: DataExchangeService
    // private threeService: ThreeService
  ) { }

  ngOnInit(): void {
    this.threeDService.createScene(this.rendererCanvas);
    this.dataEx.componentsData.subscribe(x => {
      this.offsetData = x;
      this.startY = this.offsetData[0];
      this.endY = this.offsetData[1];
      this.getActualPos();
    })

  }

  getActualPos() {
    this.actualY = document.documentElement.scrollTop;
    if (this.actualY > this.endY || this.actualY < this.startY) {

      for (let i = 0; i < this.offsetData.length; i++) {
        if (this.actualY >= this.offsetData[i] && this.actualY < this.offsetData[i + 1]) {
          this.startY = this.offsetData[i];
          this.endY = this.offsetData[i + 1];
        }
      }
    }
  }

  scroll(deltaY: number): void {
    console.log('event', event)
    this.getActualPos();
    this.scrolling = true;
    if (deltaY >= 0) {
      console.log('if')
      window.scrollTo({
        top: this.scrollY += 5,
        left: 0,
        behavior: 'smooth'
      });
      console.log('actual', this.actualY)
      console.log('end', this.endY);
      console.log('scrollY', this.scrollY);
      if (this.scrollY < this.endY) {
        setTimeout(() => { this.scroll(deltaY) }, 10)
      }
      else {
        this.scrolling = false;
      }
    } 
    else {
      window.scrollTo({
        top: this.scrollY -= 5,
        left: 0,
        behavior: 'smooth'
      });
      if (this.scrollY > this.startY) {
        setTimeout(() => { this.scroll(deltaY) }, 10)
      } else {
        this.scrolling = false;
      }
    }
  }
}
