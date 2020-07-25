import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { LoggerService } from 'src/app/core/services/logger.service';
import * as Three from 'three';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  // test: number = 4;
  scene: Three.Scene = new Three.Scene();
  camera: Three.PerspectiveCamera;
  renderer: Three.WebGLRenderer;

  @ViewChild('renderer', {static: true})
  rendererCanvas: ElementRef<HTMLDivElement>;

  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.modifyRenderer(event.target.innerWidth, event.target.innerHeight);
    this.camera.aspect = event.target.innerWidth / event.target.innerHeight;
    this.camera.updateProjectionMatrix();
  }
  
  constructor(private logger: LoggerService) { }

  ngOnInit(): void {
    // this.logger.log(5);
    // this.logger.log(this.test, 'test', 'green'); 
    this.initCamera();
    this.initRenderer();   
    this.computeRender();
  }

  initCamera() {
    this.camera = new Three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  }

  initRenderer() {
    this.renderer = new Three.WebGLRenderer();
    // set size
    this.modifyRenderer(window.innerWidth, window.innerHeight);
    
    this.logger.log(this.renderer.domElement);
  }

  modifyRenderer(width: number, height: number, color: string = "#2c3647") {
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(color);
    this.render();
  }

  render() {
    // insert to DOM
    this.rendererCanvas.nativeElement.appendChild(this.renderer.domElement);
    this.computeRender();
  }

  computeRender() {
    this.renderer.render(this.scene, this.camera);
  }

}
