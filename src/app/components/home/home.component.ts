import { Component, OnInit, ViewChild, ElementRef, HostListener, NgZone } from '@angular/core';
import { LoggerService } from 'src/app/core/services/logger.service';
import * as Three from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ColorService } from 'src/app/core/services/color.service';
import { MeshToonMaterial, MeshLambertMaterial, Vector3 } from 'three';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  screenW: number;
  screenH: number;
  screenRatio: number;
  
  // test: number = 4;
  colors: any;
  backGroundCol: string = '#501b1d';
  scene: Three.Scene;
  camera: Three.PerspectiveCamera;
  renderer: Three.WebGLRenderer;
  loader: GLTFLoader;
  modelTexture: Three.MeshLambertMaterial;
  mesh: Three.Mesh;
  light: Three.PointLight;
  light2: Three.PointLight;
  gltf: GLTF;
  pivot: Three.Group;
  mousex: number;
  rotationVal: number = 0.05
  private frameId: number = null;

  @ViewChild('renderer', {static: true})
  rendererCanvas: ElementRef<HTMLDivElement>;

  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.resizeAction(event);
  }

  @HostListener('mousemove', ['$event'])
  onMouseDrag(event){
    this.onMouseDragAction(event);
  }

  @HostListener('wheel', ['$event']) // for window scroll events
  onScroll(event) {
    this.zoom(event.deltaY);
  }

  
  
  constructor(private logger: LoggerService, private colorService: ColorService, private ngZone: NgZone) { }

  ngOnInit(): void {
    // this.logger.log(5);
    // this.logger.log(this.test, 'test', 'green'); 
    this.colors = this.colorService.getColors();
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initRenderer();   
    this.loadModel();
   
    // var axesHelper = new Three.AxesHelper( 5 );
    // this.scene.add( axesHelper );
    // this.initHelpers()
    // this.computeRender();
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  initScene() {
    this.scene = new Three.Scene();
    this.scene.position.y = -0.07;
  }

  initCamera() {
    this.camera = new Three.PerspectiveCamera( 3, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 7;
    this.camera.position.y = 0.07;
    this.camera.position.x = -0.1;
    
  }

  initHelpers() {
    var helper = new Three.CameraHelper( this.camera );
    this.scene.add( helper );
    var gridHelper = new Three.GridHelper( 10, 10,0x444423, 0x888887 );
    this.scene.add( gridHelper );

    var axesHelper = new Three.AxesHelper( 5 );
    this.scene.add( axesHelper );

  }

  initRenderer() {
    this.renderer = new Three.WebGLRenderer({antialias:true});
    // set size
    this.modifyRenderer(window.innerWidth, window.innerHeight);
    
    this.logger.log(this.renderer.domElement);
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
  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.rotate();
        console.log('animate')
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.rotate();
        });
      }
    });
  }

  rotate() {
    this.frameId = requestAnimationFrame(() => {
      this.rotate();
    });

    this.pivot.rotation.y += 0.005;
    this.computeRender()
  }

  resizeAction(event) {
    this.screenW = event.target.innerWidth;
    this.screenH = event.target.innerHeight;
    this.screenRatio = this.screenW / this.screenH;
    this.modifyRenderer(this.screenW, this.screenH);
    this.camera.aspect = this.screenRatio;
    this.camera.updateProjectionMatrix();
    this.computeRender();
  }

  zoom(y: number) {
    if(y < 0 && this.camera.position.z > 5) {
      this.camera.position.z -= 0.5;
    }
    else if(y > 0 && this.camera.position.z < 20) {
      this.camera.position.z += 0.5;
    }
    this.computeRender();
  }

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
      //   console.log('anim')
      //   this.pivot.rotation.y += 0.01;
      // })
      
      this.computeRender();
      this.animate()
    },
    undefined,
    (err)=> {
      this.logger.log(err,'error :', 'red')
    });
  }


  initLight() {
    this.light = new Three.PointLight('#ffffff', 3, 5000);
    this.light.position.set(10, 25, 25);
    this.scene.add(this.light);
    this.light2 = new Three.PointLight(this.colors.darkpurple, 5, 5000);
    this.light2.position.set(2, 5, 5);
    this.scene.add(this.light2);
  }

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

}
