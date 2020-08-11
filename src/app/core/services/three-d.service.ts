import { Injectable, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import * as Three from 'three';
import { ColorService } from './color.service';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
        console.dir(gltf)
        this.gltf = gltf;

        // Reset mesh position: center model
        var box = new Three.Box3().setFromObject(gltf.scene);
        box.getCenter(gltf.scene.position);
        gltf.scene.position.multiplyScalar(-0.12);
        this.pivot = new Three.Group();
        this.scene.add(this.pivot);
        this.pivot.add(this.gltf.scene);
        this.gltf.scene.scale.set(1.1, 1.1, 1.1);

        //X => horizontal
        //Y => Vertical
        //Z => depth

        this.gltf.scene.translateX(-0.06);
        this.gltf.scene.translateZ(0.06);
        // this.gltf.scene.translateZ(0.1);
        // this.gltf.scene.translateY(0.02);

       

        this.computeRender();
        this.animate()
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
    this.frameId = requestAnimationFrame(() => {
      this.rotate();
    });
    this.pivot.rotation.y += this.autoRotationVal;
    // this.menuItems.forEach(x => {
    //   x.rotation.y -= this.autoRotationVal;
    // })
    this.computeRender()
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
}
