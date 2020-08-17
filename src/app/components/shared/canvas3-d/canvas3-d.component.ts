import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ThreeDService } from 'src/app/core/services/three-d.service';

@Component({
  selector: 'app-canvas3-d',
  templateUrl: './canvas3-d.component.html',
  styleUrls: ['./canvas3-d.component.scss']
})
export class Canvas3DComponent implements OnInit {

  @ViewChild('renderer', {static: true})
  rendererCanvas: ElementRef<HTMLDivElement>;

  @HostListener('window:resize')
  onResize(){
    this.threeDService.resizeAction();
  }

  @HostListener('mousemove', ['$event'])
  onMouseDrag(event){
    // this.threeService.onMouseDragAction(event);
  }

  // @HostListener('wheel', ['$event']) // for window wheel events
  // onWheel(event) {
   
  //   // this.threeService.zoom(event.deltaY);
  // }
   @HostListener('window:scroll', ['$event'])
   onScroll(event) {
     this.threeDService.upDateDisplayCoord(window.pageYOffset);
    //  console.log('scroll', window.pageYOffset)
   }

  constructor(private threeDService: ThreeDService) { }

  ngOnInit(): void {
    this.threeDService.createScene(this.rendererCanvas);
    
  }

}
