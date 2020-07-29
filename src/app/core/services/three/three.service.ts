import { Injectable, OnDestroy, OnInit, NgZone, ElementRef } from '@angular/core';

import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshToonMaterial, MeshLambertMaterial, Vector3 } from 'three';
import * as Three from 'three';

import { ColorService } from 'src/app/core/services/color.service';
import { LoggerService } from '../logger.service';

@Injectable({
  providedIn: 'root'
})
export class ThreeService {

  scene: Three.Scene;
  camera: Three.PerspectiveCamera;
  colors: any;
  renderer: Three.WebGLRenderer;
  frameId: number = null;
  loader: GLTFLoader;
  modelTexture: Three.MeshLambertMaterial;
  mesh: Three.Mesh;
  light: Three.PointLight;
  light2: Three.PointLight;
  gltf: GLTF;
  pivot: Three.Group;
  mousex: number;
  rendererCanvas: ElementRef<any>;
  backGroundCol: string = '#501b1d';
  
  rotationVal: number = 0.05;
  autoRotationVal: number = 0.005;
  zoomNearLimit: number = 5;
  zoomFarLimit: number = 20;

  innerWidth: number;
  innerHeight: number;

  screenW: number;
  screenH: number;
  screenRatio: number;

  constructor(private colorService: ColorService, private ngZone: NgZone, private logger: LoggerService) { }

  ngOnInit(): void {
    // this.logger.log(5);
    // this.logger.log(this.test, 'test', 'green'); 
    this.colors = this.colorService.getColors();
  }

  ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  // get the dimension of ElementRef
  calcDimension() {
    this.innerWidth = this.rendererCanvas.nativeElement.offsetWidth;
    this.innerHeight = this.rendererCanvas.nativeElement.offsetHeight;
    this.logger.log( this.innerWidth, 'dimension')
  }

  //#region scene, light, camera setup function
  createScene(renderCanvas: ElementRef<any>) {
    this.rendererCanvas = renderCanvas;
    this.calcDimension();
    this.colors = this.colorService.getColors();
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initRenderer();   
    this.loadModel();
  }

  initScene() {
    this.scene = new Three.Scene();
    this.scene.position.y = -0.07;
  }

  initCamera() {
    this.camera = new Three.PerspectiveCamera( 3, this.innerWidth / this.innerHeight, 0.1, 1000 );
    this.camera.position.z = 7;
    this.camera.position.y = 0.07;
    this.camera.position.x = -0.1;
    
  }
  
  initRenderer() {
    this.renderer = new Three.WebGLRenderer({antialias:true});
    // set size
    this.modifyRenderer(this.innerWidth, this.innerHeight);
    
    // this.logger.log(this.renderer.domElement);
  }

  modifyRenderer(width: number, height: number) {
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(this.colors.deepred);
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

  initLight() {
    this.light = new Three.PointLight('#ffffff', 3, 5000);
    this.light.position.set(10, 25, 25);
    this.scene.add(this.light);
    this.light2 = new Three.PointLight(this.colors.darkpurple, 5, 5000);
    this.light2.position.set(2, 5, 5);
    this.scene.add(this.light2);
  }
  
  initHelpers() {
    var helper = new Three.CameraHelper( this.camera );
    this.scene.add( helper );
    var gridHelper = new Three.GridHelper( 10, 10,0x444423, 0x888887 );
    this.scene.add( gridHelper );

    var axesHelper = new Three.AxesHelper( 5 );
    this.scene.add( axesHelper );

  }

   // compute the render on window resize event
   resizeAction() {
    // this.screenW = event.target.innerWidth;
    // this.screenH = event.target.innerHeight;
    this.calcDimension();
    this.screenRatio = this.innerWidth / this.innerHeight;
    this.modifyRenderer(this.innerWidth, this.innerHeight);
    this.camera.aspect = this.screenRatio;
    this.camera.updateProjectionMatrix();
    this.computeRender();
  }

  //#endregion

  //#region animation auto
  animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.rotate();
        // this.logger.log('animate');
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.rotate();
        });
      }
    });
  }

  // three js recursive animation func
  rotate() {
    this.frameId = requestAnimationFrame(() => {
      this.rotate();
    });
    this.pivot.rotation.y += this.autoRotationVal;
    this.computeRender()
  }

  //#endregion

 

  // model loading function
  //TODO => make it generic for other models
  loadModel() {
    this.loader = new GLTFLoader();
    this.loader.load('../../assets/3dmodels/victoire.gltf', 
    (gltf)=> {
      console.dir(gltf)
      this.gltf = gltf;
      var box = new Three.Box3().setFromObject( gltf.scene );
      // Reset mesh position:
      box.getCenter(gltf.scene.position);
      gltf.scene.position.multiplyScalar(-0.12);
      this.pivot = new Three.Group();
      this.scene.add(this.pivot);
      this.pivot.add(this.gltf.scene);
      this.gltf.scene.scale.set(1.2,1.2,1.2);
     
      this.gltf.scene.translateX(-0.06);
      this.gltf.scene.translateZ(0.06);
      
      // var axesHelper = new Three.AxesHelper( 5 );
      // this.gltf.scene.add( axesHelper );

      // console.dir(this.scene);

      // while(true) {
      //   this.pivot.rotation.y += 0.1;
      // }
      // requestAnimationFrame(()=> {
      //   this.logger.log('anim')
      //   this.pivot.rotation.y += 0.01;
      // })
      
      this.computeRender();
      this.animate()
    },
    undefined,
    (err)=> {
      // this.logger.log(err,'error :', 'red')
    });
  }

  //#region  mouse event animation

  //rotation on mouse drag
  onMouseDragAction(event){
    if(event.buttons == 1) {
      if(this.mousex < event.clientX){
        this.pivot.rotateY(this.rotationVal);
      }
      else {
        this.pivot.rotateY(-this.rotationVal);
      }
      this.mousex = event.clientX;
      this.computeRender();
    }
  }

  //zoom on  mouseWheel event
  // y => deltaY of wheel event
  zoom(y: number) {
    if(y < 0 && this.camera.position.z > this.zoomNearLimit) {
      this.camera.position.z -= 0.5;
    }
    else if(y > 0 && this.camera.position.z < this.zoomFarLimit) {
      this.camera.position.z += 0.5;
    }
    this.computeRender();
  }

  //#endregion
}
