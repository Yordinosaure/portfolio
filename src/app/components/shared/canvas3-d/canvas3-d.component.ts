import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ThreeDService } from 'src/app/core/services/three-d.service';
import { ThreeService } from 'src/app/core/services/three/three.service';
import { DataExchangeService } from 'src/app/core/services/DataExchange/data-exchange.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Vector3 } from 'three';
import { DisplayData } from 'src/app/core/models/displayData.model';
import { ScrollingService } from 'src/app/core/services/scrolling/scrolling.service';

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

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    // event.preventDefault();
    // console.log('scrolling')
  }

  @HostListener('wheel', ['$event'])
  onWheel(event) {
    // console.log('wheel')
      this.scrollingService.scroll(event.deltaY);
  }

 
  constructor(private threeDService: ThreeDService, private dataEx: DataExchangeService, private scrollingService: ScrollingService
    // private threeService: ThreeService
  ) { }

  ngOnInit(): void {
    this.threeDService.createScene(this.rendererCanvas);
  } 

}
