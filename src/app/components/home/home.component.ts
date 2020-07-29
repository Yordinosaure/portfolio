import { Component, OnInit, ViewChild, ElementRef, HostListener, NgZone } from '@angular/core';
import { LoggerService } from 'src/app/core/services/logger.service';

import { ThreeService } from 'src/app/core/services/three/three.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('renderer', {static: true})
  rendererCanvas: ElementRef<HTMLDivElement>;

  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.threeService.resizeAction(event);
  }

  @HostListener('mousemove', ['$event'])
  onMouseDrag(event){
    this.threeService.onMouseDragAction(event);
  }

  @HostListener('wheel', ['$event']) // for window scroll events
  onScroll(event) {
    this.threeService.zoom(event.deltaY);
  }

  
  
  constructor(private threeService: ThreeService) { }

  ngOnInit(): void {
    this.threeService.createScene(this.rendererCanvas);
  }

}
