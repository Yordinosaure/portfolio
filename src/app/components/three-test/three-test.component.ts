import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ThreeService } from 'src/app/core/services/three/three.service';
@Component({
  selector: 'app-three-test',
  templateUrl: './three-test.component.html',
  styleUrls: ['./three-test.component.scss']
})
export class ThreeTestComponent implements OnInit {

  @ViewChild('renderer', {static: true})
  rendererCanvas: ElementRef<HTMLDivElement>;

  @HostListener('window:resize')
  onResize(){
    this.threeService.resizeAction();
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
