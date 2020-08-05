import { Injectable, OnDestroy, OnInit, NgZone, ElementRef } from '@angular/core';

import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshToonMaterial, MeshLambertMaterial, Vector3 } from 'three';
import * as Three from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { ColorService } from 'src/app/core/services/color.service';
import { LoggerService } from '../logger.service';
import { promise } from 'protractor';
import { interval } from 'rxjs';
import { threadId } from 'worker_threads';

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
  mouseX: number;
  mouseY: number;
  rendererCanvas: ElementRef<any>;
  backGroundCol: string = '#501b1d';

  menuItems: Three.Mesh[] = [];

  rotationVal: number = 0.05;
  autoRotationVal: number = 0.001;
  zoomNearLimit: number = 5;
  zoomFarLimit: number = 20;

  cylLines: Three.LineSegments;

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
    this.logger.log(this.innerWidth, 'dimension')
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
    this.camera = new Three.PerspectiveCamera(3, this.innerWidth / this.innerHeight, 0.1, 1000);
    this.camera.position.z = 7;
    this.camera.position.y = 0.07;
    this.camera.position.x = -0.1;

  }

  loadText(text: string) {
    var load2 = new Three.FontLoader();

    load2.load('../../assets/Heebo_Regular.json', (font) => {
      var textGeo = new Three.TextGeometry(text, {
        font: font,
        size: 0.2,
        height: 0.01,
        curveSegments: 21,
        bevelEnabled: false
      });

      var textMaterial = new Three.MeshPhongMaterial({ color: 0xdddddd });
      var mesh = new Three.Mesh(textGeo, textMaterial);
      mesh.position.set(-0.1, 0.26, 0.15);
      mesh.scale.set(0.15, 0.15, 0.15);
      // mesh.rotation.y = 90;
      this.menuItems.push(mesh)
      this.menuItems.forEach((x) => {

        this.pivot.add(x);

      })
    });

  }

  initRenderer() {
    this.renderer = new Three.WebGLRenderer({ antialias: true });
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
    var helper = new Three.CameraHelper(this.camera);
    this.scene.add(helper);
    var gridHelper = new Three.GridHelper(10, 10, 0x444423, 0x888887);
    this.scene.add(gridHelper);

    var axesHelper = new Three.AxesHelper(5);
    this.scene.add(axesHelper);

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
    // this.menuItems.forEach(x => {
    //   x.rotation.y -= this.autoRotationVal;
    // })
    this.computeRender()
  }

  //#endregion



  // model loading function
  //TODO => make it generic for other models
  loadModel() {
    this.loader = new GLTFLoader();
    this.loader.load('../../assets/3dmodels/victoire.gltf',
      (gltf) => {
        console.dir(gltf)
        this.gltf = gltf;


        //box helper
        // var box1 = new Three.BoxHelper(this.gltf.scene, 0xffff00);
        // this.gltf.scene.add(box1);




        // Reset mesh position: center model
        var box = new Three.Box3().setFromObject(gltf.scene);
        box.getCenter(gltf.scene.position);
        gltf.scene.position.multiplyScalar(-0.12);
        this.pivot = new Three.Group();
        this.scene.add(this.pivot);
        this.pivot.add(this.gltf.scene);
        this.gltf.scene.scale.set(1.2, 1.2, 1.2);

        this.gltf.scene.translateX(-0.06);
        this.gltf.scene.translateZ(0.06);

        //cylinder

        var geometry = new Three.CylinderGeometry(0.15, 0.15, 0.05, 32);

        var wireframe = new Three.WireframeGeometry(geometry);
        this.cylLines = new Three.LineSegments(wireframe);
        this.cylLines.material['depthTest'] = false;
        this.cylLines.material['opacity'] = 0.25;
        this.cylLines.material['transparent'] = true;
        this.cylLines.position.y = 0.28;
        //  this.cylLines.position.set(this.pivot.position.x, this.pivot.position.y, this.pivot.position.z)
        // this.loadText('Experience');
        this.loadHtml();
        this.pivot.add(this.cylLines)
        console.dir(this.pivot)

        //grid helper
        var size = 0.5;
        var divisions = 10;
        var gridHelper = new Three.GridHelper(size, divisions);
        this.gltf.scene.add(gridHelper);

        this.placeMarkers();
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
      (err) => {
        // this.logger.log(err,'error :', 'red')
      });
  }

  placeMarkers() {
    var geometry = new Three.SphereGeometry(0.002, 32, 32);
    var material = new Three.MeshBasicMaterial({ color: this.colors.darkLila });
    var sphere = new Three.Mesh(geometry, material);
    sphere.position.set(.06, 0.2, -0.15)
    this.gltf.scene.add(sphere);
  }

  //#region  mouse event animation

  //rotation on mouse drag
  onMouseDragAction(event) {
    if (event.buttons == 1) {
      if (this.mouseX < event.clientX) {
        this.pivot.rotateY(this.rotationVal);
      }
      if (this.mouseX > event.clientX) {
        this.pivot.rotateY(-this.rotationVal);
      }
      this.mouseX = event.clientX;

      // to comment dev purpose
      // if(this.mouseY < event.clientY){
      //   this.pivot.rotateX(this.rotationVal);
      // }
      // if(this.mouseY > event.clientY){
      //   this.pivot.rotateX(-this.rotationVal);
      // }
      // this.mouseY = event.clientY;


      this.computeRender();
    }
  }

  //zoom on  mouseWheel event
  // y => deltaY of wheel event
  zoom(y: number) {
    if (y < 0 && this.camera.position.z > this.zoomNearLimit) {
      this.camera.position.z -= 0.1;
    }
    else if (y > 0 && this.camera.position.z < this.zoomFarLimit) {
      this.camera.position.z += 0.1;
    }
    this.computeRender();
  }

  loadHtml(){
  //   var element = document.createElement('a');
  //   element.setAttribute('href', 'https://github.com/mrdoob/three.js/blob/master/examples/css3d_periodictable.html');
  //   element.setAttribute('target', '_blank');
  //   // element.setAttribute('style', '{color: white;}')
  //   element.textContent ='coucou';
  //   var obj = new CSS2DObject(element);
  //  obj.position.z = 1;
  //  obj.position.y = 1;
  //  obj.position.x = 1;
  //   this.gltf.scene.add(obj);
  var earthDiv = document.createElement( 'div' );
				earthDiv.className = 'label';
				earthDiv.textContent = 'Earth dfsjddslfdlsdfgdsfiludsgfdsfdslfoifdsfkjlfdfdsufdsdifdfhuifsdfpmsdfspdfiusdhfdspfufpdsfh';
        earthDiv.style.color = 'white';
        earthDiv.style.width = '100px';
        earthDiv.style.height = '100px';
        earthDiv.style.backgroundColor = 'red';
				var earthLabel = new CSS3DObject( earthDiv );
        // earthLabel.position.set( 0.1, 0.28, 0.1 );
        // earthLabel.position.y = 0.28;
        var labelRenderer = new CSS3DRenderer();
				labelRenderer.setSize( this.innerWidth, this.innerHeight );
				labelRenderer.domElement.style.position = 'absolute';
				labelRenderer.domElement.style.top = '0px';
        this.rendererCanvas.nativeElement.appendChild( labelRenderer.domElement );
        labelRenderer.render(this.scene, this.camera)
        console.log('scene')
        console.dir(this.scene)
        this.cylLines.add(earthLabel)
        this.computeRender()
  }

  //#endregion
}
