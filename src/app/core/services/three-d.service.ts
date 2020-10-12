import { Injectable, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import * as Three from 'three';
import { ColorService } from './color.service';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CheckPoint } from '../models/checkPoints.model';
import { Vector3 } from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreeDService implements OnInit, OnDestroy{

  rendererCanvas: ElementRef<HTMLElement>;

  innerWidth: number;
  innerHeight: number;

  colors: any;

  scene: Three.Scene;
  camera: Three.PerspectiveCamera;
  light: Three.PointLight;
  light2: Three.PointLight;
  renderer: Three.WebGLRenderer;

  gltf: GLTF;
  loader: GLTFLoader;
  pivot: Three.Group;
  autoRotationVal: number = 0.001;
  screenRatio: number;

  frameId: number = null;

  isAnimated = true;

  scrollPosY : number;

  checkPoints: CheckPoint[] = [];
  actualCheckPoints: CheckPoint[] = [];

  actualPosition: Three.Vector3;
  actualAngle: number;

  constructor(private colorService: ColorService, private ngZone: NgZone) { }

  ngOnInit(): void {
    
    // this.colors = this.colorService.getColors();

  }

  ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  createScene(renderHtmlEl: ElementRef<HTMLElement> ): void {
    this.rendererCanvas = renderHtmlEl;
    this.colors = this.colorService.getColors();
    this.calcDimension();
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initRenderer();
    this.loadModel();
  }

  calcDimension(): void {
    this.innerWidth = this.rendererCanvas.nativeElement.offsetWidth;
    this.innerHeight = this.rendererCanvas.nativeElement.offsetHeight;
    // this.logger.log(this.innerWidth, 'dimension')
  }

  initScene(): void {
    this.scene = new Three.Scene();
    this.scene.position.y = -0.05;
    this.scene.position.x = 0.05;
    this.scene.position.z = 1;
    
    // console.log(this.scene.position)
  }
  
  initCamera(): void {
    this.camera = new Three.PerspectiveCamera(3, this.innerWidth / this.innerHeight, 0.1, 1000);
    this.camera.position.z = 7;
    this.camera.position.y = 0.07;
    this.camera.position.x = -0.1;

  }

  initLight(): void {
    this.light = new Three.PointLight('#ffffff', 3, 5000);
    this.light.position.set(10, 25, 25);
    this.scene.add(this.light);
    this.light2 = new Three.PointLight(this.colors.darkpurple, 5, 5000);
    this.light2.position.set(2, 5, 5);
    this.scene.add(this.light2);
  }

  initRenderer(): void {
    // antializing to soften model polygons
    // alpha treu to enable background transparency 
    this.renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
    // set size
    this.modifyRenderer(this.innerWidth, this.innerHeight);

    // this.logger.log(this.renderer.domElement);
  }

  modifyRenderer(width: number, height: number): void {
    this.renderer.setSize(width, height);
    // this.renderer.setClearColor(this.colors.deepred);
    this.renderer.setClearColor( 0x000000, 0 );
    this.render();

  }

  render(): void {
    // insert to DOM
    // this.renderer.domElement.style.backgroundColor = 'transparent';
    this.rendererCanvas.nativeElement.appendChild(this.renderer.domElement);
    this.computeRender();
  }

  computeRender(): void {
    this.renderer.render(this.scene, this.camera);

  }

  loadModel(): void {
    this.loader = new GLTFLoader();
    this.loader.load('../../assets/3dmodels/victoire.gltf',
      (gltf) => {
        // console.dir(gltf)
        this.gltf = gltf;

        // Reset mesh position: center model
        // var box = new Three.Box3().setFromObject(gltf.scene);
        // box.getCenter(gltf.scene.position);
        // gltf.scene.position.multiplyScalar(-0.12);
        this.pivot = new Three.Group();
        this.scene.add(this.pivot);
        this.pivot.add(this.gltf.scene);
        this.gltf.scene.scale.set(1, 1, 1);

        //X => horizontal
        //Y => Vertical
        //Z => depth

        this.gltf.scene.translateX(-0.06);
        this.gltf.scene.translateZ(0.06);
        // this.gltf.scene.translateZ(0.1);
        // this.gltf.scene.translateY(0.02);

       

        this.computeRender();
        this.animate();
        setTimeout(()=>{
          // this.moveSim();s

        }, 2000)
      },
      undefined,
      (err) => {
        // this.logger.log(err,'error :', 'red')
      });
  }

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
  rotate(): void {
    if(this.isAnimated) {
      this.frameId = requestAnimationFrame(() => {
        this.rotate();
      });
      this.pivot.rotation.y += this.autoRotationVal;
      // console.log(this.pivot.rotation.y % this.degToRad(360))
      // this.menuItems.forEach(x => {
      //   x.rotation.y -= this.autoRotationVal;
      // })
      this.computeRender();
    }
  }

  //#endregion

  resizeAction(): void {
    // this.screenW = event.target.innerWidth;
    // this.screenH = event.target.innerHeight;
    this.calcDimension();
    this.screenRatio = this.innerWidth / this.innerHeight;
    this.modifyRenderer(this.innerWidth, this.innerHeight);
    this.camera.aspect = this.screenRatio;
    this.camera.updateProjectionMatrix();
    this.computeRender();
  }

  // moveToCoord() {
  //   this.stopRotation();
  // }

  stopRotation(): void {
    this.isAnimated = false;
  }

  startRotation(): void {
    this.isAnimated = true;
    this.animate();
  }

  upDateDisplayCoord(scrollY: number) {
    this.scrollPosY = scrollY;
    this.stopRotation();
    this.pivot.rotateY(this.degToRad(1))
    // console.log(this.pivot.rotation.y);
    this.findCheckPoint(this.scrollPosY);
    // Math
    // console.log(this.scrollPosY);
  }

  findCheckPoint(scrollY: number) {
   
  }

  moveSim() {
    this.moveTo(new Three.Vector3(-0.2,1,-1), 0);
  }

  move(x, y, z, a) {
    requestAnimationFrame(() => {
      this.move(x,y,z,a);
    });
    // if(this.pivot.rotation.y >= a) {
    //   this.pivot.rotation.y -= a/100;
    // }
    if(this.pivot.position.x >= x) {
      this.pivot.position.x += x/100;
      // console.log(this.pivot.position.x)
    }
    if(this.pivot.position.y >= y) {
      this.pivot.position.y += y/100;
      // console.log(this.pivot.position.y)
    }
    if(this.pivot.position.z >= z) {
      this.pivot.position.z += z/100;
      // console.log(this.pivot.position.z)
    }
    // console.log(this.pivot.rotation.y % this.degToRad(360))
    // this.menuItems.forEach(x => {
    //   x.rotation.y -= this.autoRotationVal;
    // })
    this.computeRender();
  }

  moveTo(aimPosition: Three.Vector3, aimAngle: number) {
    this.getActualPosition();
    this.stopRotation();
    let aimX = aimPosition.x - this.actualPosition.x;
    let aimY = aimPosition.y - this.actualPosition.y;
    let aimZ = aimPosition.z - this.actualPosition.z;
    let aimAng = aimAngle - this.actualAngle;
    // console.log(`to move x: ${aimX}, y: ${aimY}, z: ${aimZ}, angle: ${aimAng}`);
    this.move(aimX, aimY, aimZ, aimAng)
  }

  getActualPosition(){
    this.actualPosition = new Three.Vector3(
      this.pivot.position.x,
      this.pivot.position.y,
      this.pivot.position.z,
    );
    this.actualAngle = this.pivot.rotation.y;
    // console.log(`àctual x:${this.actualPosition.x}, y: ${this.actualPosition.y}, z:${this.actualPosition.z}, ang:${this.actualAngle}`)
  }

  degToRad(deg: number): number {
    return deg * Math.PI / 180;
  }

  addCheckPoint(cp: CheckPoint): void {
    this.checkPoints.push(cp);
    // console.log(this.checkPoints);
  }
}
